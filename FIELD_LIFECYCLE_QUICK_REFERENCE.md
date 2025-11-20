# 🚀 Field Lifecycle Quick Reference

## 📦 New Components

### 1. Field Memory Service
```typescript
import { fieldMemoryService } from './lib/fieldMemoryService';

// Get smart defaults for reactivation
const defaults = await fieldMemoryService.getReactivationDefaults(fieldId);
// Returns: suggestedCrop, alternatives, risks, rotation benefit, confidence

// Get quick action buttons
const actions = await fieldMemoryService.getQuickActions(fieldId);
// Returns: [{ label, crop, icon, benefit }, ...]
```

### 2. Enhanced Reactivation Modal
```typescript
import { FieldReactivationModal } from './components/soilsati/FieldReactivationModal';

<FieldReactivationModal
  fieldId={field.id}
  fieldName={field.name}
  currentStatus={field.status}
  lastCropType={field.last_crop_type}
  dormantUntil={field.lifecycle_metadata?.dormantUntil}
  onReactivate={(crop, metadata) => {
    // Handle reactivation
  }}
  onClose={() => setShowModal(false)}
/>
```

### 3. Field Status Badge
```typescript
import { FieldStatusBadge } from './components/soilsati/FieldStatusBadge';

<FieldStatusBadge 
  status={field.status}
  harvestDate={field.harvest_date}
  dormantUntil={field.lifecycle_metadata?.dormantUntil}
  size="md"
  showLabel={true}
/>
```

### 4. Lifecycle Dashboard
```typescript
import { FieldLifecycleDashboard } from './components/soilsati/FieldLifecycleDashboard';

<FieldLifecycleDashboard />
```

## 🔧 Key Functions

### Field Memory Service

```typescript
// Get reactivation defaults
const defaults = await fieldMemoryService.getReactivationDefaults(fieldId);
console.log(defaults.suggestedCrop); // "Wheat"
console.log(defaults.alternativeCrops); // ["Pulses", "Vegetables"]
console.log(defaults.rotationBenefit); // "Excellent rotation! Wheat after rice..."
console.log(defaults.riskFactors); // ["Monocropping risk: ..."]
console.log(defaults.confidence); // "high" | "medium" | "low"

// Get quick actions
const actions = await fieldMemoryService.getQuickActions(fieldId);
actions.forEach(action => {
  console.log(action.label); // "Sow Wheat"
  console.log(action.crop); // "Wheat"
  console.log(action.icon); // "🌾"
  console.log(action.benefit); // "Excellent rotation! ..."
});
```

### Field Lifecycle Service

```typescript
import { fieldLifecycleService } from './lib/fieldLifecycleService';

// Check if field should fetch data
const shouldFetch = fieldLifecycleService.shouldFetchData(field.status);
// Returns: true for 'active', false for 'harvested'/'dormant'

// Detect harvest candidates
const candidates = await fieldLifecycleService.detectHarvestCandidates();
candidates.forEach(candidate => {
  console.log(candidate.fieldName);
  console.log(candidate.confidence); // "high" | "medium" | "low"
  console.log(candidate.ndviDropPercent); // 65
});

// Confirm harvest
await fieldLifecycleService.confirmHarvest(fieldId, {
  peakNDVI: 0.85,
  peakNDRE: 0.78,
  notes: "Good harvest"
});

// Reactivate field
await fieldLifecycleService.reactivateField(fieldId, "Wheat", {
  reactivationReason: "New crop sowing",
  sowingDate: "2024-11-17"
});

// Get cost savings stats
const stats = await fieldLifecycleService.getCostSavingsStats();
console.log(stats.totalFields); // 10
console.log(stats.activeFields); // 3
console.log(stats.inactiveFields); // 7
console.log(stats.estimatedSavingsPercent); // 70
```

## 📊 Data Structures

### ReactivationDefaults
```typescript
interface ReactivationDefaults {
  suggestedCrop: string;
  alternativeCrops: string[];
  irrigationMethod: string;
  variety?: string;
  sowingWindow: { start: string; end: string };
  expectedYield?: number;
  riskFactors: string[];
  rotationBenefit?: string;
  confidence: 'high' | 'medium' | 'low';
}
```

