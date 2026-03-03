import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://115.124.119.161:5029/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Important for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
  (response) => {
    return response; // Return full response to prevent issues
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    
    // Handle network errors more gracefully
    if (error.code === 'ERR_FAILED' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return Promise.reject({
        message: 'Network connection failed. Please check if the server is running.',
        status: 0,
        code: error.code
      });
    }
    
    return Promise.reject(error.response?.data || error.message || 'Network error occurred');
  }
);

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/v1/auth/consumer/login', credentials);
    const data = response.data; // Extract data from response
    
    // Store token and user data if login successful
    if (data.success && data.data) {
      const token = data.data.token;
      localStorage.setItem('authToken', token);
      
      // Store all user data from backend response
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('consumerName', data.data.ConsumerName);
      localStorage.setItem('meterSerialNumber', data.data.MeterSerialNumber);
      localStorage.setItem('mobileNo', data.data.MobileNo);
      localStorage.setItem('address', data.data.address);
      localStorage.setItem('zone', data.data.Zone);
      localStorage.setItem('role', data.data.Role);
      
      console.log('✅ Login successful - Token stored:', token);
    }
    
    return data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear all user data on logout
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
    return await api.get('/auth/me');
  }
};

// Dashboard APIs
export const dashboardAPI = {
  getOverview: async () => {
    return await api.get('/v1/dashboard/overview');
  },
  
  getWaterUsage: async (period = 'monthly') => {
    return await api.get(`/v1/dashboard/usage?period=${period}`);
  },
  
  getWaterQuality: async () => {
    return await api.get('/v1/dashboard/water-quality');
  },
  
  getMeterLocation: async () => {
    return await api.get('/v1/dashboard/location');
// Profile APIs
export const profileAPI = {
  getProfile: async () => {
    return await api.get('/v1/consumer/summary/8c83fc050068019e');
  },
  
  updateProfile: async (profileData) => {
    return await api.put('/v1/consumer/summary/8c83fc050068019e', profileData);
  },
  
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return await api.post('/v1/consumer/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Dashboard APIs
export const dashboardAPI = {
  getOverview: async () => {
    return await api.get('/v1/consumer/summary/8c83fc050068019e');
  },
  
  getWaterUsage: async (period = 'monthly') => {
    const endpoints = {
      'daily': '/v1/consumer/daily/8c83fc050068019e',
      'weekly': '/v1/consumer/weekly/8c83fc050068019e',
      'monthly': '/v1/consumer/monthly/8c83fc050068019e'
    };
    return await api.get(endpoints[period]);
  },
  
  getWaterQuality: async () => {
    return await api.get('/v1/consumer/water-quality/8c83fc050068019e');
  },
  
  getMeterLocation: async () => {
    return await api.get('/v1/consumer/location/8c83fc050068019e');
  }
};

// Billing APIs
export const billingAPI = {
  getCurrentBill: async () => {
    return await api.get('/v1/consumer/billing/current/8c83fc050068019e');
  },
  
  getPaymentHistory: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await api.get(`/v1/consumer/billing/history/8c83fc050068019e?${params}`);
  },
  
  makePayment: async (paymentData) => {
    const billId = paymentData.billId || '23300b06-96f0-4d96-a0e9-53ca727db8ce';
    return await api.post(`/v1/billing/pay/${billId}?paymentMode=${paymentData.paymentMode || 'UPI'}`, paymentData);
  },
  
  downloadInvoice: async (invoiceId) => {
    return await api.get(`/v1/billing/invoice/${invoiceId}`, {
      responseType: 'blob',
    });
  },
  
  getBillingStats: async () => {
    return await api.get('/v1/consumer/billing/stats/8c83fc050068019e');
  }
};

// Usage APIs
export const usageAPI = {
  getUsageData: async (period = 'monthly') => {
    const endpoints = {
      'daily': '/v1/consumer/daily/8c83fc050068019e',
      'weekly': '/v1/consumer/weekly/8c83fc050068019e',
      'monthly': '/v1/consumer/monthly/8c83fc050068019e'
    };
    return await api.get(endpoints[period]);
  },
  
  getUsageStats: async (period = 'monthly') => {
    return await api.get(`/v1/consumer/stats/${period}/8c83fc050068019e`);
  },
  
  getUsageInsights: async () => {
    return await api.get('/v1/consumer/insights/8c83fc050068019e');
  },
  
  exportUsageData: async (format = 'csv', period = 'monthly') => {
    return await api.get(`/v1/consumer/export/${period}/8c83fc050068019e?format=${format}`);
  }
};

// Report/Support APIs
export const reportAPI = {
  submitTicket: async (ticketData) => {
    const formData = new FormData();
    Object.keys(ticketData).forEach(key => {
      if (key === 'attachment' && ticketData[key]) {
        formData.append(key, ticketData[key]);
      } else {
        formData.append(key, ticketData[key]);
      }
    });
    
    return await api.post('/v1/complaints/8c83fc050068019e', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getTickets: async () => {
    return await api.get('/v1/complaints/consumer/8c83fc050068019e');
  },
  
  getTicketDetails: async (ticketId) => {
    return await api.get(`/v1/complaints/consumer/8c83fc050068019e/${ticketId}`);
  },
  
  updateTicket: async (ticketId, updateData) => {
    return await api.put(`/v1/complaints/consumer/status/10?meterSerial=8c83fc050068019e&status=RESOLVED`, updateData);
  }
};

// Notification APIs
export const notificationAPI = {
  getNotifications: async () => {
    return await api.get('/notifications');
  },
  
  markAsRead: async (notificationId) => {
    return await api.put(`/notifications/${notificationId}`);
  },
  
  markAllAsRead: async () => {
    return await api.put('/notifications/read-all');
  }
};

export default api;
