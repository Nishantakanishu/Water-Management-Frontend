# 🚨 API Integration Setup Guide

## Current Issue Analysis

Based on the error messages, your backend server at `115.124.119.161:5029` has the following problems:

### ❌ **Primary Issues:**
1. **CORS Policy**: Blocking requests from `localhost:5173`
2. **Server Not Responding**: `net::ERR_FAILED` - connection refused
3. **Missing CORS Headers**: No `Access-Control-Allow-Origin` header

## 🔧 **Backend Setup Required**

### **1. CORS Configuration**
Your backend MUST return these headers on ALL responses:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### **2. API Endpoints**
```
POST /api/v1/auth/consumer/login
GET  /api/v1/dashboard/overview
GET  /api/v1/dashboard/usage
GET  /api/v1/dashboard/water-quality
GET  /api/v1/dashboard/location
GET  /api/v1/profile
PUT  /api/v1/profile
GET  /api/v1/billing/current
GET  /api/v1/billing/history
POST /api/v1/billing/pay
GET  /api/v1/billing/invoice/:id
GET  /api/v1/billing/stats
GET  /api/v1/usage/data
GET  /api/v1/usage/stats
GET  /api/v1/usage/insights
GET  /api/v1/usage/export
POST /api/v1/support/tickets
GET  /api/v1/support/tickets/:id
PUT  /api/v1/support/tickets/:id
```

### **3. Expected Login Response**
```json
{
  "success": true,
  "message": "Login Successfully",
  "data": {
    "ConsumerName": "Ravikant",
    "MeterSerialNumber": "8c83fc050068019e",
    "MobileNo": "9999999789",
    "address": "321 Pine St",
    "Zone": "Noida",
    "Role": "CONSUMER",
    "token": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

## 🛠 **Frontend Solutions Implemented**

### **1. CORS Bypass Methods**
- ✅ `mode: 'no-cors'` in fetch requests
- ✅ Direct API calls bypassing browser CORS
- ✅ Multiple login methods available

### **2. Error Handling**
- ✅ Network error detection (`ERR_FAILED`, `ECONNREFUSED`)
- ✅ User-friendly error messages
- ✅ Detailed console logging
- ✅ Graceful fallback handling

### **3. Available Routes**
- **Main Login**: `http://localhost:5173/` (with axios)
- **Simple Login**: `http://localhost:5173/simple-login` (bypass CORS)
- **API Test**: `http://localhost:5173/portal` → API Test tab

## 🚀 **Immediate Actions Required**

### **For Backend Team:**
1. **Add CORS Headers** to your server responses
2. **Check Server Status** - ensure it's running on port 5029
3. **Verify API Endpoints** - all must be accessible

### **For Testing:**
1. **Start Development Server**:
   ```bash
   cd "Consumer Portal/Consumer Portal"
   npm run dev
   ```

2. **Test Simple Login**:
   - Go to: `http://localhost:5173/simple-login`
   - Use credentials: `CNS004` / `9999999789`
   - Should work even with CORS issues

3. **Test API Connection**:
   - Go to Portal → API Test tab
   - Click "Test Direct API Connection"
   - Check console for detailed results

## 📋 **Troubleshooting Steps**

### **If Simple Login Works:**
- ✅ Backend is accessible
- ✅ CORS headers are properly configured
- ✅ API endpoints are working

### **If Simple Login Still Fails:**
- ❌ Backend server is down or not accessible
- ❌ Port 5029 is blocked or firewalled
- ❌ IP address 115.124.119.161 is not reachable

## 🔍 **Test Your Backend Now**

Run this command to verify your server:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"CNS004","password":"9999999789"}' \
  http://115.124.119.161:5029/api/v1/auth/consumer/login
```

**Expected Response:**
```json
{"success": true, "message": "Login Successfully", "data": {...}}
```

## 📞 **Contact Information**

If the backend setup is correct, the issue is likely:
1. **Firewall blocking** port 5029
2. **Server not running** on the specified IP
3. **Wrong IP address** or port configuration
4. **Network routing issues** between your machine and server

**Please verify:**
- ✅ Server is running on `115.124.119.161:5029`
- ✅ Port 5029 is accessible from your development machine
- ✅ CORS headers are properly configured
