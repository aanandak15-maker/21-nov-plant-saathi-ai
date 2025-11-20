# 🎨 Smart Recommendations - Visual Guide

**Quick Reference**: What farmers see on their dashboard

---

## 📱 Dashboard Layout (Updated)

```
┌─────────────────────────────────────────────────┐
│ 🌾 Plant Saathi                        🔔 [3]  │
│ Your smart farming assistant                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📋 Today's Actions                    [1 action]│
│                                                 │
│ 🚨 URGENT                                       │
│ Water your field                                │
│ hgc field soil moisture is low                  │
│ → Irrigate for 2-3 hours                        │
│ ⏰ Next 6 hours                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🌱 My Fields                          [2 fields]│
│                                                 │
│ hgc (Rice)                                      │
│ ████████░░ 25% Health                           │
│ 🔴 Needs attention                              │
│                                                 │
│ test (Wheat)                                    │
│ ██████████ 85% Health                           │
│ 🟢 Healthy                                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🛒 Smart Recommendations          [5 products]  │  ← NEW!
│ Based on your field conditions                  │
│                                                 │
│ 🚨 URGENT (2)                                   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ 🚨 Mancozeb 75% WP Fungicide            │   │
│ │ For: hgc field                          │   │
│ │ Treat Leaf Blight immediately to        │   │
│ │ prevent spread                          │   │
│ │                                         │   │
│ │ ₹850  500g                              │   │
│ │ Dosage: 2g per liter of water           │   │
│ │                                         │   │
│ │ [🛒 Buy Now]  [ℹ️ Details]              │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ 🚨 NPK 19:19:19 Fertilizer              │   │
│ │ For: hgc field                          │   │
│ │ Critical nutrition deficiency -         │   │
│ │ balanced NPK needed                     │   │
│ │                                         │   │
│ │ ₹1,200  50kg                            │   │
│ │ Dosage: 25kg per acre                   │   │
│ │                                         │   │
│ │ [🛒 Buy Now]  [ℹ️ Details]              │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ⚠️ RECOMMENDED (3)                              │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ ⚠️ Micronutrient Mix (Zn, Fe, Mn, B)    │   │
│ │ For: hgc field                          │   │
│ │ Complete nutrition for recovery         │   │
│ │                                         │   │
│ │ ₹450  1kg                               │   │
│ │                                         │   │
│ │ [🛒 Buy Now]  [ℹ️ Details]              │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ [View All 5 Recommendations →]                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🌤️ Weather & Water                              │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Color Coding

### Priority Colors

**🚨 URGENT (Red)**
```
Background: Light red (#FEE2E2)
Border: Red (#FCA5A5)
Text: Dark red (#991B1B)
Icon: 🚨
```

**⚠️ HIGH (Orange)**
```
Background: Light orange (#FFEDD5)
Border: Orange (#FDBA74)
Text: Dark orange (#9A3412)
Icon: ⚠️
```

**💡 MEDIUM (Yellow)**
```
Background: Light yellow (#FEF3C7)
Border: Yellow (#FCD34D)
Text: Dark yellow (#92400E)
Icon: 💡
```

**ℹ️ LOW (Blue)**
```
Background: Light blue (#DBEAFE)
Border: Blue (#93C5FD)
Text: Dark blue (#1E3A8A)
Icon: ℹ️
```

---

## 📦 Product Card Anatomy

```
┌─────────────────────────────────────────────┐
│ [Icon] Product Name                         │ ← Header
│ For: Field Name                             │ ← Context
│ Reason for recommendation                   │ ← Why
│                                             │
│ ₹Price  Unit        [Save ₹X]              │ ← Pricing
│ Dosage: How much to use                     │ ← Usage
│                                             │
│ [🛒 Buy Now]  [ℹ️ Details]                  │ ← Actions
└─────────────────────────────────────────────┘
```

---

## 🎁 Combo Pack Card

```
┌─────────────────────────────────────────────┐
│ 🚨 Disease Treatment + Nutrition Combo      │
│ For: hgc field                              │
│ Integrated solution: Treat disease while    │
│ boosting plant immunity                     │
│                                             │
│ ₹1,800  combo pack    [Save ₹500!]         │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 📦 Combo Pack Contains:             │   │
│ │ • Fungicide                         │   │
│ │ • NPK Fertilizer                    │   │
│ │ • Micronutrients                    │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ [🛒 Buy Now]  [ℹ️ Details]                  │
└─────────────────────────────────────────────┘
```

---

## 🔄 User Interaction Flow

### Flow 1: Buy Now
```
User sees recommendation
    ↓
Clicks "Buy Now"
    ↓
Analytics tracked
    ↓
Navigate to marketplace
    ↓
Product pre-selected
    ↓
Add to cart
    ↓
Checkout
```

### Flow 2: Learn More
```
User sees recommendation
    ↓
Clicks "Details"
    ↓
Analytics tracked
    ↓
Navigate to product page
    ↓
See full details
    ↓
Reviews, specs, usage
    ↓
Decide to buy
```

### Flow 3: View All
```
User sees "View All"
    ↓
Clicks button
    ↓
Navigate to marketplace
    ↓
Recommendations tab
    ↓
See all 10 products
    ↓
Filter, sort, compare
```

---

## 📊 Real Examples

### Example 1: Disease Outbreak
**Scenario**: Leaf Blight detected in rice field

```
┌─────────────────────────────────────────────┐
│ 🛒 Smart Recommendations      [3 products]  │
│ Based on your field conditions              │
│                                             │
│ 🚨 URGENT (2)                               │
│                                             │
│ 🚨 Mancozeb 75% WP Fungicide                │
│ For: Rice Field A                           │
│ Treat Leaf Blight immediately               │
│ ₹850 | 500g                                 │
│ [Buy Now] [Details]                         │
│                                             │
│ 🚨 Copper Oxychloride 50% WP                │
│ For: Rice Field A                           │
│ Backup treatment for resistant strains      │
│ ₹650 | 500g                                 │
│ [Buy Now] [Details]                         │
│                                             │
│ ⚠️ RECOMMENDED (1)                          │
│                                             │
│ ⚠️ NPK Fertilizer                           │
│ Boost plant immunity                        │
│ ₹1,200 | 50kg                               │
│ [Buy Now] [Details]                         │
└─────────────────────────────────────────────┘
```

### Example 2: Low Field Health
**Scenario**: Field health at 25%, low moisture

```
┌─────────────────────────────────────────────┐
│ 🛒 Smart Recommendations      [4 products]  │
│ Based on your field conditions              │
│                                             │
│ 🚨 URGENT (2)                               │
│                                             │
│ 🚨 NPK 19:19:19 Fertilizer                  │
│ For: Wheat Field B                          │
│ Critical nutrition deficiency               │
│ ₹1,200 | 50kg                               │
│ [Buy Now] [Details]                         │
│                                             │
│ 🚨 Drip Irrigation Kit (1 Acre)             │
│ For: Wheat Field B                          │
│ Low soil moisture affecting growth          │
│ ₹15,000 | 1 kit  [Save 50% water]          │
│ [Buy Now] [Details]                         │
│                                             │
│ ⚠️ RECOMMENDED (2)                          │
│ [View All 4 Recommendations →]              │
└─────────────────────────────────────────────┘
```

### Example 3: Weather Alert
**Scenario**: High humidity + disease risk

```
┌─────────────────────────────────────────────┐
│ 🛒 Smart Recommendations      [2 products]  │
│ Based on your field conditions              │
│                                             │
│ ⚠️ RECOMMENDED (2)                          │
│                                             │
│ ⚠️ Preventive Fungicide Spray               │
│ High disease risk due to humidity           │
│ ₹550 | 500ml                                │
│ [Buy Now] [Details]                         │
│                                             │
│ ⚠️ Tarpaulin 20x20 ft                       │
│ Heavy rain expected tomorrow                │
│ ₹1,800 | 1 piece                            │
│ [Buy Now] [Details]                         │
└─────────────────────────────────────────────┘
```

### Example 4: All Good
**Scenario**: Healthy fields, good weather

```
┌─────────────────────────────────────────────┐
│ 🛒 Smart Recommendations                    │
│ Based on your field conditions              │
│                                             │
│ No recommendations at this time.            │
│ Your fields are looking good! 🌾            │
└─────────────────────────────────────────────┘
```

---

## 🎯 Key Visual Elements

### 1. Widget Header
- Purple/pink gradient background
- Shopping cart icon
- Product count badge
- Subtitle explaining context

### 2. Section Headers
- URGENT with alert icon
- RECOMMENDED with trending icon
- Product count in parentheses

### 3. Product Cards
- Priority-colored borders
- White background with transparency
- Clear visual hierarchy
- Prominent action buttons

### 4. Badges
- Savings badges (green)
- Priority badges (colored)
- Product count badges

### 5. Buttons
- Buy Now: Green, prominent
- Details: Outlined, secondary
- View All: Full width, outlined

---

## 📱 Mobile View

```
┌─────────────────────┐
│ 🛒 Smart Recs  [5]  │
│ Based on fields     │
│                     │
│ 🚨 URGENT (2)       │
│                     │
│ ┌─────────────────┐ │
│ │ 🚨 Mancozeb     │ │
│ │ For: hgc        │ │
│ │ Treat Leaf      │ │
│ │ Blight now      │ │
│ │                 │ │
│ │ ₹850  500g      │ │
│ │                 │ │
│ │ [Buy] [Details] │ │
│ └─────────────────┘ │
│                     │
│ [More cards...]     │
│                     │
│ [View All →]        │
└─────────────────────┘
```

---

## 🎨 Design Principles

### 1. **Urgency First**
- Red urgent items at top
- Clear visual hierarchy
- Action-oriented language

### 2. **Context Matters**
- Show which field needs what
- Explain why recommendation
- Link to specific problems

### 3. **Clear Actions**
- Prominent Buy Now button
- Secondary Details option
- Easy to tap/click

### 4. **Trust Building**
- Show dosage information
- Display savings
- Explain expected results

### 5. **Progressive Disclosure**
- Show top 5 on dashboard
- "View All" for more
- Details page for deep dive

---

## ✨ Animation & Interaction

### Hover States
- Cards: Slight elevation
- Buttons: Color change
- Badges: Subtle pulse

### Loading States
- Skeleton cards
- Shimmer effect
- "Analyzing..." text

### Empty States
- Friendly message
- Positive reinforcement
- Emoji for warmth

---

## 🎯 Success Indicators

### Visual Feedback
- ✅ Green checkmark on purchase
- 📦 Cart icon updates
- 🔔 Notification badge

### Analytics Tracking
- 👁️ View tracked
- 🖱️ Click tracked
- 🛒 Purchase tracked

---

**The widget is designed to be helpful, not pushy - recommendations that farmers actually want to see!** 🌾✨
