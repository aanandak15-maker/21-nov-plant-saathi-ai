# 🚀 Weather Intelligence - Quick Integration Guide

## Quick Start (5 minutes)

### Option 1: Add to Field Details Page

```tsx
// src/components/soilsati/FieldDetailsDashboard.tsx

import { WeatherIntelligenceDashboard } from '../weather/WeatherIntelligenceDashboard';

// Add a new tab or section
<div className="mt-6">
  <h2 className="text-xl font-bold mb-4">Weather Intelligence</h2>
  <WeatherIntelligenceDashboard
    fieldId={field.id}
    lat={field.latitude}
    lon={field.longitude}
    cropType={field.cropType || 'Rice'}
  />
</div>
```

### Option 2: Add to Weather Page (Jal Saathi)

```tsx
// src/components/weather/JalSaathiView.tsx

import { WeatherIntelligenceDashboard } from './WeatherIntelligenceDashboard';
import { useState } from 'react';

export const JalSaathiView = ({ fieldId, cropType, location }) => {
  const [showIntelligence, setShowIntelligence] = useState(false);
  
  // Get coordinates from location
  const coords = typeof location === 'object' 
    ? location 
    : { lat: 28.6139, lon: 77.2090 }; // Default Delhi

  return (
    <div>
      {/* Existing Jal Saathi content */}
      
      {/* Add toggle button */}
      <Button 
        onClick={() => setShowIntelligence(!showIntelligence)}
        className="mt-4"
      >
        {showIntelligence ? 'Hide' : 'Show'} Advanced Weather Intelligence
      </Button>

      {/* Show intelligence dashboard */}
      {showIntelligence && (
        <div className="mt-6">
          <WeatherIntelligenceDashboard
            fieldId={fieldId || 'default'}
            lat={coords.lat}
            lon={coords.lon}
            cropType={cropType || 'Rice'}
          />
        </div>
      )}
    </div>
  );
};
```

### Option 3: Add to Dashboard (Critical Alerts Only)

```tsx
// src/components/dashboard/DashboardView.tsx

import { useEffect, useState } from 'react';
import { weatherAlertService } from '@/lib/weather/weatherAlertService';
import type { WeatherAlert } from '@/lib/weather/weatherAlertService';

export const DashboardView = () => {
  const [criticalAlerts, setCriticalAlerts] = useState<WeatherAlert[]>([]);

  useEffect(() => {
    loadCriticalAlerts();
  }, []);

  const loadCriticalAlerts = async () => {
    // Get user's fields from Supabase
    const fields = await getUserFields();
    
    // Check alerts for all fields
    const allAlerts = await Promise.all(
      fields.map(field =>
        weatherAlertService.checkFieldAlerts(
          field.id,
          field.latitude,
          field.longitude,
          field.crop_type
        )
      )
    );

    // Filter critical alerts
    const critical = allAlerts
      .flat()
      .filter(alert => alert.severity === 'critical')
      .slice(0, 3); // Show max 3

    setCriticalAlerts(critical);
  };

  return (
    <div>
      {/* Critical Weather Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">
            ⚠️ Critical Weather Alerts
          </h3>
          {criticalAlerts.map(alert => (
            <div key={alert.id} className="mb-2">
              <p className="font-medium text-red-700">{alert.title}</p>
              <p className="text-sm text-red-600">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Rest of dashboard */}
    </div>
  );
};
```

---

## 🎯 Standalone Usage Examples

### Example 1: Check Spray Windows

```typescript
import { weatherIntelligenceService } from '@/lib/weather/weatherIntelligenceService';

// Get spray windows for a field
const checkSprayWindows = async (lat: number, lon: number) => {
  const windows = await weatherIntelligenceService.getSprayWindows(lat, lon);
  
  // Find best window
  const best = windows.find(w => w.quality === 'excellent');
  
  if (best) {
    console.log(`Best spray time: ${best.date} ${best.startTime}-${best.endTime}`);
    console.log(`Conditions: Wind ${best.conditions.windSpeed}km/h, Humidity ${best.conditions.humidity}%`);
  } else {
    console.log('No excellent spray windows in next 4 days');
  }
};

// Usage
checkSprayWindows(28.4744, 77.5030);
```

### Example 2: Disease Risk Alert

