/**
 * Farmer-Friendly Language Transformation Service
 * Converts technical jargon to simple, farmer-friendly language
 */

// Technical term translations
export const technicalToFarmerFriendly = {
  // Vegetation Indices
  'NDVI': 'Plant Growth',
  'EVI': 'Plant Health',
  'NDWI': 'Water Level',
  'SAVI': 'Soil-Adjusted Growth',
  
  // Soil Properties
  'Soil Moisture': 'Soil Wetness',
  'pH Level': 'Soil Acidity',
  'Organic Matter': 'Soil Nutrients',
  'Nitrogen': 'Growth Nutrient',
  'Phosphorus': 'Root Nutrient',
  'Potassium': 'Strength Nutrient',
  
  // Weather Terms
  'Precipitation': 'Rainfall',
  'Relative Humidity': 'Air Moisture',
  'Wind Speed': 'Wind Strength',
  'Atmospheric Pressure': 'Air Pressure',
  'Evapotranspiration': 'Water Loss',
  
  // Disease Terms
  'Fungal Infection': 'Fungus Disease',
  'Bacterial Blight': 'Bacterial Disease',
  'Viral Disease': 'Virus Disease',
  'Pathogen': 'Disease Germ',
  'Symptom': 'Sign',
  
  // Market Terms
  'Modal Price': 'Average Price',
  'Volatility': 'Price Changes',
  'Commodity': 'Crop',
  'Market Trend': 'Price Direction',
};

// Status translations
export const statusToFarmerFriendly = {
  'healthy': { text: 'Healthy', emoji: '🌱', color: 'green' },
  'monitor': { text: 'Monitor', emoji: '👀', color: 'yellow' },
  'attention': { text: 'Needs Attention', emoji: '⚠️', color: 'orange' },
  'critical': { text: 'Critical', emoji: '🚨', color: 'red' },
  'unknown': { text: 'Unknown', emoji: '❓', color: 'gray' },
};

// Alert message translations
export const alertMessages = {
  // NDVI Alerts
  ndvi_drop: (value: number, drop: number) => 
    `🌱 Plant growth dropped to ${value}% (${drop}% decline)`,
  ndvi_low: (value: number) => 
    `🌱 Plant growth is low (${value}%)`,
  ndvi_healthy: (value: number) => 
    `🌱 Plant growth is good (${value}%)`,
  
  // Water Alerts
  water_stress: () => 
    `💧 Water your field today - Soil is dry`,
  water_adequate: () => 
    `💧 Water level is good`,
  water_excess: () => 
    `💧 Too much water - Check drainage`,
  
  // Disease Alerts
  disease_risk_high: () => 
    `🦠 High disease risk - Check leaves for spots`,
  disease_detected: (name: string) => 
    `🦠 ${name} detected - Take action now`,
  disease_none: () => 
    `✅ No disease detected - Plants look healthy`,
  
  // Weather Alerts
  rain_expected: () => 
    `🌧️ Rain expected - No need to water`,
  hot_weather: () => 
    `🌡️ Very hot - Water crops in evening`,
  cold_weather: () => 
    `🌡️ Cold weather - Protect sensitive crops`,
  
  // Irrigation Alerts
  irrigation_morning: () => 
    `💧 Perfect time to water now - Morning is best`,
  irrigation_evening: () => 
    `💧 Good time to water - Evening watering works`,
  irrigation_skip: () => 
    `💧 Skip watering today - Rain coming`,
  
  // Spray Alerts
  spray_good: (windSpeed: number) => 
    `🧪 Good time for spraying - Low wind (${windSpeed} km/h)`,
  spray_avoid: (windSpeed: number) => 
    `🌬️ Don't spray today - High wind (${windSpeed} km/h)`,
  
  // Market Alerts
  price_up: (crop: string, percent: number) => 
    `📈 ${crop} prices up ${percent}% - Good time to sell!`,
  price_down: (crop: string, percent: number) => 
    `📉 ${crop} prices down ${percent}% - Wait to sell`,
};

// Error message translations
export const errorMessages = {
  // API Errors
  'API Error': '📡 Getting latest information...',
  'Failed to fetch': '📡 Loading data...',
  'Network error': '📶 Checking internet connection...',
  'Timeout': '⏳ Taking longer than usual...',
  
  // Data Errors
  'No data available': '📊 No data yet - Add your field first',
  'Invalid coordinates': '📍 Location not found - Try again',
  'Field not found': '🌾 Field not found - Check field list',
  
  // Image Errors
  'Image too large': '📸 Image too big - Use smaller photo',
  'Invalid image': '📸 Not a valid image - Try another photo',
  'Upload failed': '📸 Upload failed - Try again',
  
  // Weather Errors
  'Weather data unavailable': '🌦️ Weather info not available right now',
  'Location not found': '📍 Location not found - Check settings',
};

// Unit conversions and formatting
export const unitConversions = {
  // Area conversions
  hectaresToAcres: (hectares: number) => (hectares * 2.47105).toFixed(2),
  acresToHectares: (acres: number) => (acres / 2.47105).toFixed(2),
  
  // Weight conversions
  kgToQuintals: (kg: number) => (kg / 100).toFixed(2),
  quintalsToKg: (quintals: number) => (quintals * 100).toFixed(0),
  
  // Yield conversions
  kgPerHaToQuintalsPerAcre: (kgPerHa: number) => 
    ((kgPerHa / 100) / 2.47105).toFixed(2),
  
  // Temperature (keep Celsius but add context)
  celsiusWithContext: (temp: number) => {
    if (temp > 35) return `${temp}°C (Very Hot)`;
    if (temp > 30) return `${temp}°C (Hot)`;
    if (temp > 25) return `${temp}°C (Warm)`;
    if (temp > 15) return `${temp}°C (Pleasant)`;
    if (temp > 10) return `${temp}°C (Cool)`;
    return `${temp}°C (Cold)`;
  },
};

