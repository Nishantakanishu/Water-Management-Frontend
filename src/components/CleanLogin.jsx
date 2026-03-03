import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CleanLogin = () => {
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
      // Direct fetch to bypass all interceptors and CORS issues
      const response = await fetch('http://115.124.119.161:5029/api/v1/auth/consumer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('🔑 Login response:', data);
      
      if (data.success) {
        setMessage(`✅ Success! Welcome ${data.data.ConsumerName}`);
        
        // Store all user data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.setItem('consumerName', data.data.ConsumerName);
        localStorage.setItem('meterSerialNumber', data.data.MeterSerialNumber);
        localStorage.setItem('mobileNo', data.data.MobileNo);
        localStorage.setItem('address', data.data.address);
        localStorage.setItem('zone', data.data.Zone);
        localStorage.setItem('role', data.data.Role);
        
        console.log('🎯 User stored:', data.data.ConsumerName);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/portal');
        }, 2000);
      } else {
        setMessage(`❌ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('🚨 Error:', error);
      setMessage(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Clean Login Test</h2>
        
        {message && (
          <div className={`p-3 rounded mb-4 text-sm ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <p><strong>API:</strong> http://115.124.119.161:5029/api/v1/auth/consumer/login</p>
          <p><strong>Credentials:</strong> CNS004 / 9999999789</p>
        </div>
      </div>
    </div>
  );
};

export default CleanLogin;
