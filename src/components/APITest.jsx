import React, { useState } from 'react';

const APITest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Test with different methods to bypass CORS
      const response = await fetch('http://115.124.119.161:5029/api/v1/auth/consumer/login', {
        method: 'POST',
        mode: 'cors', // Important for CORS
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: "CNS004",
          password: "9999999789"
        })
      });

      const data = await response.json();
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        success: data.success,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

    } catch (error) {
      setTestResult({
        error: error.message,
        status: 'FAILED'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
        
        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Direct API Connection'}
        </button>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Test Result:</h3>
            <pre className="text-sm bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default APITest;