```typescript
import { weatherIntelligenceService } from '@/lib/weather/weatherIntelligenceService';

// Check disease risks
const checkDiseaseRisk = async (lat: number, lon: number, crop: string) => {
  const risks = await weatherIntelligenceService.predictDiseaseRisk(lat, lon, crop);
  
  // Filter high risks
  const highRisks = risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical');
  
  if (highRisks.length > 0) {
    console.log(`⚠️ ${highRisks.length} high-risk diseases detected!`);
    highRisks.forEach(risk => {
      console.log(`- ${risk.disease}: ${risk.probability}% risk`);
      console.log(`  Prevention: ${risk.preventiveMeasures[0]}`);
    });
  } else {
    console.log('✅ Low disease risk');
  }
};

// Usage
checkDiseaseRisk(28.4744, 77.5030, 'Rice');
```

### Example 3: Smart Irrigation

```typescript
import { weatherIntelligenceService } from '@/lib/weather/weatherIntelligenceService';

// Get irrigation schedule
const getIrrigationAdvice = async (lat: number, lon: number, crop: string) => {
  const schedule = await weatherIntelligenceService.getIrrigationSchedule(lat, lon, crop);
  
  if (schedule.skipReason) {
    console.log(`💧 Skip irrigation: ${schedule.skipReason}`);
  } else {
    console.log(`💦 Irrigate on: ${schedule.nextIrrigationDate}`);
    console.log(`   Amount: ${schedule.amount}`);
    console.log(`   Timing: ${schedule.timing}`);
    console.log(`   Method: ${schedule.method}`);
  }
};

// Usage
getIrrigationAdvice(28.4744, 77.5030, 'Wheat');
```

### Example 4: 16-Day Advisory

```typescript
import { weatherIntelligenceService } from '@/lib/weather/weatherIntelligenceService';

// Get 16-day crop advisory
const getCropAdvisory = async (lat: number, lon: number, crop: string) => {
  const advisory = await weatherIntelligenceService.get16DayCropAdvisory(lat, lon, crop);
  
  // Show next 7 days
  advisory.slice(0, 7).forEach(day => {
    console.log(`\n${day.day} (${day.date})`);
    console.log(`  Temp: ${day.weather.tempMin}-${day.weather.tempMax}°C`);
    console.log(`  Rain: ${day.weather.rainfall}%`);
    
    if (day.activities.recommended.length > 0) {
      console.log(`  ✅ Recommended: ${day.activities.recommended.join(', ')}`);
    }
    
    if (day.activities.avoid.length > 0) {
      console.log(`  ❌ Avoid: ${day.activities.avoid.join(', ')}`);
    }
    
    if (day.alerts.length > 0) {
      console.log(`  ⚠️ Alerts: ${day.alerts.join(', ')}`);
    }
  });
};

// Usage
getCropAdvisory(28.4744, 77.5030, 'Rice');
```

### Example 5: All Alerts for a Field

```typescript
import { weatherAlertService } from '@/lib/weather/weatherAlertService';

// Check all alerts
const checkAllAlerts = async (fieldId: string, lat: number, lon: number, crop: string) => {
  const alerts = await weatherAlertService.checkFieldAlerts(fieldId, lat, lon, crop);
  
  console.log(`\n📢 ${alerts.length} alerts for your ${crop} field:\n`);
  
  alerts.forEach(alert => {
    const emoji = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${emoji} ${alert.title}`);
    console.log(`   ${alert.message}`);
    
    if (alert.actions.length > 0) {
      console.log(`   Actions:`);
      alert.actions.slice(0, 3).forEach(action => {
        console.log(`   - ${action}`);
      });
    }
    console.log('');
  });
};

// Usage
checkAllAlerts('field_123', 28.4744, 77.5030, 'Wheat');
```

---

## 🔧 Testing in Browser Console

Open your browser console and try these:

```javascript
// Import services (if using ES modules)
import { weatherIntelligenceService } from './lib/weather/weatherIntelligenceService';
import { weatherAlertService } from './lib/weather/weatherAlertService';
import { weatherCacheService } from './lib/weather/weatherCacheService';

// Test spray windows
weatherIntelligenceService.getSprayWindows(28.4744, 77.5030)
  .then(windows => console.table(windows));

// Test disease prediction
weatherIntelligenceService.predictDiseaseRisk(28.4744, 77.5030, 'Rice')
  .then(risks => console.table(risks));

// Test irrigation
weatherIntelligenceService.getIrrigationSchedule(28.4744, 77.5030, 'Wheat')
  .then(schedule => console.log(schedule));

// Test alerts
weatherAlertService.checkFieldAlerts('test', 28.4744, 77.5030, 'Rice')
  .then(alerts => console.table(alerts));

// Check cache stats
console.log(weatherCacheService.getCacheStats());
```

---

## 📱 Mobile-Friendly Component

```tsx
// src/components/weather/WeatherIntelligenceCard.tsx
// Compact version for mobile

import React from 'react';
import { AlertTriangle, Droplets, Sprout } from 'lucide-react';

