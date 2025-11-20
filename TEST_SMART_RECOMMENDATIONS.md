# 🧪 Test Smart Recommendations - Quick Guide

**How to test the new Smart Recommendations feature**

---

## 🚀 Quick Start

### 1. Start the App
```bash
npm run dev
```

### 2. Login
- Go to http://localhost:5173
- Login with your test account
- Navigate to Dashboard

### 3. Look for the Widget
- Scroll down on dashboard
- Find the purple "🛒 Smart Recommendations" widget
- It should be position #3 (after Today's Actions and My Fields)

---

## 🧪 Test Scenarios

### Scenario 1: Disease Detection → Urgent Recommendations

**Setup**:
1. Go to Disease Detection module
2. Upload an image with disease (or use mock data)
3. Detect a disease (e.g., Leaf Blight)
4. Return to Dashboard

**Expected Result**:
```
🛒 Smart Recommendations [2-3 products]

🚨 URGENT (2)

🚨 Mancozeb 75% WP Fungicide
For: [field name]
Treat Leaf Blight immediately to prevent spread
₹850 | 500g
Dosage: 2g per liter of water
[Buy Now] [Details]

🚨 Copper Oxychloride 50% WP
For: [field name]
Backup treatment for resistant strains
₹650 | 500g
[Buy Now] [Details]
```

**Test Actions**:
- [ ] Click "Buy Now" → Should navigate to marketplace
- [ ] Click "Details" → Should show product details
- [ ] Verify field name is shown correctly
- [ ] Verify dosage information is displayed

---

### Scenario 2: Low Field Health → Nutrition Recommendations

**Setup**:
1. Create a field with low health score (<30%)
2. Or manually set field health to 25% in database
3. Go to Dashboard

**Expected Result**:
```
🛒 Smart Recommendations [3-4 products]

🚨 URGENT (2)

🚨 NPK 19:19:19 Fertilizer
For: [field name]
Critical nutrition deficiency - balanced NPK needed
₹1,200 | 50kg
Dosage: 25kg per acre
[Buy Now] [Details]

⚠️ RECOMMENDED (2)

⚠️ Micronutrient Mix
Complete nutrition for recovery
₹450 | 1kg
[Buy Now] [Details]
```

**Test Actions**:
- [ ] Verify urgent priority for NPK
- [ ] Verify high priority for micronutrients
- [ ] Check field name is correct
- [ ] Test Buy Now button

---

### Scenario 3: Weather Alert → Preventive Recommendations

**Setup**:
1. Wait for high humidity weather (>80%)
2. Or mock weather data with high humidity
3. Go to Dashboard

**Expected Result**:
```
🛒 Smart Recommendations [1-2 products]

⚠️ RECOMMENDED (1)

⚠️ Preventive Fungicide Spray
High disease risk due to humidity - preventive treatment recommended
₹550 | 500ml
[Buy Now] [Details]
```

**Test Actions**:
- [ ] Verify weather-based recommendation appears
- [ ] Check reason mentions humidity
- [ ] Test navigation to marketplace

---

### Scenario 4: Multiple Issues → Combo Pack

**Setup**:
1. Have a field with disease detected
2. Same field has low health (<40%)
3. Go to Dashboard

**Expected Result**:
```
🛒 Smart Recommendations [4-5 products]

🚨 URGENT (2)

🚨 Disease Treatment + Nutrition Combo
For: [field name]
Integrated solution: Treat disease while boosting plant immunity
₹1,800 | combo pack  [Save ₹500!]

📦 Combo Pack Contains:
• Fungicide
• NPK Fertilizer
• Micronutrients

[Buy Now] [Details]
```

**Test Actions**:
- [ ] Verify combo pack appears
- [ ] Check savings badge is shown
- [ ] Verify "Contains" list is displayed
- [ ] Test Buy Now for combo

---

### Scenario 5: Healthy Fields → No Recommendations

**Setup**:
1. Have all fields with health >70%
2. No diseases detected
3. Good weather conditions
4. Go to Dashboard

**Expected Result**:
```
🛒 Smart Recommendations

No recommendations at this time.
Your fields are looking good! 🌾
```

**Test Actions**:
- [ ] Verify empty state message
- [ ] Check positive tone
- [ ] Verify no error messages

---

## 🎯 Feature Checklist

