# VERIFICATION CHECKLIST - Scalability Fixes

Run through this checklist to verify all fixes are properly implemented.

## ✅ 1. Database Indexes

**Action**: Run `supabase/migrations/add_performance_indexes.sql` in Supabase SQL Editor

**Verify**:
```sql
-- Run this to check indexes:
SELECT tablename, indexname FROM pg_indexes 
WHERE tablename IN ('fields', 'field_data', 'analytics_events')
ORDER BY tablename;
```

**Expected Result**: Should see at least 9 indexes total:
- `idx_fields_user_id`
- `idx_fields_status`
- `idx_fields_created_at`
- `idx_field_data_field_id`
- `idx_field_data_timestamp`
- `idx_field_data_field_timestamp`
- `idx_analytics_events_user_id`
- `idx_analytics_events_created_at`
- `idx_analytics_events_type`

---

## ✅ 2. View Events System

**Action**: Run `supabase/migrations/create_view_events_system.sql` in Supabase SQL Editor

**Verify**:
```sql
-- Check if table exists:
SELECT COUNT(*) FROM view_events;

-- Check if materialized view exists:
SELECT * FROM content_view_counts LIMIT 1;
```

**Expected Result**: Queries should execute without errors.

**Setup Cron**:
```sql
-- Run this to set up hourly refresh (requires pg_cron extension):
SELECT cron.schedule(
  'refresh-view-counts',   -- job name
  '0 * * * *',            -- every hour
  'SELECT refresh_view_counts();'
);
```

---

## ✅ 3. Backend Authentication

**Action**: Verify backend-proxy has auth middleware

**Check Files**:
- ✅ `backend-proxy/index.js` has `authenticate` middleware (lines 37-48)
- ✅ `backend-proxy/.env` has `BACKEND_API_KEY` set
- ✅ `.env` has `VITE_BACKEND_API_KEY` set (same value as backend)

**Test Auth**:
```bash
# Without API key (should fail with 401):
curl http://localhost:3001/api/weather/current?city=Delhi

# With API key (should work):
curl -H "x-api-key: YOUR_KEY" http://localhost:3001/api/weather/current?city=Delhi
```

**Expected Result**: 
- First curl: `401 Unauthorized`
- Second curl: Weather data JSON

---

## ✅ 4. Rate Limiting

**Action**: Verify express-rate-limit is installed and configured

**Check**:
```bash
cd backend-proxy
npm list express-rate-limit
```

**Expected Result**: Should show `express-rate-limit@8.2.1` (or similar)

**Test Rate Limit**:
```bash
# Spam requests (should get rate limited after 100):
for i in {1..102}; do 
  curl -H "x-api-key: YOUR_KEY" http://localhost:3001/health
  sleep 0.1
done
```

**Expected Result**: After ~100 requests, should see:
```json
{"error":"Too many requests, please try again later"}
```

---

## ✅ 5. Frontend Integration

**Check Files**:
- ✅ `src/lib/weatherService.ts` has `authenticatedFetch()` method
- ✅ All fetch calls use `this.authenticatedFetch()`
- ✅ `src/lib/viewEventsService.ts` exists
- ✅ `.env` has `VITE_BACKEND_API_KEY`

**Verify in Browser**:
1. Open DevTools → Network tab
2. Navigate to Dashboard
3. Check weather API requests
4. Should see `x-api-key` header in request headers

---

## ⚠️ CRITICAL: Before Production

### Environment Variables
```bash
# Generate secure API key:
openssl rand -base64 32

# Backend (.env in backend-proxy/):
BACKEND_API_KEY=<generated-key>
GEE_PROJECT_ID=<your-project>
GEE_PRIVATE_KEY="<your-key>"
GEE_CLIENT_EMAIL=<your-email>
OPENWEATHER_API_KEY=<your-key>

# Frontend (.env in root):
VITE_BACKEND_API_KEY=<same-as-backend>
VITE_SATELLITE_PROXY_URL=https://your-backend.com
```

### Restart Services
```bash
# Backend
cd backend-proxy
npm start

# Frontend
npm run dev
```

---

## 📊 Final Performance Test

### Load Test (optional but recommended):
```bash
# Install artillery (if not installed):
npm install -g artillery

# Create test.yml:
cat > load-test.yml << EOF
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up to 50 req/sec"
scenarios:
  - name: "Weather API"
    flow:
      - get:
          url: "/health"
EOF

# Run load test:
artillery run load-test.yml
```

**Expected Result**: 
- P99 latency < 500ms
- 0% error rate (except rate limiting at high volumes)
- No 5xx errors

---

## ✅ SIGN-OFF CHECKLIST

- [ ] Database indexes created (verified via SQL)
- [ ] View events table created
- [ ] Materialized view created
- [ ] Cron job scheduled for view count refresh
- [ ] Backend API key configured
- [ ] Frontend API key configured
- [ ] Rate limiting tested
- [ ] Auth tested (401 without key, 200 with key)
- [ ] Services restarted
- [ ] Load test passed (optional)

---

## 🚀 You're Ready for 1000 Users!

Once all items above are checked, your system can handle 1000+ concurrent users.

**Monitoring**: Set up alerts for:
- High error rates (>5%)
- Slow queries (>1 second)
- Rate limit hits (indicates abuse)
- Database connection pool exhaustion