### HarvestCandidate
```typescript
interface HarvestCandidate {
  fieldId: string;
  fieldName: string;
  currentNDVI: number;
  currentNDRE: number;
  peakNDVI: number;
  peakNDRE: number;
  ndviDropPercent: number;
  ndreDropPercent: number;
  consecutiveDays: number;
  detectedDate: string;
  confidence: 'high' | 'medium' | 'low';
}
```

### FieldStatus
```typescript
type FieldStatus = 'active' | 'harvested' | 'dormant';
```

## 🎨 UI Components

### Status Badge Variants
```typescript
// Small badge
<FieldStatusBadge status="active" size="sm" />

// Medium badge (default)
<FieldStatusBadge status="harvested" size="md" harvestDate="2024-10-15" />

// Large badge
<FieldStatusBadge status="dormant" size="lg" dormantUntil="2024-11-20" />

// Without label
<FieldStatusBadge status="active" showLabel={false} />
```

### Status Indicator (Dot)
```typescript
import { FieldStatusIndicator } from './components/soilsati/FieldStatusBadge';

<FieldStatusIndicator status="active" size={12} />
```

## 🔄 Crop Rotation Patterns

### Built-in Patterns
```typescript
Rice → Wheat, Pulses, Vegetables, Maize
Wheat → Rice, Cotton, Sugarcane, Pulses
Cotton → Wheat, Soybean, Pulses
Sugarcane → Wheat, Pulses, Vegetables
Maize → Wheat, Pulses, Vegetables
Soybean → Wheat, Cotton, Maize
Pulses → Rice, Wheat, Cotton, Maize
Vegetables → Rice, Wheat, Pulses
```

### Seasonal Crops
```typescript
Kharif (Jun-Oct): Rice, Cotton, Soybean, Maize, Pulses
Rabi (Nov-Feb): Wheat, Pulses, Vegetables
Zaid (Mar-May): Vegetables, Maize, Pulses
```

## ⚙️ Configuration

### Customize Rotation Patterns
```typescript
// In fieldMemoryService.ts
private readonly ROTATION_PATTERNS: Record<string, string[]> = {
  'Rice': ['Wheat', 'Pulses', 'Vegetables', 'Maize'],
  'YourCrop': ['NextCrop1', 'NextCrop2'],
  // Add more
};
```

### Customize Rotation Benefits
```typescript
// In fieldMemoryService.ts
private calculateRotationBenefit(lastCrop: string, nextCrop: string): string {
  const benefits: Record<string, Record<string, string>> = {
    'Rice': {
      'Wheat': 'Your custom message',
      // Add more
    },
  };
  return benefits[lastCrop]?.[nextCrop] || 'Default message';
}
```

### Customize Sowing Windows
```typescript
// In fieldMemoryService.ts
const windows: Record<string, Record<string, { start: string; end: string }>> = {
  'kharif': {
    'Rice': { start: '2024-06-15', end: '2024-07-31' },
    // Adjust dates
  },
};
```

## 🧪 Testing

### Test Reactivation
```typescript
// 1. Create field with crop "Rice"
// 2. Mark as harvested
// 3. Open reactivation modal
// 4. Should suggest: Wheat, Pulses, Vegetables
// 5. Should show rotation benefits
```

### Test Seasonal Intelligence
```typescript
// June-October (Kharif)
const defaults = await fieldMemoryService.getReactivationDefaults(fieldId);
// Should suggest: Rice, Cotton, Soybean, Maize, Pulses

// November-February (Rabi)
// Should suggest: Wheat, Pulses, Vegetables

// March-May (Zaid)
// Should suggest: Vegetables, Maize, Pulses
```

### Test Risk Assessment
```typescript
// Grow same crop 3 times
// Try to reactivate with same crop
// Should show: "Monocropping risk: Same crop grown recently"
```

## 🐛 Troubleshooting

### No quick actions showing
```typescript
// Check if field has last_crop_type or crop_type
const field = await supabase
  .from('fields')
  .select('*')
  .eq('id', fieldId)
  .single();

console.log(field.last_crop_type); // Should not be null
```

### Wrong season suggestions
```typescript
// Check current season detection
const season = getCurrentSeason();
console.log(season); // "kharif" | "rabi" | "zaid"

// Verify month logic
const month = new Date().getMonth() + 1;
// 6-10: kharif, 11-2: rabi, 3-5: zaid
```

