# DEPLOYMENT GUIDE - PHASE 2 OPTIMIZATIONS

## **OVERVIEW**

Phase 2 optimizations telah diimplementasikan dan siap untuk deployment. Panduan ini menjelaskan langkah-langkah deployment yang diperlukan.

## **PRE-DEPLOYMENT CHECKLIST**

### **✅ Files yang Telah Dimodifikasi/Ditambahkan:**

1. **New Files:**

   - `functions/public/javascripts/util/CacheUtil.js` - Caching utility
   - `functions/public/javascripts/config/OptimizedFirebaseConfig.js` - Optimized Firebase config
   - `functions/public/javascripts/util/WarmupUtil.js` - Warmup utilities
   - `functions/firestore.indexes.json` - Database indexes configuration

2. **Modified Files:**

   - `functions/public/javascripts/repo/CategoryRepo.js` - Added caching
   - `functions/public/javascripts/repo/LearningPathRepo.js` - Added caching
   - `functions/index.js` - Added warmup functions & optimized settings
   - `functions/package.json` - Added node-cache dependency

3. **Documentation:**
   - `functions/OPTIMASI_PERFORMANCE.md` - Updated with Phase 2 details
   - `functions/DEPLOYMENT_GUIDE_PHASE2.md` - This deployment guide

## **DEPLOYMENT STEPS**

### **Step 1: Install Dependencies**

```bash
cd functions
npm install node-cache
```

### **Step 2: Deploy Firestore Configuration**

```bash
# PENTING: Deploy firestore rules dan indexes
firebase deploy --only firestore

# Jika muncul pertanyaan tentang existing indexes:
# "Would you like to delete these indexes? (y/N)"
# JAWAB: N (No) - untuk mempertahankan indexes yang sudah ada

# Atau deploy indexes saja (setelah firestore config sudah ada)
firebase deploy --only firestore:indexes
```

**IMPORTANT:** Saat deploy, Firebase akan mendeteksi indexes yang sudah ada di production tapi tidak ada di file konfigurasi. Saya sudah menambahkan indexes yang ada (notif, messages) ke dalam `firestore.indexes.json`, jadi sekarang tidak akan ada konflik.

**Existing Indexes yang Sudah Ditambahkan:**

- `(notif) -- (isRead,ASCENDING) (userId,ASCENDING) (timestamp,DESCENDING)`
- `(messages) -- (roomId,ASCENDING) (timestamp,DESCENDING)`
- `(messages) -- (isRead,ASCENDING) (timestamp,DESCENDING) (senderEmail,DESCENDING)`
- `(messages) -- (roomId,ASCENDING) (timestamp,ASCENDING)`

### **Step 3: Deploy Functions**

```bash
# Deploy semua functions
firebase deploy --only functions

# Atau deploy specific functions:
firebase deploy --only functions:widgets22,functions:keepFunctionsWarm,functions:healthCheck,functions:warmupStats
```

### **Step 4: Verify Deployment**

```bash
# Test health check endpoint
curl https://asia-southeast2-mentorme-aaa37.cloudfunctions.net/healthCheck

# Test warmup stats endpoint
curl https://asia-southeast2-mentorme-aaa37.cloudfunctions.net/warmupStats

# Test main API
curl -X POST https://asia-southeast2-mentorme-aaa37.cloudfunctions.net/widgets22/api/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

## **POST-DEPLOYMENT MONITORING**

### **1. Function Performance**

Monitor di Firebase Console → Functions:

- Response times should be consistently lower
- Cold starts should be minimal
- Memory usage should be stable

### **2. Cache Performance**

Check cache stats:

```bash
curl https://asia-southeast2-mentorme-aaa37.cloudfunctions.net/warmupStats
```

Expected response:

```json
{
  "timestamp": "2024-01-XX...",
  "cacheStats": {
    "shortCache": {"keys": 0, "stats": {...}},
    "longCache": {"keys": 5, "stats": {...}},
    "staticCache": {"keys": 2, "stats": {...}}
  },
  "functionStatus": "warm"
}
```

### **3. Database Performance**

Monitor di Firebase Console → Firestore:

- Read operations should decrease significantly
- Query performance should improve
- Index usage should be optimal

## **EXPECTED PERFORMANCE IMPROVEMENTS**

### **Before Phase 2:**

- Login API: ~1042ms average
- Categories API: ~500ms (database hit)
- Learning Paths API: ~600ms (database hit)
- Cold start: 2-3 seconds

### **After Phase 2:**

- Login API: ~300-500ms average
- Categories API: ~50ms (cache hit)
- Learning Paths API: ~50ms (cache hit)
- Cold start: Eliminated (kept warm)

## **ROLLBACK PLAN**

Jika terjadi masalah, rollback dengan:

```bash
# Rollback functions
firebase functions:delete keepFunctionsWarm
firebase functions:delete healthCheck
firebase functions:delete warmupStats

# Deploy previous version
git checkout <previous-commit>
firebase deploy --only functions:widgets22
```

## **TROUBLESHOOTING**

### **Issue: Cache Not Working**

```bash
# Check if node-cache installed
npm list node-cache

# Check function logs
firebase functions:log --only widgets22
```

### **Issue: Warmup Function Not Running**

```bash
# Check scheduled function logs
firebase functions:log --only keepFunctionsWarm

# Manually trigger warmup
curl https://asia-southeast2-mentorme-aaa37.cloudfunctions.net/healthCheck
```

### **Issue: Indexes Not Applied**

```bash
# Check index status in Firebase Console
# Firestore Database → Indexes

# Rebuild indexes if needed
firebase deploy --only firestore:indexes --force
```

## **MONITORING COMMANDS**

```bash
# Real-time function logs
firebase functions:log --follow

# Check function status
firebase functions:list

# Monitor performance
firebase functions:log --only widgets22 | grep "POST /api/login/user"
```

## **SUCCESS METRICS**

✅ **Deployment Successful If:**

- All functions deploy without errors
- Health check returns status: "healthy"
- Cache stats show cached data
- Login API response time < 500ms
- No cold start delays
- Database read operations decreased

## **CONTACT & SUPPORT**

Jika ada masalah deployment:

1. Check Firebase Console logs
2. Verify all dependencies installed
3. Ensure indexes are built
4. Test endpoints manually

---

**Phase 2 Deployment Ready!** 🚀