### Visual Elements
- [ ] Widget has purple/pink gradient background
- [ ] Shopping cart icon is visible
- [ ] Product count badge shows correct number
- [ ] Section headers (URGENT, RECOMMENDED) are clear
- [ ] Priority colors are correct (red, orange, yellow, blue)
- [ ] Priority icons are shown (🚨, ⚠️, 💡, ℹ️)

### Product Cards
- [ ] Product name is clear
- [ ] Field name context is shown (when applicable)
- [ ] Reason for recommendation is displayed
- [ ] Price and unit are visible
- [ ] Dosage information is shown (when available)
- [ ] Savings badge appears for combo packs
- [ ] "Contains" list shows for combo packs
- [ ] Buy Now button is green and prominent
- [ ] Details button is outlined

### Functionality
- [ ] Recommendations load without errors
- [ ] Loading state shows while fetching
- [ ] Empty state shows when no recommendations
- [ ] Buy Now navigates to marketplace
- [ ] Details shows product information
- [ ] View All button appears when >5 products
- [ ] View All navigates to marketplace recommendations

### Priority Logic
- [ ] Disease recommendations are URGENT
- [ ] Critical health (<30%) is URGENT
- [ ] Low health (30-50%) is HIGH
- [ ] Weather alerts are HIGH
- [ ] Combo packs are URGENT when applicable
- [ ] Growth stage recommendations are MEDIUM

### Data Integration
- [ ] Uses real field data
- [ ] Uses real disease detections
- [ ] Uses real weather data
- [ ] Recommendations update when data changes
- [ ] No duplicate recommendations shown

---

## 🐛 Common Issues & Fixes

### Issue 1: No Recommendations Showing
**Possible Causes**:
- No fields created
- All fields have no data
- No diseases detected
- Weather data not loaded

**Fix**:
1. Create at least one field
2. Add some field data (health, moisture)
3. Or detect a disease
4. Refresh dashboard

---

### Issue 2: Wrong Products Recommended
**Possible Causes**:
- Rules not matching correctly
- Field data incorrect
- Disease not detected properly

**Fix**:
1. Check field health scores
2. Verify disease detection results
3. Check weather data
4. Review rules in `recommendationRules.json`

---

### Issue 3: Buy Now Not Working
**Possible Causes**:
- Navigation not configured
- Marketplace route missing
- Product ID incorrect

**Fix**:
1. Check browser console for errors
2. Verify marketplace route exists
3. Check product ID format

---

### Issue 4: Duplicate Recommendations
**Possible Causes**:
- Deduplication logic not working
- Multiple rules matching same product

**Fix**:
- Already handled in code
- Check if issue persists
- Review deduplication logic

---

## 📊 Analytics Testing

### Track Recommendation Views
1. Open dashboard
2. See recommendations widget
3. Check browser console for log:
   ```
   BlackBox: recommendations_generated
   ```

### Track Recommendation Clicks
1. Click "Buy Now" on any product
2. Check console for log:
   ```
   BlackBox: recommendation_clicked (action: buy)
   ```

3. Click "Details" on any product
4. Check console for log:
   ```
   BlackBox: recommendation_clicked (action: learn_more)
   ```

---

## 🎨 Visual Testing

### Desktop (1920x1080)
- [ ] Widget fits nicely in dashboard
- [ ] Cards are readable
- [ ] Buttons are clickable
- [ ] Spacing is good

### Tablet (768x1024)
- [ ] Widget is responsive
- [ ] Cards stack properly
- [ ] Text is readable
- [ ] Buttons are touch-friendly

### Mobile (375x667)
- [ ] Widget is compact
- [ ] Cards are scrollable
- [ ] Text is not cut off
- [ ] Buttons are large enough

---

## ✅ Acceptance Criteria

### Must Have
- [x] Widget displays on dashboard
- [x] Shows top 5 recommendations
- [x] Urgent section shows disease/critical health
- [x] Recommended section shows other priorities
- [x] Buy Now navigates to marketplace
- [x] Details shows product info
- [x] Empty state for no recommendations
- [x] Loading state while fetching

### Should Have
- [x] Combo packs with savings
- [x] Field context shown
- [x] Dosage information
- [x] Priority colors
- [x] View All button
- [x] Analytics tracking

### Nice to Have
- [ ] Product images
- [ ] User reviews
- [ ] Price comparison
- [ ] Stock availability

---

## 🚀 Ready to Test!

1. Start the app: `npm run dev`
2. Login to dashboard
3. Look for purple "🛒 Smart Recommendations" widget
4. Test all scenarios above
5. Report any issues

---

**Happy Testing! 🧪🌾**
