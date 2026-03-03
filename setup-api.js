// API Setup and Test Script
// This will help verify your backend setup

const API_CONFIG = {
  BASE_URL: 'http://115.124.119.161:5029/api/v1',
  LOGIN_ENDPOINT: '/v1/auth/consumer/login',
  CREDENTIALS: {
    email: 'CNS004',
    password: '9999999789'
  }
};

// Test functions
async function testAPIConnection() {
  console.log('🔍 Testing API Connection...');
  console.log('📍 API URL:', API_CONFIG.BASE_URL + API_CONFIG.LOGIN_ENDPOINT);
  
  try {
    const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.LOGIN_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(API_CONFIG.CREDENTIALS)
    });

    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('✅ API Response Data:', data);
    
    if (data.success) {
      console.log('🎉 SUCCESS: Login API is working!');
      console.log('👤 User Name:', data.data.ConsumerName);
      console.log('📱 Mobile:', data.data.MobileNo);
      console.log('🏠 Address:', data.data.address);
      console.log('🌍 Zone:', data.data.Zone);
      console.log('🆔 Meter:', data.data.MeterSerialNumber);
      console.log('🔑 Token:', data.data.token ? 'Present' : 'Missing');
    } else {
      console.log('❌ FAILED: Login API returned error');
      console.log('Error Message:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('🚨 NETWORK ERROR:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Details:', error);
    return null;
  }
}

// Backend health check
async function checkBackendHealth() {
  console.log('🏥 Checking Backend Health...');
  
  try {
    const response = await fetch(API_CONFIG.BASE_URL.replace('/api/v1', '') + '/health', {
      method: 'GET',
      mode: 'cors'
    });
    
    const isHealthy = response.ok;
    console.log(isHealthy ? '✅ Backend is HEALTHY' : '❌ Backend is DOWN');
    console.log('Health Status:', response.status);
    
    return isHealthy;
  } catch (error) {
    console.error('🚨 Backend Health Check Failed:', error.message);
    return false;
  }
}

// Instructions for backend setup
console.log(`
🔧 BACKEND SETUP REQUIRED:
============================

1. CORS HEADERS NEEDED:
   Add these headers to ALL responses:
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization

2. API ENDPOINTS:
   Login: ${API_CONFIG.BASE_URL}${API_CONFIG.LOGIN_ENDPOINT}
   Dashboard: ${API_CONFIG.BASE_URL}/v1/dashboard/overview
   Profile: ${API_CONFIG.BASE_URL}/v1/profile
   Billing: ${API_CONFIG.BASE_URL}/v1/billing/current
   Usage: ${API_CONFIG.BASE_URL}/v1/usage/data
   Report: ${API_CONFIG.BASE_URL}/v1/support/tickets

3. SERVER REQUIREMENTS:
   ✅ Server running on: 115.124.119.161:5029
   ✅ API accessible at: http://115.124.119.161:5029/api/v1
   ✅ CORS properly configured
   ✅ Login endpoint: /v1/auth/consumer/login

4. TEST RESULTS:
   📊 Expected Response: {"success": true, "data": {...}}
   🔑 Credentials: ${API_CONFIG.CREDENTIALS.email} / ${API_CONFIG.CREDENTIALS.password}
   🌐 Your IP: 115.124.119.161:5029

🚀 RUN THIS SCRIPT:
   node setup-api.js
============================
`);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, testAPIConnection, checkBackendHealth };
}