### No rotation benefit message
```typescript
// Add pattern to ROTATION_PATTERNS
'YourCrop': ['NextCrop1', 'NextCrop2'],

// Add benefit message
'YourCrop': {
  'NextCrop1': 'Your benefit message',
},
```

## 📈 Performance

### Optimization Tips
```typescript
// Cache field history
const history = await getCropHistory(fieldId);
// Store in state/context to avoid repeated queries

// Batch queries
const [defaults, actions, stats] = await Promise.all([
  fieldMemoryService.getReactivationDefaults(fieldId),
  fieldMemoryService.getQuickActions(fieldId),
  fieldLifecycleService.getCostSavingsStats()
]);

// Use loading states
const [loading, setLoading] = useState(true);
// Show skeleton while loading
```

## 🔐 Security

### RLS Policies
```sql
-- Fields table already has RLS
-- field_lifecycle_events inherits from fields
-- No additional policies needed
```

### Data Privacy
```typescript
// Field memory uses only user's own data
// No cross-user data access
// Anonymized peer comparison (future)
```

## 📚 Documentation

### Full Docs
- `FIELD_LIFECYCLE_ENHANCEMENTS.md` - Complete documentation
- `FIELD_LIFECYCLE_BEFORE_AFTER.md` - Visual comparison
- `FIELD_LIFECYCLE_ROADMAP.md` - Future phases
- `START_HERE_FIELD_LIFECYCLE_ENHANCEMENTS.md` - Quick start

### Code Files
- `src/lib/fieldMemoryService.ts` - Smart recommendations
- `src/lib/fieldLifecycleService.ts` - Lifecycle management
- `src/components/soilsati/FieldReactivationModal.tsx` - Enhanced modal
- `src/components/soilsati/FieldStatusBadge.tsx` - Status indicators
- `src/components/soilsati/FieldLifecycleDashboard.tsx` - Overview dashboard

## 🎯 Common Use Cases

### Use Case 1: Add Status Badge to Field Card
```typescript
<div className="field-card">
  <h3>{field.name}</h3>
  <FieldStatusBadge 
    status={field.status}
    harvestDate={field.harvest_date}
  />
  <p>{field.crop_type}</p>
</div>
```

### Use Case 2: Show Lifecycle Dashboard
```typescript
<div className="admin-panel">
  <h2>Field Management</h2>
  <FieldLifecycleDashboard />
</div>
```

### Use Case 3: Custom Reactivation Logic
```typescript
const handleReactivate = async () => {
  const defaults = await fieldMemoryService.getReactivationDefaults(fieldId);
  
  if (defaults.confidence === 'high') {
    // Auto-suggest with high confidence
    setCropType(defaults.suggestedCrop);
  } else {
    // Show all options
    setShowAdvanced(true);
  }
};
```

### Use Case 4: Harvest Alert System
```typescript
useEffect(() => {
  const checkHarvest = async () => {
    const candidates = await fieldLifecycleService.detectHarvestCandidates();
    
    if (candidates.length > 0) {
      // Show notification
      showNotification(`${candidates.length} fields ready for harvest`);
    }
  };
  
  checkHarvest();
  const interval = setInterval(checkHarvest, 24 * 60 * 60 * 1000); // Daily
  return () => clearInterval(interval);
}, []);
```

## 💡 Pro Tips

1. **Use Quick Actions**: Fastest way for farmers to reactivate
2. **Show Rotation Benefits**: Educates farmers about good practices
3. **Display Cost Savings**: Motivates adoption of lifecycle management
4. **Cache Defaults**: Avoid repeated API calls
5. **Handle Loading States**: Better UX during data fetching
6. **Test Seasonally**: Verify suggestions change with seasons
7. **Monitor Confidence**: Track recommendation accuracy
8. **Collect Feedback**: Improve rotation patterns over time

## 🚀 Quick Start Checklist

- [ ] Import components
- [ ] Add status badges to field lists
- [ ] Test reactivation modal
- [ ] Verify seasonal suggestions
- [ ] Check rotation benefits
- [ ] Test risk warnings
- [ ] Add lifecycle dashboard
- [ ] Monitor cost savings
- [ ] Collect user feedback
- [ ] Iterate and improve

Ready to use! 🎉
