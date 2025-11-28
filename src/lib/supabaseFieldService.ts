import { supabase, Field, FieldData } from './supabase';

export const supabaseFieldService = {
  // Get all fields for current user
  async getFields(): Promise<Field[]> {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('DEBUG: getFields - Current User:', user?.id);

    if (!user) {
      console.log('DEBUG: getFields - No user found');
      return [];
    }

    // 1. Fetch all fields (Query #1)
    const { data: fields, error } = await supabase
      .from('fields')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching fields:', error);
      return [];
    }

    if (!fields || fields.length === 0) {
      return [];
    }

    console.log('DEBUG: getFields - Fields found:', fields.length);

    // 2. Batch fetch latest data for ALL fields (Query #2)
    // We use a trick: fetch field_data where field_id is in our list
    // To get "latest" efficiently without window functions (which are complex in Supabase JS),
    // we fetch the last 30 days of data for these fields and filter in memory.
    // For 1000 users, this is much lighter on the DB than 6000 individual queries.
    const fieldIds = fields.map(f => f.id);

    const { data: allFieldData, error: dataError } = await supabase
      .from('field_data')
      .select('*')
      .in('field_id', fieldIds)
      .order('timestamp', { ascending: false })
      .limit(fieldIds.length * 5); // Fetch enough recent records

    if (dataError) {
      console.error('Error batch fetching field data:', dataError);
      // Fallback: return fields without data rather than failing
      return fields.map(field => ({
        ...field,
        ...field.lifecycle_metadata
      }));
    }

    // 3. Map latest data to fields in memory
    const fieldDataMap = new Map();
    if (allFieldData) {
      for (const dataPoint of allFieldData) {
        // Since we ordered by timestamp desc, the first one we see for a field is the latest
        if (!fieldDataMap.has(dataPoint.field_id)) {
          fieldDataMap.set(dataPoint.field_id, dataPoint);
        }
      }
    }

    // 4. Enrich fields
    return fields.map(field => {
      const latestData = fieldDataMap.get(field.id);

      // Base field with lifecycle metadata
      const enrichedField = {
        ...field,
        ...field.lifecycle_metadata
      };

      // Add latest sensor/satellite data if available
      if (latestData) {
        return {
          ...enrichedField,
          ndvi: latestData.ndvi,
          evi: latestData.evi,
          ndwi: latestData.ndwi,
          moisture: latestData.soil_moisture,
          temperature: latestData.temperature,
          health: {
            ndvi: latestData.ndvi,
            status: latestData.health_score > 0.7 ? "healthy" :
              latestData.health_score > 0.5 ? "monitor" :
                latestData.health_score > 0.3 ? "stress" : "unknown"
          },
          last_updated: latestData.timestamp
        };
      }

      return enrichedField;
    });
  },

  // Get field by ID
  async getFieldById(id: string): Promise<Field | null> {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching field:', error);
      return null;
    }

    return data ? {
      ...data,
      ...data.lifecycle_metadata
    } : null;
  },

  // Create new field
  async createField(field: Omit<Field, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Field | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('fields')
      .insert([{ ...field, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error creating field:', error);
      return null;
    }

    return data;
  },

  // Update field
  async updateField(id: string, updates: Partial<Field>): Promise<Field | null> {
    // If lifecycle_metadata is being updated, we should merge it with existing data
    let finalUpdates = { ...updates };

    if (updates.lifecycle_metadata) {
      const { data: existingField } = await supabase
        .from('fields')
        .select('lifecycle_metadata')
        .eq('id', id)
        .single();

      if (existingField) {
        finalUpdates.lifecycle_metadata = {
          ...(existingField.lifecycle_metadata || {}),
          ...updates.lifecycle_metadata
        };
      }
    }

    const { data, error } = await supabase
      .from('fields')
      .update(finalUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating field:', error);
      return null;
    }

    return data;
  },

  // Delete field
  async deleteField(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting field:', error);
      return false;
    }

    return true;
  },

  // Save field data (satellite, soil, etc.)
  async saveFieldData(fieldId: string, data: Omit<FieldData, 'id' | 'field_id' | 'created_at'>): Promise<FieldData | null> {
    const { data: result, error } = await supabase
      .from('field_data')
      .insert([{ ...data, field_id: fieldId }])
      .select()
      .single();

    if (error) {
      console.error('Error saving field data:', error);
      return null;
    }

    return result;
  },

  // Get field data history
  async getFieldDataHistory(fieldId: string, limit = 30): Promise<FieldData[]> {
    const { data, error } = await supabase
      .from('field_data')
      .select('*')
      .eq('field_id', fieldId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching field data:', error);
      return [];
    }

    return data || [];
  },

  // Get latest field data
  async getLatestFieldData(fieldId: string): Promise<FieldData | null> {
    const { data, error } = await supabase
      .from('field_data')
      .select('*')
      .eq('field_id', fieldId)
      .order('timestamp', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest field data:', error);
      return null;
    }

    // Return first item or null if array is empty
    return data && data.length > 0 ? data[0] : null;
  }
};
