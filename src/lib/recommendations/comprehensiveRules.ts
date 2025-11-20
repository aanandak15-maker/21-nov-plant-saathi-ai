/**
 * COMPREHENSIVE PRODUCT RECOMMENDATION RULEBOOK
 * 
 * This is the complete rulebook for intelligent product recommendations
 * Based on: Disease detection, Field health, Weather, BlackBox data, Growth stages
 * 
 * Version: 2.0.0 - Production Ready
 */

export const comprehensiveRulebook = {
  version: "2.0.0",
  lastUpdated: "2025-11-20",
  description: "Complete product recommendation engine for marketplace selling",

  // ============================================
  // DISEASE-BASED PRODUCT RECOMMENDATIONS
  // ============================================
  diseaseRules: [
    // FUNGAL DISEASES
    {
      id: "leaf_blight_treatment",
      diseases: ["leaf blight", "blight", "bacterial blight"],
      confidence: 70,
      severity: "high",
      products: [
        {
          id: "mancozeb-75",
          name: "Mancozeb 75% WP Fungicide",
          category: "fungicide",
          price: 850,
          unit: "500g",
          priority: "urgent",
          reason: "Immediate treatment needed - Leaf Blight spreads rapidly",
          dosage: "2-2.5g per liter of water",
          applicationMethod: "Foliar spray every 7-10 days, 2-3 applications",
          timing: "Early morning or evening",
          expectedResult: "Visible control in 10-14 days",
          preventsFurtherDamage: true,
          effectiveness: 85
        },
        {
          id: "copper-oxychloride-50",
          name: "Copper Oxychloride 50% WP",
          category: "fungicide",
          price: 650,
          unit: "500g",
          priority: "urgent",
          reason: "Backup treatment for resistant strains",
          dosage: "3g per liter",
          effectiveness: 80
        },
        {
          id: "carbendazim-50",
          name: "Carbendazim 50% WP",
          category: "fungicide",
          price: 720,
          unit: "250g",
          priority: "high",
          reason: "Systemic fungicide for deep infection",
          dosage: "1g per liter",
          effectiveness: 82
        }
      ]
    },
    {
      id: "blast_disease_treatment",
      diseases: ["blast", "rice blast", "leaf blast", "neck blast"],
      confidence: 70,
      severity: "critical",
      products: [
        {
          id: "tricyclazole-75",
          name: "Tricyclazole 75% WP",
          category: "fungicide",
          price: 1200,
          unit: "100g",
          priority: "urgent",
          reason: "Most effective against blast - Act immediately!",
          dosage: "0.6g per liter",
          applicationMethod: "Spray at tillering and booting stage",
          expectedResult: "Control within 7-10 days",
          effectiveness: 90
        },
        {
          id: "isoprothiolane",
          name: "Isoprothiolane 40% EC",
          category: "fungicide",
          price: 980,
          unit: "500ml",
          priority: "urgent",
          reason: "Excellent for neck blast control",
          dosage: "1.5ml per liter",
          effectiveness: 88
        }
      ]
    },
    
    // PEST/INSECT DISEASES
    {
      id: "stem_borer_control",
      diseases: ["stem borer", "borer", "yellow stem borer"],
      confidence: 70,
      severity: "high",
      products: [
        {
          id: "chlorpyrifos-20",
          name: "Chlorpyrifos 20% EC",
          category: "insecticide",
          price: 450,
          unit: "500ml",
          priority: "urgent",
          reason: "Effective pest control for stem borer",
          dosage: "2ml per liter",
          applicationMethod: "Spray on stems and leaves",
          effectiveness: 85
        },
        {
          id: "cartap-hydrochloride",
          name: "Cartap Hydrochloride 50% SP",
          category: "insecticide",
          price: 680,
          unit: "500g",
          priority: "urgent",
          reason: "Systemic action against borers",
          dosage: "1g per liter",
          effectiveness: 87
        },
        {
          id: "neem-oil-organic",
          name: "Organic Neem Oil 1500 PPM",
          category: "organic-pesticide",
          price: 350,
          unit: "1L",
          priority: "high",
          reason: "Organic alternative - Safe for environment",
          dosage: "5ml per liter",
          effectiveness: 70
        }
      ]
    },
    {
      id: "brown_planthopper",
      diseases: ["brown planthopper", "planthopper", "hopper burn"],
      confidence: 70,
      severity: "critical",
      products: [
        {
          id: "imidacloprid-17",
          name: "Imidacloprid 17.8% SL",
          category: "insecticide",
          price: 520,
          unit: "250ml",
          priority: "urgent",
          reason: "Systemic control of planthoppers",
          dosage: "0.5ml per liter",
          effectiveness: 88
        },
        {
          id: "buprofezin-25",
          name: "Buprofezin 25% SC",
          category: "insecticide",
          price: 780,
          unit: "500ml",
          priority: "urgent",
          reason: "Specific for planthopper control",
          dosage: "1.5ml per liter",
          effectiveness: 90
        }
      ]
    },
    {
      id: "leaf_folder_control",
      diseases: ["leaf folder", "leaf roller"],
      confidence: 70,
      severity: "medium",
      products: [
        {
          id: "lambda-cyhalothrin",
          name: "Lambda Cyhalothrin 5% EC",
          category: "insecticide",
          price: 420,
          unit: "250ml",
          priority: "high",
          reason: "Effective against leaf folders",
          dosage: "1ml per liter",
          effectiveness: 82
        }
      ]
    },
    
    // BACTERIAL DISEASES
    {
      id: "bacterial_leaf_blight",
      diseases: ["bacterial leaf blight", "bacterial blight"],
      confidence: 70,
      severity: "high",
      products: [
        {
          id: "streptocycline",
          name: "Streptocycline 90% SP",
          category: "bactericide",
          price: 380,
          unit: "100g",
          priority: "urgent",
          reason: "Antibiotic treatment for bacterial infection",
          dosage: "0.5g per liter + Copper Oxychloride",
          effectiveness: 75
        },
        {
          id: "copper-hydroxide",
          name: "Copper Hydroxide 77% WP",
          category: "bactericide",
          price: 620,
          unit: "500g",
          priority: "urgent",
          reason: "Copper-based bactericide",
          dosage: "2.5g per liter",
          effectiveness: 78
        }
      ]
    },
    
    // VIRAL DISEASES
    {
      id: "tungro_virus",
      diseases: ["tungro", "rice tungro", "viral disease"],
      confidence: 70,
      severity: "critical",
      products: [
        {
          id: "vector-control-insecticide",
          name: "Vector Control Insecticide (Imidacloprid)",
          category: "insecticide",
          price: 520,
          unit: "250ml",
          priority: "urgent",
          reason: "Control vector (green leafhopper) to prevent spread",
          dosage: "0.5ml per liter",
          effectiveness: 80
        },
        {
          id: "npk-immunity-booster",
          name: "NPK + Micronutrients (Immunity Booster)",
          category: "fertilizer",
          price: 1350,
          unit: "50kg",
          priority: "high",
          reason: "Boost plant immunity against viral infection",
          dosage: "25kg per acre",
          effectiveness: 65
        }
      ]
    }
  ],

  // ============================================
  // FIELD HEALTH & SOIL-BASED RECOMMENDATIONS
  // ============================================
  fieldHealthRules: [
    {
      id: "critical_health_emergency",
      condition: {
        healthScore: { max: 20 },
        ndvi: { max: 0.25 }
      },
      severity: "critical",
      products: [
        {
          id: "emergency-npk-combo",
          name: "Emergency NPK Recovery Kit",
          category: "combo",
          price: 2200,
          unit: "combo pack",
          priority: "urgent",
          reason: "CRITICAL: Field health below 20% - Emergency nutrition needed NOW!",
          contains: ["NPK 19:19:19 (25kg)", "Micronutrients (1kg)", "Humic Acid (500ml)"],
          dosage: "Apply immediately as per instructions",
          expectedResult: "Visible recovery in 5-7 days",
          savings: "Save ₹700",
          effectiveness: 92
        },
        {
          id: "liquid-npk-emergency",
          name: "Liquid NPK 19:19:19 (Quick Action)",
          category: "fertilizer",
          price: 850,
          unit: "1L",
          priority: "urgent",
          reason: "Fast-acting liquid fertilizer for emergency",
          dosage: "5ml per liter foliar spray",
          effectiveness: 88
        }
      ]
    },
    {
      id: "very_low_health",
      condition: {
        healthScore: { min: 20, max: 35 },
        ndvi: { min: 0.25, max: 0.35 }
      },
      severity: "high",
      products: [
        {
          id: "npk-19-19-19",
          name: "NPK 19:19:19 Balanced Fertilizer",
          category: "fertilizer",
          price: 1200,
          unit: "50kg",
          priority: "urgent",
          reason: "Severe nutrition deficiency - Balanced NPK needed urgently",
          dosage: "25-30kg per acre",
          applicationMethod: "Broadcast and incorporate",
          expectedResult: "Improvement in 7-10 days",
          effectiveness: 85
        },
        {
          id: "micronutrient-complete",
          name: "Complete Micronutrient Mix (Zn, Fe, Mn, B, Cu, Mo)",
          category: "micronutrient",
          price: 450,
          unit: "1kg",
          priority: "urgent",
          reason: "Complete micronutrient package for recovery",
          dosage: "2.5g per liter foliar spray",
          effectiveness: 82
        },
        {
          id: "seaweed-extract",
          name: "Seaweed Extract (Growth Stimulant)",
          category: "bio-stimulant",
          price: 680,
          unit: "500ml",
          priority: "high",
          reason: "Natural growth promoter and stress reliever",
          dosage: "2ml per liter",
          effectiveness: 78
        }
      ]
    },
    {
      id: "low_health",
      condition: {
        healthScore: { min: 35, max: 55 },
        ndvi: { min: 0.35, max: 0.55 }
      },
      severity: "medium",
      products: [
        {
          id: "urea-46",
          name: "Urea 46% N",
          category: "fertilizer",
          price: 800,
          unit: "50kg",
          priority: "high",
          reason: "Boost nitrogen for better vegetative growth",
          dosage: "20-25kg per acre",
          effectiveness: 80
        },
        {
          id: "dap-fertilizer",
          name: "DAP (Di-Ammonium Phosphate) 18:46:0",
          category: "fertilizer",
          price: 1350,
          unit: "50kg",
          priority: "high",
          reason: "Phosphorus boost for root development",
          dosage: "25kg per acre",
          effectiveness: 82
        },
        {
          id: "potash-mop",
          name: "Muriate of Potash (MOP) 60% K2O",
          category: "fertilizer",
          price: 950,
          unit: "50kg",
          priority: "medium",
          reason: "Potassium for disease resistance",
          dosage: "15-20kg per acre",
          effectiveness: 78
        }
      ]
    },
    {
      id: "moderate_health_optimization",
      condition: {
        healthScore: { min: 55, max: 75 }
      },
      severity: "low",
      products: [
        {
          id: "organic-compost",
          name: "Enriched Organic Compost",
          category: "organic",
          price: 450,
          unit: "50kg",
          priority: "medium",
          reason: "Improve soil health and organic matter",
          dosage: "200-300kg per acre",
          effectiveness: 75
        },
        {
          id: "bio-fertilizer",
          name: "Bio-Fertilizer (Azotobacter + PSB)",
          category: "bio-fertilizer",
          price: 280,
          unit: "1kg",
          priority: "medium",
          reason: "Biological nitrogen fixation and phosphorus solubilization",
          dosage: "2kg per acre",
          effectiveness: 72
        }
      ]
    }
  ],

  // ============================================
  // SOIL MOISTURE & IRRIGATION RECOMMENDATIONS
  // ============================================
  soilMoistureRules: [
    {
      id: "critical_drought_stress",
      condition: {
        moisture: { max: 15 }
      },
      severity: "critical",
      products: [
        {
          id: "drip-irrigation-premium",
          name: "Premium Drip Irrigation System (1 Acre)",
          category: "irrigation",
          price: 18000,
          unit: "1 complete kit",
          priority: "urgent",
          reason: "CRITICAL: Severe drought stress - Efficient irrigation essential",
          savings: "Save 60% water + ₹15,000/year on water bills",
          features: ["Inline drippers", "Pressure regulator", "Filter", "Main line", "Lateral pipes"],
          expectedResult: "Immediate water stress relief",
          effectiveness: 95
        },
        {
          id: "water-retention-gel",
          name: "Super Absorbent Polymer (Water Retention Gel)",
          category: "soil-amendment",
          price: 1200,
          unit: "1kg",
          priority: "urgent",
          reason: "Holds water in soil - Reduces irrigation frequency by 50%",
          dosage: "2-3g per plant",
          effectiveness: 85
        }
      ]
    },
    {
      id: "low_moisture_stress",
      condition: {
        moisture: { min: 15, max: 30 }
      },
      severity: "high",
      products: [
        {
          id: "drip-irrigation-standard",
          name: "Standard Drip Irrigation Kit (1 Acre)",
          category: "irrigation",
          price: 15000,
          unit: "1 kit",
          priority: "urgent",
          reason: "Low soil moisture affecting growth - Efficient irrigation needed",
          savings: "Save 50% water compared to flood irrigation",
          effectiveness: 90
        },
        {
          id: "mulch-film-black",
          name: "Black Plastic Mulch Film (UV Stabilized)",
          category: "mulch",
          price: 2500,
          unit: "100m roll (1.2m width)",
          priority: "high",
          reason: "Reduce water evaporation by 70% + weed control",
          coverage: "Covers 120 sq meters",
          effectiveness: 82
        },
        {
          id: "organic-mulch",
          name: "Organic Mulch (Rice Straw/Paddy Straw)",
          category: "mulch",
          price: 350,
          unit: "50kg bale",
          priority: "high",
          reason: "Natural mulch - Retains moisture + adds organic matter",
          coverage: "Covers 200 sq meters",
          effectiveness: 75
        }
      ]
    },
    {
      id: "moderate_moisture_optimization",
      condition: {
        moisture: { min: 30, max: 50 }
      },
      severity: "medium",
      products: [
        {
          id: "sprinkler-system",
          name: "Portable Sprinkler Irrigation System",
          category: "irrigation",
          price: 8500,
          unit: "1 set",
          priority: "medium",
          reason: "Optimize water distribution - Better than flood irrigation",
          savings: "Save 30% water",
          effectiveness: 78
        }
      ]
    }
  ],

  // ============================================
  // WEATHER-BASED RECOMMENDATIONS
  // ============================================
  weatherRules: [
    {
      id: "high_humidity_disease_prevention",
      condition: {
        humidity: { min: 80 },
        temperature: { min: 25, max: 32 }
      },
      severity: "high",
      products: [
        {
          id: "preventive-fungicide-mancozeb",
          name: "Preventive Fungicide (Mancozeb 75%)",
          category: "fungicide",
          price: 850,
          unit: "500g",
          priority: "high",
          reason: "High disease risk due to humidity - Preventive spray recommended",
          dosage: "2g per liter",
          applicationMethod: "Spray before disease appears",
          effectiveness: 85
        },
        {
          id: "copper-fungicide-preventive",
          name: "Copper-based Preventive Fungicide",
          category: "fungicide",
          price: 650,
          unit: "500g",
          priority: "high",
          reason: "Broad-spectrum protection in humid conditions",
          dosage: "3g per liter",
          effectiveness: 80
        }
      ]
    },
    {
      id: "heavy_rain_protection",
      condition: {
        rainfall: "heavy",
        precipitationChance: { min: 70 }
      },
      severity: "high",
      products: [
        {
          id: "tarpaulin-heavy-duty",
          name: "Heavy Duty Waterproof Tarpaulin",
          category: "protection",
          price: 1800,
          unit: "20x20 ft",
          priority: "high",
          reason: "Heavy rain expected - Protect crops from waterlogging damage",
          features: ["UV resistant", "Waterproof", "Tear-proof"],
          effectiveness: 88
        },
        {
          id: "drainage-pipes",
          name: "Drainage Pipe System",
          category: "drainage",
          price: 3500,
          unit: "50m",
          priority: "high",
          reason: "Prevent waterlogging and root rot",
          effectiveness: 85
        },
        {
          id: "post-rain-fungicide",
          name: "Post-Rain Fungicide Application",
          category: "fungicide",
          price: 720,
          unit: "500ml",
          priority: "medium",
          reason: "Apply after rain to prevent fungal outbreak",
          dosage: "2ml per liter",
          effectiveness: 82
        }
      ]
    },
    {
      id: "extreme_heat_stress",
      condition: {
        temperature: { min: 38 }
      },
      severity: "high",
      products: [
        {
          id: "shade-net-50-percent",
          name: "Shade Net 50% (Green)",
          category: "protection",
          price: 3500,
          unit: "100 sq m",
          priority: "high",
          reason: "Extreme heat - Protect crops from heat stress and sunburn",
          features: ["UV stabilized", "50% shade", "Durable"],
          effectiveness: 88
        },
        {
          id: "anti-transpirant",
          name: "Anti-Transpirant Spray",
          category: "bio-stimulant",
          price: 580,
          unit: "500ml",
          priority: "high",
          reason: "Reduce water loss through leaves in extreme heat",
          dosage: "2ml per liter foliar spray",
          effectiveness: 80
        },
        {
          id: "potassium-silicate",
          name: "Potassium Silicate (Heat Stress Reducer)",
          category: "bio-stimulant",
          price: 720,
          unit: "1L",
          priority: "medium",
          reason: "Improves heat tolerance and strengthens cell walls",
          dosage: "2ml per liter",
          effectiveness: 78
        }
      ]
    },
    {
      id: "cold_stress_protection",
      condition: {
        temperature: { max: 15 }
      },
      severity: "medium",
      products: [
        {
          id: "frost-protection-cover",
          name: "Frost Protection Cover (Agro Fabric)",
          category: "protection",
          price: 2200,
          unit: "100 sq m",
          priority: "high",
          reason: "Protect crops from cold stress and frost damage",
          effectiveness: 85
        }
      ]
    },
    {
      id: "high_wind_protection",
      condition: {
        windSpeed: { min: 25 }
      },
      severity: "medium",
      products: [
        {
          id: "plant-stakes",
          name: "Bamboo Plant Stakes (Heavy Duty)",
          category: "support",
          price: 450,
          unit: "100 pieces",
          priority: "medium",
          reason: "High wind expected - Stake plants to prevent lodging",
          effectiveness: 80
        },
        {
          id: "windbreak-net",
          name: "Windbreak Net (HDPE)",
          category: "protection",
          price: 2800,
          unit: "50m x 2m",
          priority: "medium",
          reason: "Create windbreak to protect crops",
          effectiveness: 82
        }
      ]
    }
  ],

  // ============================================
  // INTEGRATED SOLUTIONS (COMBO PACKS)
  // ============================================
  integratedSolutions: [
    {
      id: "disease_plus_low_health_combo",
      condition: {
        hasDisease: true,
        healthScore: { max: 40 }
      },
      severity: "critical",
      products: [
        {
          id: "complete-recovery-kit",
          name: "Complete Disease + Nutrition Recovery Kit",
          category: "combo",
          price: 2500,
          unit: "combo pack",
          priority: "urgent",
          reason: "INTEGRATED SOLUTION: Treat disease while boosting plant immunity and nutrition",
          contains: [
            "Mancozeb Fungicide (500g)",
            "NPK 19:19:19 (25kg)",
            "Micronutrient Mix (1kg)",
            "Bio-stimulant (500ml)"
          ],
          savings: "Save ₹850 compared to buying separately",
          applicationPlan: "Day 1: Fungicide spray, Day 3: NPK application, Day 7: Micronutrients + Bio-stimulant",
          expectedResult: "Disease control + Health improvement in 10-14 days",
          effectiveness: 92
        }
      ]
    },
    {
      id: "drought_plus_heat_stress_combo",
      condition: {
        moisture: { max: 25 },
        temperature: { min: 36 }
      },
      severity: "critical",
      products: [
        {
          id: "water-stress-management-kit",
          name: "Complete Water Stress Management Kit",
          category: "combo",
          price: 5200,
          unit: "combo pack",
          priority: "urgent",
          reason: "CRITICAL: Combat severe water + heat stress with integrated approach",
          contains: [
            "Drip Irrigation Kit (small - 0.5 acre)",
            "Mulch Film (50m)",
            "Water Retention Gel (500g)",
            "Anti-Transpirant (500ml)"
          ],
          savings: "Save ₹1,300 on combo",
          expectedResult: "Immediate stress relief + 60% water savings",
          effectiveness: 94
        }
      ]
    },
    {
      id: "pest_plus_disease_combo",
      condition: {
        hasPest: true,
        hasDisease: true
      },
      severity: "high",
      products: [
        {
          id: "pest-disease-control-kit",
          name: "Pest + Disease Control Combo",
          category: "combo",
          price: 1650,
          unit: "combo pack",
          priority: "urgent",
          reason: "Dual problem: Control both pests and diseases together",
          contains: [
            "Insecticide (500ml)",
            "Fungicide (500g)",
            "Sticker/Spreader (100ml)"
          ],
          savings: "Save ₹400",
          applicationPlan: "Mix and spray together (compatible formulations)",
          effectiveness: 90
        }
      ]
    },
    {
      id: "complete_field_revival_kit",
      condition: {
        healthScore: { max: 30 },
        moisture: { max: 30 },
        hasDisease: true
      },
      severity: "critical",
      products: [
        {
          id: "ultimate-field-revival-kit",
          name: "Ultimate Field Revival Kit (All-in-One)",
          category: "combo",
          price: 6500,
          unit: "mega combo pack",
          priority: "urgent",
          reason: "EMERGENCY: Multiple critical issues - Complete field revival needed",
          contains: [
            "Fungicide (500g)",
            "NPK 19:19:19 (50kg)",
            "Micronutrients (2kg)",
            "Drip Kit (0.5 acre)",
            "Mulch Film (50m)",
            "Bio-stimulant (1L)"
          ],
          savings: "Save ₹2,200 - Best value!",
          applicationPlan: "Complete 14-day revival program included",
          expectedResult: "Complete field recovery in 2-3 weeks",
          effectiveness: 95
        }
      ]
    },
    {
      id: "preventive_care_package",
      condition: {
        healthScore: { min: 60, max: 80 },
        noDisease: true
      },
      severity: "low",
      products: [
        {
          id: "preventive-maintenance-kit",
          name: "Preventive Care Package (Monthly)",
          category: "combo",
          price: 1800,
          unit: "monthly pack",
          priority: "medium",
          reason: "Keep your healthy field in top condition - Prevention is better than cure",
          contains: [
            "Preventive Fungicide (250g)",
            "Balanced NPK (25kg)",
            "Micronutrients (500g)",
            "Bio-fertilizer (1kg)"
          ],
          savings: "Save ₹450",
          effectiveness: 85
        }
      ]
    }
  ]
};

