import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdEdit } from 'react-icons/md';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import NishantProfilePic from '../assets/image/Nishant profile pic.jpeg';
import { dashboardAPI, usageAPI } from '../services/api';

// Get user data from localStorage
const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const consumerName = localStorage.getItem('consumerName') || 'User';
    const meterSerialNumber = localStorage.getItem('meterSerialNumber') || 'Unknown';
    return { userData, consumerName, meterSerialNumber };
};

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [overview, setOverview] = useState(null);
    const [waterUsageData, setWaterUsageData] = useState([]); // Start with empty array
    const [waterQuality, setWaterQuality] = useState([]); // Start with empty array
    const [meterLocation, setMeterLocation] = useState(null); // Start with null
    
    // Get user data from localStorage
    const { consumerName, meterSerialNumber } = getUserData();

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch consumer summary data first
                const summaryData = await dashboardAPI.getOverview();
                console.log('📊 Consumer Summary API Response:', summaryData);
                
                if (summaryData && summaryData.data) {
                    // Use real backend data
                    const realSummaryData = {
                        totalConsumption: summaryData.data.totalConsumption || 0,
                        todayConsumption: summaryData.data.todayConsumption || 0,
                        lastMonthConsumption: summaryData.data.lastMonthConsumption || 0,
                        totalMeterReading: summaryData.data.totalMeterReading || 0,
                        predictedConsumption: summaryData.data.predictedConsumption || 0
                    };
                    setOverview(realSummaryData);
                    console.log('✅ Consumer Summary loaded:', realSummaryData);
                } else {
                    console.warn('No summary data found');
                    // Set empty state when no data
                    setOverview(null);
                }

                // Fetch water usage data
                try {
                    const usageData = await usageAPI.getUsageData('monthly');
                    console.log('💧 Usage API Response:', usageData);
                    
                    if (usageData) {
                        let monthlyData = [];
                        if (Array.isArray(usageData)) {
                            monthlyData = usageData.map(item => ({
                                month: item.month || 'Unknown',
                                usage: item.consumption || 0,
                                target: 300 // example target line value
                            }));
                        } else {
                            // Backend returning Object map ({"February": 35})
                            monthlyData = Object.entries(usageData)
                                .filter(([key]) => key !== 'Unknown')
                                .map(([month, usage]) => ({
                                    month: month,
                                    usage: usage || 0,
                                    target: 300 // dummy target since api doesn't return one
                                }));
                        }
                        console.log('✅ Usage data loaded (Dashboard):', monthlyData);
                        setWaterUsageData(monthlyData);
                    } else {
                        console.warn('No usage data found directly');
                        setWaterUsageData([]);
                    }
                } catch (usageErr) {
                    console.warn('Usage data fetch failed:', usageErr);
                    setWaterUsageData([]);
                }

                // Fetch water quality data
                try {
                    const qualityData = await dashboardAPI.getWaterQuality();
                    console.log('🔬 Water Quality API Response:', qualityData);
                    
                    // Handle various data structures
                    let rawQualityData = [];
                    if (qualityData && qualityData.data) {
                        rawQualityData = Array.isArray(qualityData.data) ? qualityData.data : Object.values(qualityData.data);
                    } else if (Array.isArray(qualityData)) {
                        rawQualityData = qualityData;
                    }
                    
                    if (rawQualityData.length > 0) {
                        // Transform real data for display
                        const transformedQualityData = rawQualityData.map(item => ({
                            parameter: item.parameter || item.name || 'Unknown',
                            value: item.value || 0,
                            status: item.status || 'Good',
                            unit: item.unit || ''
                        }));
                        setWaterQuality(transformedQualityData);
                        console.log('✅ Water quality loaded:', transformedQualityData);
                    } else {
                        console.warn('No water quality data found directly');
                        setWaterQuality([]);
                    }
                } catch (qualityErr) {
                    console.warn('Water quality fetch failed:', qualityErr);
                    setWaterQuality([]);
                }

                // Fetch meter location data
                try {
                    const locationData = await dashboardAPI.getMeterLocation();
                    console.log('📍 Meter Location API Response:', locationData);
                    if (locationData) {
                        setMeterLocation(locationData);
                        console.log('✅ Meter location loaded:', locationData);
                    } else {
                        console.warn('No location data found');
                        setMeterLocation(null);
                    }
                } catch (locationErr) {
                    console.warn('Location data fetch failed:', locationErr);
                    setMeterLocation(null);
                }

            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Empty dependency array - only run once
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-96">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                        <p className="text-stone-500">Loading dashboard data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-red-800 font-semibold">Error loading dashboard</h3>
                            <p className="text-red-600 text-sm">{error}</p>
                            <p className="text-red-500 text-xs mt-1">Showing demo data instead</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Content */}
            {!loading && (
                <>
                    <div className="mb-6 md:mb-8">
                        <h5 className="font-bold text-stone-800">Dashboard Overview</h5>
                    </div>
            

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Left Column: Profile & Details */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3 md:p-6 text-white shadow-xl shadow-orange-100 relative overflow-hidden">
                         <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <img className="w-10 h-10 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 object-cover shadow-md" src={NishantProfilePic} alt="Profile" />
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl md:text-2xl font-bold mb-1 text-white">{consumerName}</h2>
                                <p className="text-amber-100 opacity-90 font-medium text-sm md:text-base">CONSUMER • Active</p>
                                <div className="mt-4 flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm border border-white/10">Meter #{meterSerialNumber}</span>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm border border-white/10">Smart Meter Enabled</span>
                                </div>
                            </div>
                         </div>
                         {/* Abstract Shape */}
                         <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12 blend-overlay"></div>
                    </div>

                    {/* Water Usage Graph */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="px-4 md:px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-blue-50/30">
                            <h3 className="font-bold text-stone-800 text-lg">Water Usage per Month</h3>
                            <p className="text-xs text-stone-500 mt-1">Monthly consumption trends in liters</p>
                        </div>
                        <div className="p-4 md:p-6">
                            {/* <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={waterUsageData}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                        </linearGradient>
                                        
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ fill: '#78716c', fontSize: 12 }}
                                        tickLine={{ stroke: '#d6d3d1' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#78716c', fontSize: 12 }}
                                        tickLine={{ stroke: '#d6d3d1' }}
                                        tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                                    />
                                    <Tooltip />
                                    <Legend 
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        iconType="circle"
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="usage" 
                                        stroke="#f59e0b" 
                                        strokeWidth={3}
                                        fill="url(#colorUsage)" 
                                        name="Usage (L)"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="target" 
                                        stroke="#78716c" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="Target (L)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer> */}

                            <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={waterUsageData}>
    <defs>
      <linearGradient id="colorUsageBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />

    <XAxis
      dataKey="month"
      tick={{ fill: "#1e40af", fontSize: 12 }}
      tickLine={{ stroke: "#93c5fd" }}
    />

    <YAxis
      tick={{ fill: "#1e40af", fontSize: 12 }}
      tickLine={{ stroke: "#93c5fd" }}
      tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
    />

    <Tooltip />

    <Legend
      wrapperStyle={{ paddingTop: "20px" }}
      iconType="circle"
    />

    <Area
      type="monotone"
      dataKey="usage"
      stroke="#3b82f6"
      strokeWidth={3}
      fill="url(#colorUsageBlue)"
      name="Usage (L)"
    />

    <Line
      type="monotone"
      dataKey="target"
      stroke="#1e40af"
      strokeWidth={2}
      strokeDasharray="5 5"
      dot={false}
      name="Target (L)"
    />
  </AreaChart>
</ResponsiveContainer>

                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-stone-500 mb-1">Total Consumption</p>
                                            <p className="text-2xl font-bold text-stone-800">
                                                {overview ? (overview.totalConsumption / 1000).toFixed(1) + 'kL' : '0L'}
                                            </p>
                                        </div>
                                        <div className="text-blue-500">
                                            <MdLocationOn size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-stone-500 mb-1">Today's Consumption</p>
                                            <p className="text-2xl font-bold text-stone-800">
                                                {overview ? (overview.todayConsumption / 1000).toFixed(1) + 'kL' : '0L'}
                                            </p>
                                        </div>
                                        <div className="text-green-500">
                                            <MdLocationOn size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-stone-500 mb-1">Meter Reading</p>
                                            <p className="text-2xl font-bold text-stone-800">
                                                {overview ? overview.totalMeterReading.toLocaleString() : '0'}
                                            </p>
                                        </div>
                                        <div className="text-purple-500">
                                            <MdLocationOn size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-stone-500 mb-1">Predicted Consumption</p>
                                            <p className="text-2xl font-bold text-stone-800">
                                                {overview ? (overview.predictedConsumption / 1000).toFixed(1) + 'kL' : '0L'}
                                            </p>
                                        </div>
                                        <div className="text-orange-500">
                                            <MdLocationOn size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
                                <div className="text-center">
                                    <p className="text-xs text-stone-500 mb-1">Avg Monthly</p>
                                    <p className="text-lg font-bold text-stone-800">
                                        {overview ? (overview.lastMonthConsumption / 1000).toFixed(1) + 'kL' : '0L'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-stone-500 mb-1">Peak Month</p>
                                    <p className="text-lg font-bold text-blue-400">
                                        {waterUsageData && waterUsageData.length > 0 ? 
                                            Math.max(...waterUsageData.map(d => d.usage)).toLocaleString() + 'L' : 
                                            '0L'
                                        }
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-stone-500 mb-1">This Month</p>
                                    <p className="text-lg font-bold text-emerald-600">
                                        {waterUsageData && waterUsageData.length > 0 ? 
                                            waterUsageData[waterUsageData.length - 1]?.usage?.toLocaleString() + 'L' : 
                                            '0L'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    {/* <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h3 className="font-bold text-stone-800">Account Details</h3>
                            <button className="text-amber-600 text-sm font-semibold hover:underline flex items-center gap-1">
                                <MdEdit /> Edit Profile
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-1">Email Address</p>
                                <p className="text-stone-700 font-medium">nishant@gmail.com</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-1">Mobile Number</p>
                                <p className="text-stone-700 font-medium">+91 98765 43210</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-1">Registered Address</p>
                                <p className="text-stone-700 font-medium">123, Block A, Green Park, New Delhi</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-1">Registration Date</p>
                                <p className="text-stone-700 font-medium">Feb 13, 2025</p>
                            </div>

                        </div>
                    </div> */}
                </div>

                {/* Right Column: Map & Quick Actions */}
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* Location Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                         <div className="px-4 md:px-6 py-4 border-b border-stone-100 flex items-center gap-2 bg-stone-50/50">
                            <MdLocationOn className="text-red-500" />
                            <h3 className="font-bold text-stone-800">Meter Location</h3>
                        </div>
                        <div className="h-[180px] sm:h-[200px] relative">
                             <iframe
                                title="Consumer Location Map"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=77.2090%2C28.6139%2C77.2190%2C28.6239&layer=mapnik"
                                className="w-full h-full border-0 absolute inset-0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* Water Quality Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="px-4 md:px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-cyan-50/30">
                            <h3 className="font-bold text-stone-800 text-base">Water Quality</h3>
                            <p className="text-xs text-stone-500 mt-1">Current metrics</p>
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={150}>
                                <AreaChart data={[
                                    { name: 'pH', value: 7.2, safe: 7.5 },
                                    { name: 'TDS', value: 180, safe: 200 },
                                    { name: 'Turbidity', value: 0.8, safe: 1.0 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: '#78716c', fontSize: 11 }}
                                        tickLine={{ stroke: '#d6d3d1' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#78716c', fontSize: 11 }}
                                        tickLine={{ stroke: '#d6d3d1' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#06b6d4" 
                                        strokeWidth={2}
                                        fill="url(#colorQuality)" 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="safe" 
                                        stroke="#10b981" 
                                        strokeWidth={1}
                                        strokeDasharray="3 3"
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                            
                            {/* Quality Indicators */}
                            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100">
                                <div className="text-center">
                                    <p className="text-[10px] text-stone-500 mb-0.5">pH Level</p>
                                    <p className="text-sm font-bold text-cyan-600">7.2</p>
                                    <span className="text-[9px] text-emerald-600">● Good</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-stone-500 mb-0.5">TDS (ppm)</p>
                                    <p className="text-sm font-bold text-cyan-600">180</p>
                                    <span className="text-[9px] text-emerald-600">● Good</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-stone-500 mb-0.5">Turbidity</p>
                                    <p className="text-sm font-bold text-cyan-600">0.8 NTU</p>
                                    <span className="text-[9px] text-emerald-600">● Good</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