// Field status simplification
export const simplifyFieldStatus = (data: {
  ndvi?: number;
  evi?: number;
  ndwi?: number;
  moisture?: number;
  health_score?: number;
}) => {
  const healthScore = data.health_score || data.ndvi || 0.75;
  const healthPercent = Math.round(healthScore * 100);
  
  let status: 'healthy' | 'monitor' | 'attention' | 'critical';
  if (healthScore > 0.7) status = 'healthy';
  else if (healthScore > 0.5) status = 'monitor';
  else if (healthScore > 0.3) status = 'attention';
  else status = 'critical';
  
  const statusInfo = statusToFarmerFriendly[status];
  
  return {
    simple: `${statusInfo.emoji} ${statusInfo.text} (${healthPercent}%)`,
    emoji: statusInfo.emoji,
    text: statusInfo.text,
    percent: healthPercent,
    color: statusInfo.color,
    
    // Additional context
    growth: data.ndvi ? `Growth: ${Math.round(data.ndvi * 100)}%` : undefined,
    water: data.moisture ? `Soil Wetness: ${Math.round(data.moisture)}%` : undefined,
    waterLevel: data.ndwi ? `Water Level: ${Math.round(data.ndwi * 100)}%` : undefined,
  };
};

// Disease severity simplification
export const simplifyDiseaseSeverity = (data: {
  yield_impact: string;
  spread_risk: string;
  recovery_chance: string;
}) => {
  const getSeverityEmoji = (level: string) => {
    if (level.toLowerCase().includes('high')) return '🔴';
    if (level.toLowerCase().includes('medium')) return '🟡';
    return '🟢';
  };
  
  return {
    yieldImpact: {
      emoji: getSeverityEmoji(data.yield_impact),
      text: data.yield_impact,
      simple: data.yield_impact === 'High' ? 'May reduce harvest by 30%+' :
              data.yield_impact === 'Medium' ? 'May reduce harvest by 10-30%' :
              'Minor impact on harvest'
    },
    spreadRisk: {
      emoji: getSeverityEmoji(data.spread_risk),
      text: data.spread_risk,
      simple: data.spread_risk === 'High' ? 'Can spread quickly to other plants' :
              data.spread_risk === 'Medium' ? 'May spread to nearby plants' :
              'Unlikely to spread'
    },
    recovery: {
      emoji: data.recovery_chance === 'Excellent' || data.recovery_chance === 'Good' ? '🟢' :
             data.recovery_chance === 'Fair' ? '🟡' : '🔴',
      text: data.recovery_chance,
      simple: data.recovery_chance === 'Excellent' ? 'Plants will recover well' :
              data.recovery_chance === 'Good' ? 'Plants can recover with treatment' :
              data.recovery_chance === 'Fair' ? 'Recovery depends on quick action' :
              'Difficult to recover'
    }
  };
};

// Weather description simplification
export const simplifyWeatherDescription = (description: string) => {
  const lower = description.toLowerCase();
  
  if (lower.includes('rain')) {
    if (lower.includes('heavy')) return { emoji: '🌧️', text: 'Heavy rain' };
    if (lower.includes('light')) return { emoji: '🌦️', text: 'Light rain' };
    return { emoji: '🌧️', text: 'Rain' };
  }
  
  if (lower.includes('cloud')) {
    if (lower.includes('few')) return { emoji: '🌤️', text: 'Partly cloudy' };
    if (lower.includes('scattered')) return { emoji: '⛅', text: 'Cloudy' };
    return { emoji: '☁️', text: 'Overcast' };
  }
  
  if (lower.includes('clear')) return { emoji: '☀️', text: 'Clear sky' };
  if (lower.includes('storm')) return { emoji: '⛈️', text: 'Thunderstorm' };
  if (lower.includes('snow')) return { emoji: '❄️', text: 'Snow' };
  if (lower.includes('fog')) return { emoji: '🌫️', text: 'Foggy' };
  
  return { emoji: '🌤️', text: description };
};

// Time formatting (farmer-friendly)
export const formatTimeAgo = (timestamp: string | Date) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? 's' : ''} ago`;
};

// Price formatting (local currency)
export const formatPrice = (price: number, unit: string = 'quintal') => {
  return `₹${price.toLocaleString('en-IN')}/${unit}`;
};

// Percentage formatting with context
export const formatPercentage = (value: number, context?: string) => {
  const percent = Math.round(value * 100);
  
  if (context === 'health') {
    if (percent > 80) return `${percent}% (Excellent)`;
    if (percent > 60) return `${percent}% (Good)`;
    if (percent > 40) return `${percent}% (Fair)`;
    return `${percent}% (Poor)`;
  }
  
  if (context === 'moisture') {
    if (percent > 60) return `${percent}% (Wet)`;
    if (percent > 40) return `${percent}% (Good)`;
    if (percent > 20) return `${percent}% (Dry)`;
    return `${percent}% (Very Dry)`;
  }
  
  return `${percent}%`;
};

// Export helper function to translate any technical term
export const translateTechnical = (term: string): string => {
  return technicalToFarmerFriendly[term as keyof typeof technicalToFarmerFriendly] || term;
};

// Export helper function to humanize error messages
export const humanizeError = (error: string): string => {
  for (const [technical, friendly] of Object.entries(errorMessages)) {
    if (error.includes(technical)) {
      return friendly;
    }
  }
  return error;
};