// ============================================
// GROWTH STAGE-BASED RECOMMENDATIONS (Separate export)
// ============================================
export const growthStageRules = [
    {
      id: "seedling_stage",
      condition: {
        daysAfterSowing: { min: 0, max: 20 }
      },
      stage: "seedling",
      products: [
        {
          id: "seedling-starter-fertilizer",
          name: "Seedling Starter Fertilizer (High P)",
          category: "fertilizer",
          price: 680,
          unit: "25kg",
          priority: "medium",
          reason: "Seedling stage - High phosphorus for strong root development",
          dosage: "15kg per acre",
          effectiveness: 82
        },
        {
          id: "root-growth-promoter",
          name: "Root Growth Promoter (IBA + NAA)",
          category: "bio-stimulant",
          price: 420,
          unit: "250ml",
          priority: "medium",
          reason: "Promote vigorous root system in early stage",
          dosage: "1ml per liter",
          effectiveness: 78
        }
      ]
    },
    {
      id: "vegetative_stage",
      condition: {
        daysAfterSowing: { min: 20, max: 50 }
      },
      stage: "vegetative",
      products: [
        {
          id: "high-nitrogen-fertilizer",
          name: "High Nitrogen Fertilizer (Urea 46%)",
          category: "fertilizer",
          price: 800,
          unit: "50kg",
          priority: "medium",
          reason: "Vegetative stage - High nitrogen for rapid leaf and stem growth",
          dosage: "25-30kg per acre",
          effectiveness: 85
        },
        {
          id: "vegetative-growth-booster",
          name: "Vegetative Growth Booster (Amino Acids)",
          category: "bio-stimulant",
          price: 580,
          unit: "500ml",
          priority: "medium",
          reason: "Enhance vegetative growth and chlorophyll production",
          dosage: "2ml per liter foliar spray",
          effectiveness: 80
        }
      ]
    },
    {
      id: "tillering_stage",
      condition: {
        daysAfterSowing: { min: 30, max: 55 }
      },
      stage: "tillering",
      products: [
        {
          id: "tillering-special-npk",
          name: "Tillering Special NPK 20:10:10",
          category: "fertilizer",
          price: 1150,
          unit: "50kg",
          priority: "medium",
          reason: "Tillering stage - Promote more tillers for higher yield",
          dosage: "25kg per acre",
          effectiveness: 83
        }
      ]
    },
    {
      id: "flowering_stage",
      condition: {
        daysAfterSowing: { min: 55, max: 85 }
      },
      stage: "flowering",
      products: [
        {
          id: "flowering-pk-fertilizer",
          name: "Flowering Special P+K Fertilizer (0:52:34)",
          category: "fertilizer",
          price: 1350,
          unit: "50kg",
          priority: "medium",
          reason: "Flowering stage - High P & K for better flower formation and grain filling",
          dosage: "20-25kg per acre",
          effectiveness: 87
        },
        {
          id: "boron-fertilizer",
          name: "Boron Fertilizer (20% B)",
          category: "micronutrient",
          price: 320,
          unit: "500g",
          priority: "medium",
          reason: "Boron critical for pollen viability and grain set",
          dosage: "1g per liter foliar spray",
          effectiveness: 82
        },
        {
          id: "flowering-hormone",
          name: "Flowering Hormone (NAA + GA3)",
          category: "bio-stimulant",
          price: 480,
          unit: "100ml",
          priority: "low",
          reason: "Improve flower retention and grain setting",
          dosage: "0.5ml per liter",
          effectiveness: 75
        }
      ]
    },
    {
      id: "grain_filling_stage",
      condition: {
        daysAfterSowing: { min: 85, max: 110 }
      },
      stage: "grain_filling",
      products: [
        {
          id: "grain-filling-fertilizer",
          name: "Grain Filling Special (13:0:45)",
          category: "fertilizer",
          price: 1280,
          unit: "50kg",
          priority: "medium",
          reason: "Grain filling stage - High potassium for grain weight and quality",
          dosage: "20kg per acre",
          effectiveness: 85
        },
        {
          id: "calcium-boron-spray",
          name: "Calcium + Boron Foliar Spray",
          category: "micronutrient",
          price: 420,
          unit: "1L",
          priority: "medium",
          reason: "Improve grain quality and reduce empty grains",
          dosage: "2ml per liter",
          effectiveness: 80
        }
      ]
    },
    {
      id: "maturity_stage",
      condition: {
        daysAfterSowing: { min: 110 }
      },
      stage: "maturity",
      products: [
        {
          id: "harvest-preparation-spray",
          name: "Pre-Harvest Spray (Desiccant)",
          category: "harvest-aid",
          price: 380,
          unit: "500ml",
          priority: "low",
          reason: "Uniform maturity and easier harvesting",
          dosage: "1.5ml per liter",
          effectiveness: 72
        }
      ]
    }
  ];

