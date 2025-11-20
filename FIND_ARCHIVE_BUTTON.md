# 🔍 Where to Find the Archive/Deactivate Button

## The Button EXISTS! Here's Where to Look:

### Location 1: Field Details Page (MAIN LOCATION) ⭐

**Steps to find it:**
1. Go to "My Fields" page (`/soilsati`)
2. Click on ANY field card
3. **Scroll ALL THE WAY DOWN** to the bottom
4. You'll see these buttons in order:
   - "Smart Crop Rotation Planner" (green)
   - "Diagnose Plant Disease" (red)
   - **"🌾 Mark as Harvested (Move to History)"** ← THIS IS IT! (amber/orange border)
   - "Predict Yield" (green or gray)

**What it looks like:**
```
┌─────────────────────────────────────────────┐
│  📦 Mark as Harvested (Move to History)    │
│  (Amber/orange border, full width button)  │
└─────────────────────────────────────────────┘
```

### Location 2: My Fields List (SECONDARY LOCATION)

**Steps to find it:**
1. Go to "My Fields" page (`/soilsati`)
2. Look at each field card
3. At the bottom of each card, you'll see TWO buttons:
   - "View Details →" (left side)
   - **"📦 Archive"** (right side, amber styling)

**What it looks like:**
```
┌──────────────────────────────────────────┐
│  Field Name                              │
│  🌾 Rice                                 │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ View Details │  │  📦 Archive  │    │
│  └──────────────┘  └──────────────┘    │
└──────────────────────────────────────────┘
```

---

## Why You Might Not See It:

### Reason 1: Field is Already Archived
- The button only shows for **ACTIVE** fields
- If your field is already harvested/archived, you'll see "🌱 Reactivate" instead
- Check the "📦 History" tab to see archived fields

### Reason 2: Not Scrolled Down Enough
- The button is at the **VERY BOTTOM** of the field details page
- Scroll past:
  - Field summary
  - AI Strategy card
  - Satellite data section
  - Field health map
  - Vegetation indices
  - Soil properties
  - **THEN you'll see the action buttons**

### Reason 3: Page Not Loaded Completely
- Wait for the page to fully load
- Check browser console (F12) for errors
- Try refreshing the page

### Reason 4: Field Status Issue
- The button checks: `if (!field.status || field.status === 'active')`
- If field.status is something else, button won't show
- Check field status in console:
```javascript
// Open field details, then run in console:
console.log('Field status:', field.status);
```

---

## Quick Test:

### Test 1: Check if Button Exists in DOM
1. Open field details page
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Run:
```javascript
document.querySelector('button:has-text("Mark as Harvested")')
```
or
```javascript
Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Mark as Harvested'))
```

### Test 2: Force Show Button (Debug)
1. Open field details page
2. Press F12
3. Go to Console
4. Run:
```javascript
// Check field status
const fieldData = JSON.parse(localStorage.getItem(`field_${window.location.pathname.split('/').pop()}_data`));
console.log('Field status:', fieldData?.status || 'active (default)');
```

---

## Screenshot Guide:

**What you should see on Field Details page (scroll to bottom):**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [Soil Properties Section]                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  🌱 Smart Crop Rotation Planner              │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  📷 Diagnose Plant Disease                    │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  📦 Mark as Harvested (Move to History)      │ │ ← HERE!
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  📊 Predict Yield                             │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Still Can't Find It?

### Option 1: Check Browser Console
```javascript
// Run this in console on field details page
const buttons = Array.from(document.querySelectorAll('button'));
console.log('All buttons:', buttons.map(b => b.textContent));
```

### Option 2: Check Field Status
```javascript
// Check if field is active
const fieldId = window.location.pathname.split('/').pop();
const fieldData = localStorage.getItem(`field_${fieldId}_data`);
if (fieldData) {
  const field = JSON.parse(fieldData);
  console.log('Field status:', field.status || 'active');
  console.log('Should show archive button:', !field.status || field.status === 'active');
}
```

### Option 3: Manual Archive (Console Command)
If you really can't find the button, you can archive manually:
```javascript
// Run this in console on field details page
const fieldId = window.location.pathname.split('/').pop();
import('@/lib/fieldLifecycleService').then(({ fieldLifecycleService }) => {
  fieldLifecycleService.confirmHarvest(fieldId, {
    notes: 'Manually archived via console'
  }).then(() => {
    alert('Field archived!');
    window.location.href = '/soilsati';
  });
});
```

---

## Summary:

✅ **The button IS in the code**
✅ **It's at the bottom of field details page**
✅ **It only shows for active fields**
✅ **Scroll all the way down to see it**

If you still can't see it after scrolling to the very bottom of the field details page, please:
1. Take a screenshot of the bottom of the page
2. Check browser console for errors
3. Run the debug commands above to check field status
