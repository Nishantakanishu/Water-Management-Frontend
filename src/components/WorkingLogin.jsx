import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const WorkingLogin = () => {
  const [email, setEmail] = useState("CNS004");
  const [password, setPassword] = useState("9999999789");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log('🔑 Attempting login with:', { email, password: '***' });
      
      const response = await authAPI.login({ email, password });
      console.log('✅ Login response:', response);
      
      if (response.success) {
        setMessage(`✅ Login Successful! Welcome ${response.data.ConsumerName}`);
        
        // Store user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('consumerName', response.data.ConsumerName);
        localStorage.setItem('meterSerialNumber', response.data.MeterSerialNumber);
        localStorage.setItem('mobileNo', response.data.MobileNo);
        localStorage.setItem('address', response.data.address);
        localStorage.setItem('zone', response.data.Zone);
        localStorage.setItem('role', response.data.Role);
        
        console.log('🎯 User data stored:', {
          name: response.data.ConsumerName,
          meter: response.data.MeterSerialNumber,
          mobile: response.data.MobileNo
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/portal');
        }, 2000);
      } else {
        setMessage(`❌ Login Failed: ${response.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      setMessage(`❌ Error: ${error.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-stone-800">Water Portal Login</h2>
            <p className="text-stone-500">Real API Integration</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('✅') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus-amber-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-semibold text-amber-800 mb-2">API Details:</h3>
            <p className="text-sm text-amber-700">Endpoint: http://115.124.119.161:5029/api/v1/auth/consumer/login</p>
            <p className="text-sm text-amber-700">Credentials: CNS004 / 9999999789</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingLogin;
