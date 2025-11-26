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

    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching fields:', error);
      return [];
    }

    console.log('DEBUG: getFields - Fields found:', data?.length);
    return data?.map(field => ({
      ...field,
      ...field.lifecycle_metadata
    })) || [];
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