// ============================================
// BLACKBOX-DRIVEN PERSONALIZATION RULES
// ============================================
export const blackBoxPersonalizationRules = {
  // Boost products based on user behavior
  userBehaviorBoosts: {
    previousPurchase: {
      boost: 30,
      reason: "You've bought this before - Trusted product"
    },
    previousSearch: {
      boost: 20,
      reason: "Based on your recent searches"
    },
    clickedButNotBought: {
      boost: 15,
      reason: "You showed interest in this product"
    },
    viewedMultipleTimes: {
      boost: 25,
      reason: "Popular choice among farmers like you"
    }
  },

  // Regional preferences
  regionalPreferences: {
    popularInRegion: {
      boost: 20,
      reason: "Most popular in your region"
    },
    seasonalDemand: {
      boost: 15,
      reason: "High demand this season in your area"
    }
  },

  // Budget-based recommendations
  budgetOptimization: {
    lowBudget: {
      priceRange: { max: 1000 },
      preferGeneric: true,
      reason: "Budget-friendly option"
    },
    mediumBudget: {
      priceRange: { min: 1000, max: 5000 },
      preferBalanced: true,
      reason: "Best value for money"
    },
    highBudget: {
      priceRange: { min: 5000 },
      preferPremium: true,
      reason: "Premium quality product"
    }
  },

  // Brand preferences
  brandLoyalty: {
    preferredBrands: {
      boost: 25,
      reason: "Your preferred brand"
    },
    trustedBrands: {
      boost: 15,
      reason: "Highly rated by farmers"
    }
  },

  // Purchase patterns
  purchasePatterns: {
    bulkBuyer: {
      recommendLargerPacks: true,
      savingsHighlight: true,
      reason: "Bulk pack - Save more"
    },
    frequentBuyer: {
      recommendSubscription: true,
      reason: "Subscribe and save 10%"
    },
    firstTimeBuyer: {
      recommendStarterPacks: true,
      reason: "Perfect for first-time users"
    }
  },

  // Crop-specific preferences
  cropSpecificBoosts: {
    rice: {
      boost: 30,
      reason: "Specially formulated for rice"
    },
    wheat: {
      boost: 30,
      reason: "Specially formulated for wheat"
    },
    vegetables: {
      boost: 30,
      reason: "Safe for vegetables"
    }
  }
};

