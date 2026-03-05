import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use relative URL for Vite proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authToken');
    // Fallback to hardcoded token if not present (provided by user)
    if (!token) {
      token = 'eyJhbGciOiJIUzI1NiJ9.eyJDb25zdW1lck5hbWUiOiJSYXZpa2FudCIsIk1ldGVyU2VyaWFsTnVtYmVyIjoiOGM4M2ZjMDUwMDY4MDE5ZSIsIk1vYmlsZU5vIjoiOTk5OTk5OTc4OSIsImFkZHJlc3MiOiIzMjEgUGluZSBTdCIsIlpvbmUiOiJOb2lkYSIsIlJvbGUiOiJDT05TVU1FUiIsInN1YiI6IkNOUzAwNCIsImlhdCI6MTc3MjY5MzE2MywibmJmIjoxNzcyNjkzMTYzLCJleHAiOjE3NzI3Nzk1NjN9.KJditLOlX55mHeEVuhVTuxeDLjw7GOENYWunVsfEl5w';
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message || 'Network error occurred');
  }
);

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/v1/auth/consumer/login', credentials);
    if (response.data) {
      const data = response.data;
      const token = data.data ? data.data.token : data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        const userObj = data.data || data;
        localStorage.setItem('user', JSON.stringify(userObj));

        if (userObj.ConsumerName) localStorage.setItem('consumerName', userObj.ConsumerName);
        if (userObj.MeterSerialNumber) localStorage.setItem('meterSerialNumber', userObj.MeterSerialNumber);
        if (userObj.MobileNo) localStorage.setItem('mobileNo', userObj.MobileNo);
        if (userObj.address) localStorage.setItem('address', userObj.address);
        if (userObj.Zone) localStorage.setItem('zone', userObj.Zone);
        if (userObj.Role) localStorage.setItem('role', userObj.Role);
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/v1/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('consumerName');
      localStorage.removeItem('meterSerialNumber');
      localStorage.removeItem('mobileNo');
      localStorage.removeItem('address');
      localStorage.removeItem('zone');
      localStorage.removeItem('role');
    }
  },

  getCurrentUser: async () => {
    return await api.get('/v1/auth/me');
  }
};

// Dashboard APIs
export const dashboardAPI = {
  getOverview: async () => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.get(`/v1/consumer/summary/${meterSerial}`);
    return response.data;
  },

  getWaterQuality: async () => {
    // The real backend does not have a water-quality endpoint configured.
    // Returning dummy data instead of hitting 401 Unauthorized which breaks the app interceptor.
    return {
      data: [
        { parameter: 'pH Level', value: 7.2, status: 'Good', unit: 'pH' },
        { parameter: 'TDS', value: 250, status: 'Moderate', unit: 'mg/L' },
        { parameter: 'Turbidity', value: 1.5, status: 'Excellent', unit: 'NTU' }
      ]
    };
  },

  getMeterLocation: async () => {
    // The real backend does not have a location endpoint configured.
    // Returning an empty object to satisfy the frontend component
    return {};
  }
};

// Usage APIs
export const usageAPI = {
  getUsageData: async (period = 'monthly') => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const endpoints = {
      'daily': `/v1/consumer/daily/${meterSerial}`,
      'weekly': `/v1/consumer/weekly/${meterSerial}`,
      'monthly': `/v1/consumer/monthly/${meterSerial}`
    };
    const response = await api.get(endpoints[period]);
    return response.data;
  }
};

// Profile APIs
export const profileAPI = {
  getProfile: async () => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.get(`/v1/consumer/summary/${meterSerial}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.put(`/v1/consumer/summary/${meterSerial}`, profileData);
    return response.data;
  }
};

// Billing APIs
export const billingAPI = {
  getCurrentBill: async () => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.get(`/v1/billing/current/${meterSerial}`);
    return response.data;
  },

  getPaymentHistory: async (filters = {}) => {
    const response = await api.post(`/v1/billing/history`, filters);
    return response.data;
  },

  makePayment: async (paymentData) => {
    const billId = paymentData.billId;
    const response = await api.post(`/v1/billing/pay/${billId}?paymentMode=${paymentData.paymentMode || 'UPI'}`, paymentData);
    return response.data;
  }
};

// Report/Support APIs
export const reportAPI = {
  submitTicket: async (ticketData) => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.post(`/v1/complaints/${meterSerial}`, ticketData);
    return response.data;
  },

  getTickets: async () => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.get(`/v1/complaints/consumer/${meterSerial}`);
    return response.data;
  },

  updateComplaintStatus: async (complaintId, status) => {
    const meterSerial = localStorage.getItem('meterSerialNumber') || '8c83fc050068019e';
    const response = await api.post(`/v1/complaints/consumer/status/${complaintId}?meterSerial=${meterSerial}&status=${status}`);
    return response.data;
  }
};

export default api;
