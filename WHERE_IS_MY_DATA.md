# 🔍 Where Is My Previous Field Data?

## Your Data Storage Locations

Your Plant Saathi app stores data in **two places**:

### 1. **Supabase (Cloud Database)** ☁️
- **Primary storage** for all field data
- Accessible from any device
- Survives browser cache clears
- **URL**: https://oislgcwardyvphznqoku.supabase.co

### 2. **LocalStorage (Browser)** 💾
- **Backup/cache** storage
- Only on this browser/device
- Lost if you clear browser data
- Used for offline access

---

## How to Check Your Data

### Option 1: Check in the App (Easiest)
1. Open the app: http://localhost:8080/soilsati
2. Log in with your account
3. Go to "My Fields"
4. Your fields should appear automatically

### Option 2: Use the Data Checker Tool
1. Open `check-my-fields.html` in your browser
2. Click "🔍 Check My Data"
3. Enter your Supabase credentials (already in .env):
   - URL: `https://oislgcwardyvphznqoku.supabase.co`
   - Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (from .env)
4. See all your fields

### Option 3: Check Browser Console
1. Open the app
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Type: `localStorage` and press Enter
5. Look for keys starting with `field_`

### Option 4: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Select your project: `oislgcwardyvphznqoku`
4. Go to Table Editor → `fields` table
5. See all your fields

---

## Common Scenarios

### Scenario 1: "I see no fields in the app"
**Possible causes:**
- Not logged in
- Wrong user account
- Data in LocalStorage but not Supabase

**Solution:**
1. Make sure you're logged in
2. Check browser console for errors
3. Use the data checker tool
4. If data is in LocalStorage, migrate it to Supabase

### Scenario 2: "I had fields before, now they're gone"
**Possible causes:**
- Browser cache cleared
- Different browser/device
- Logged in with different account

**Solution:**
1. Check if you're using the same account
2. Check Supabase dashboard directly
3. If data was only in LocalStorage, it may be lost

### Scenario 3: "Fields show but no satellite data"
**This is normal!**
- Satellite data is fetched on-demand
- Click "Fetch Real Satellite Data Now" button
- Data is cached for 24 hours

---

## Data Migration (If Needed)

If your data is in LocalStorage but not Supabase:

### Automatic Migration:
1. Open `check-my-fields.html`
2. Click "🔄 Migrate LocalStorage → Supabase"
3. Log in when prompted
4. Wait for migration to complete
5. Refresh the app

### Manual Migration:
```javascript
// Run this in browser console while logged in to the app
const migrateFields = async () => {
  const { supabase } = await import('./src/lib/supabase.ts');
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('Please log in first');
    return;
  }
  
  const keys = Object.keys(localStorage).filter(k => k.startsWith('field_'));
  
  for (const key of keys) {
    const field = JSON.parse(localStorage.getItem(key));
    await supabase.from('fields').insert([{
      user_id: user.id,
      name: field.name,
      crop_type: field.cropType,
      area: field.area,
      coordinates: field.coordinates,
      sowing_date: field.sowingDate,
      status: 'active'
    }]);
  }
  
  console.log('Migration complete!');
};

migrateFields();
```

---

## Data Structure

Your fields are stored with this structure:

```json
{
  "id": "uuid",
  "user_id": "your-user-id",
  "name": "Field Name",
  "crop_type": "Rice",
  "area": 2.5,
  "coordinates": [[lng, lat], [lng, lat], ...],
  "sowing_date": "2024-01-15",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Quick Checks

### Check 1: Are you logged in?
```javascript
// Run in console
const { supabase } = await import('./src/lib/supabase.ts');
const { data: { user } } = await supabase.auth.getUser();
console.log('Logged in as:', user?.email || 'Not logged in');
```

### Check 2: How many fields in Supabase?
```javascript
// Run in console
const { supabase } = await import('./src/lib/supabase.ts');
const { data: fields } = await supabase.from('fields').select('*');
console.log('Fields in Supabase:', fields?.length || 0);
```

### Check 3: How many fields in LocalStorage?
```javascript
// Run in console
const fieldKeys = Object.keys(localStorage).filter(k => k.startsWith('field_'));
console.log('Fields in LocalStorage:', fieldKeys.length);
```

---

## Need Help?

If you still can't find your data:

1. **Check the browser console** for error messages
2. **Verify you're logged in** with the correct account
3. **Check Supabase dashboard** directly
4. **Look for LocalStorage data** and migrate if needed
5. **Check if fields are archived** - click "📦 History" tab

---

## Data Safety Tips

✅ **Always log in** - Data is tied to your user account
✅ **Don't clear browser data** without backing up
✅ **Use the same account** across devices
✅ **Check Supabase dashboard** periodically
✅ **Export important data** if needed

---

**Your data is safe!** It's stored in Supabase cloud database and survives browser refreshes, cache clears, and device changes as long as you log in with the same account.