interface Props {
  alerts: number;
  nextIrrigation: string;
  sprayWindows: number;
  onViewDetails: () => void;
}

export const WeatherIntelligenceCard: React.FC<Props> = ({
  alerts,
  nextIrrigation,
  sprayWindows,
  onViewDetails,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-4 text-white">
      <h3 className="font-bold mb-3">Weather Intelligence</h3>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{alerts}</p>
          <p className="text-xs">Alerts</p>
        </div>
        
        <div className="text-center">
          <Droplets className="h-6 w-6 mx-auto mb-1" />
          <p className="text-sm font-bold">{nextIrrigation}</p>
          <p className="text-xs">Next Irrigation</p>
        </div>
        
        <div className="text-center">
          <Sprout className="h-6 w-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{sprayWindows}</p>
          <p className="text-xs">Spray Windows</p>
        </div>
      </div>
      
      <button
        onClick={onViewDetails}
        className="w-full bg-white text-green-600 font-medium py-2 rounded-lg hover:bg-green-50 transition-colors"
      >
        View Details
      </button>
    </div>
  );
};
```

---

## 🎨 Styling Tips

### Color Scheme

```css
/* Alert Severity Colors */
.alert-critical { 
  background: #FEE2E2; /* red-100 */
  border-color: #EF4444; /* red-500 */
  color: #991B1B; /* red-800 */
}

.alert-warning { 
  background: #FEF3C7; /* yellow-100 */
  border-color: #F59E0B; /* yellow-500 */
  color: #92400E; /* yellow-800 */
}

.alert-info { 
  background: #DBEAFE; /* blue-100 */
  border-color: #3B82F6; /* blue-500 */
  color: #1E40AF; /* blue-800 */
}

/* Spray Window Quality */
.spray-excellent { 
  background: #D1FAE5; /* green-100 */
  border-color: #10B981; /* green-500 */
}

.spray-good { 
  background: #DBEAFE; /* blue-100 */
  border-color: #3B82F6; /* blue-500 */
}

.spray-fair { 
  background: #FEF3C7; /* yellow-100 */
  border-color: #F59E0B; /* yellow-500 */
}

/* Disease Risk Levels */
.risk-critical { background: #FEE2E2; border-color: #EF4444; }
.risk-high { background: #FED7AA; border-color: #F97316; }
.risk-medium { background: #FEF3C7; border-color: #F59E0B; }
.risk-low { background: #D1FAE5; border-color: #10B981; }
```

---

## 🚀 Production Checklist

Before deploying:

- [ ] Test with real coordinates
- [ ] Verify API key is set in `.env`
- [ ] Test caching behavior
- [ ] Check mobile responsiveness
- [ ] Test with slow network
- [ ] Verify error handling
- [ ] Test with multiple fields
- [ ] Check notification permissions
- [ ] Test in different browsers
- [ ] Verify analytics tracking

---

## 📊 Monitoring

Add these to your analytics:

```typescript
// Track feature usage
analytics.track('weather_intelligence_viewed', {
  fieldId,
  cropType,
  activeTab,
  alertsCount,
});

// Track alert interactions
analytics.track('weather_alert_viewed', {
  alertType,
  severity,
  fieldId,
});

// Track spray window usage
analytics.track('spray_window_checked', {
  fieldId,
  windowsFound,
  bestQuality,
});
```

---

## 🎓 User Education

### Onboarding Tips

1. **First Visit**: Show tooltip explaining weather intelligence
2. **Critical Alert**: Highlight the alert banner
3. **Spray Window**: Explain how to use spray windows
4. **Disease Risk**: Show how to prevent diseases

### Help Text Examples

```
"Weather Intelligence uses 16-day forecasts to give you actionable farming advice. 
Check daily for spray windows, disease risks, and irrigation schedules."

"Spray Windows show the best times to apply pesticides. Look for 'Excellent' 
quality windows with low wind and no rain."

"Disease Risk predicts outbreaks based on weather patterns. Take preventive 
action when risk is 'High' or 'Critical'."

"Irrigation Schedule tells you when to water your crops. It considers upcoming 
rain and evaporation rates to save water."
```

---

## 🏆 Success!

You now have a **world-class weather intelligence system** integrated into Plant Saathi!

**What you built**:
- ✅ 16-day crop advisory
- ✅ Spray window finder
- ✅ Disease risk prediction
- ✅ Smart irrigation scheduling
- ✅ Weather alerts
- ✅ Intelligent caching
- ✅ Beautiful UI

**Next steps**:
1. Test with real farmers
2. Collect feedback
3. Iterate and improve
4. Add more crops
5. Expand to more regions

**Happy Farming! 🌾**