// ============================================
// PRIORITY WEIGHTS & SCORING
// ============================================
export const scoringWeights = {
  priorityWeights: {
    urgent: 100,
    high: 75,
    medium: 50,
    low: 25
  },

  severityWeights: {
    critical: 50,
    high: 35,
    medium: 20,
    low: 10
  },

  effectivenessWeight: 0.5, // Multiply effectiveness by this

  comboPackBonus: 20,

  savingsBonus: {
    above1000: 25,
    above500: 15,
    above300: 10
  }
};

// ============================================
// RECOMMENDATION STRATEGIES
// ============================================
export const recommendationStrategies = {
  // When to show combo packs
  comboPackStrategy: {
    minIssues: 2, // Show combo when 2+ issues detected
    minTotalCost: 2000, // Show combo when individual products cost > ₹2000
    minSavings: 300, // Only show combo if savings > ₹300
    preferCombosWhen: [
      "multipleIssues",
      "highTotalCost",
      "urgentSituation",
      "firstTimeBuyer"
    ]
  },

  // How many products to show
  displayStrategy: {
    urgent: 2, // Show top 2 urgent
    high: 3, // Show top 3 high priority
    medium: 2, // Show top 2 medium (in "View All")
    low: 3, // Show top 3 low (in "View All")
    maxTotal: 10 // Maximum recommendations to generate
  },

  // Deduplication strategy
  deduplicationStrategy: {
    preferHigherPriority: true,
    preferHigherEffectiveness: true,
    preferComboPacks: true,
    preferUserPreferred: true
  },

  // Cross-sell strategy
  crossSellStrategy: {
    showComplementaryProducts: true,
    maxCrossSells: 2,
    examples: {
      fungicide: ["sticker", "spreader", "adjuvant"],
      fertilizer: ["micronutrients", "bio-stimulant"],
      irrigation: ["mulch", "water-retention-gel"]
    }
  },

  // Upsell strategy
  upsellStrategy: {
    showPremiumAlternatives: true,
    maxPriceDifference: 500, // Show premium if price diff < ₹500
    highlightBenefits: true
  }
};

// ============================================
// PRODUCT CATALOG METADATA
// ============================================
export const productCatalog = {
  categories: [
    "fungicide",
    "insecticide",
    "bactericide",
    "fertilizer",
    "micronutrient",
    "bio-stimulant",
    "bio-fertilizer",
    "organic",
    "irrigation",
    "mulch",
    "protection",
    "support",
    "combo",
    "harvest-aid"
  ],

  brands: [
    "Tata Rallis",
    "Coromandel",
    "UPL",
    "Bayer",
    "Syngenta",
    "PI Industries",
    "Dhanuka",
    "Crystal",
    "Indofil",
    "Generic"
  ],

  certifications: [
    "CIB Approved",
    "Organic Certified",
    "ISO Certified",
    "Government Approved"
  ]
};

// Export everything
export default comprehensiveRulebook;
