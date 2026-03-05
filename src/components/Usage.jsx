import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MdTrendingUp, MdTrendingDown, MdDateRange, MdBarChart, MdInfo } from 'react-icons/md';
import { usageAPI, dashboardAPI } from '../services/api';

const Usage = () => {
    const [viewMode, setViewMode] = useState('daily');
    const [usageData, setUsageData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userSummary, setUserSummary] = useState(null);

    useEffect(() => {
        const fetchUsageData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch user summary data
                try {
                    const summaryResponse = await dashboardAPI.getOverview();
                    console.log('📊 Consumer Summary API Response:', summaryResponse);
                    if (summaryResponse && summaryResponse.data) {
                        const data = summaryResponse.data;
                        setUserSummary({
                            totalConsumption: data.totalConsumption || 0,
                            todayConsumption: data.todayConsumption || 0,
                            lastMonthConsumption: data.lastMonthConsumption || 0,
                            totalMeterReading: data.totalMeterReading || 0,
                            predictedConsumption: data.predictedConsumption || 0,
                        });
                    } else {
                        setUserSummary(null);
                    }
                } catch (summaryErr) {
                    console.warn('User Summary API failed:', summaryErr);
                    setUserSummary(null);
                }

                // Fetch usage data for the selected period
                try {
                    const dataResponse = await usageAPI.getUsageData(viewMode);
                    console.log(`📊 ${viewMode.toUpperCase()} Usage API Response:`, dataResponse);
                    // The API may return data directly as an object or wrapped in a 'data' field.
                    const usagePayload = dataResponse && dataResponse.data ? dataResponse.data : dataResponse;
                    if (usagePayload) {
                        if (viewMode === 'daily') {
                            let dailyData = [];
                            if (Array.isArray(usagePayload)) {
                                dailyData = usagePayload.map(item => ({
                                    day: item.day || 'Unknown',
                                    usage: item.consumption || 0,
                                    cost: ((item.consumption || 0) * 0.1).toFixed(2)
                                }));
                            } else if (typeof usagePayload === 'object') {
                                const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                dailyData = dayOrder.map(day => ({
                                    day: day,
                                    usage: usagePayload[day] || 0,
                                    cost: ((usagePayload[day] || 0) * 0.1).toFixed(2)
                                }));
                            }
                            setUsageData(dailyData);
                        } else if (viewMode === 'weekly') {
                            let weeklyData = [];
                            if (Array.isArray(usagePayload)) {
                                weeklyData = usagePayload.map(item => ({
                                    week: item.week || 'Unknown',
                                    usage: item.consumption || 0,
                                    cost: ((item.consumption || 0) * 0.1).toFixed(2)
                                }));
                            } else if (typeof usagePayload === 'object') {
                                weeklyData = Object.entries(usagePayload).map(([week, usage]) => ({
                                    week: week,
                                    usage: usage || 0,
                                    cost: ((usage || 0) * 0.1).toFixed(2)
                                }));
                            }
                            setUsageData(weeklyData);
                        } else if (viewMode === 'monthly') {
                            let monthlyData = [];
                            if (Array.isArray(usagePayload)) {
                                monthlyData = usagePayload.map(item => ({
                                    month: item.month || 'Unknown',
                                    usage: item.consumption || 0,
                                    cost: ((item.consumption || 0) * 0.1).toFixed(2)
                                }));
                            } else if (typeof usagePayload === 'object') {
                                monthlyData = Object.entries(usagePayload).map(([month, usage]) => ({
                                    month: month,
                                    usage: usage || 0,
                                    cost: ((usage || 0) * 0.1).toFixed(2)
                                }));
                            }
                            setUsageData(monthlyData);
                        } else {
                            setUsageData([]);
                        }
                    } else {
                        setUsageData([]);
                    }
                } catch (err) {
                    console.error('Usage data fetch error:', err);
                    setError(err.message || 'Failed to load usage data');
                } finally {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Usage data fetch error:', err);
                setError(err.message || 'Failed to load usage data');
                setLoading(false);
            }
        };

        fetchUsageData();
    }, [viewMode]);

    const getTrend = () => {
        if (usageData.length < 2) return null;
        const last = usageData[usageData.length - 1].usage;
        const previous = usageData[usageData.length - 2].usage;
        return last > previous ? 'up' : last < previous ? 'down' : 'stable';
    };

    const trend = getTrend();

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* User Summary Cards */}
            {userSummary && (
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <div className="px-4 md:px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-blue-50 to-amber-50/30">
                            <h3 className="font-bold text-stone-800 text-lg">Consumption Summary</h3>
                            <p className="text-xs text-stone-500 mt-1">Real-time water usage metrics</p>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white text-sm">💧</span>
                                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Total</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-900 mt-1">
                                        {userSummary.totalConsumption} <span className="text-xs font-normal text-blue-700">L</span>
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white text-sm">📅</span>
                                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Today</p>
                                    </div>
                                    <p className="text-lg font-bold text-green-900 mt-1">
                                        {userSummary.todayConsumption} <span className="text-xs font-normal text-green-700">L</span>
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white text-sm">📊</span>
                                        <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider">Last Month</p>
                                    </div>
                                    <p className="text-lg font-bold text-purple-900 mt-1">
                                        {userSummary.lastMonthConsumption} <span className="text-xs font-normal text-purple-700">L</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Mode Selector */}
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-2">
                    <div className="flex flex-wrap gap-2">
                        {['daily', 'weekly', 'monthly'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                    viewMode === mode
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-stone-600">Loading usage data...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                        <MdInfo className="text-red-500 mr-2" size={20} />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            {/* Usage Chart */}
            {!loading && !error && usageData.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-stone-800">
                                Water Usage - {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                            </h3>
                            <p className="text-sm text-stone-500 mt-1">
                                {trend === 'up' && (
                                    <span className="flex items-center text-green-600">
                                        <MdTrendingUp className="mr-1" /> Usage is increasing
                                    </span>
                                )}
                                {trend === 'down' && (
                                    <span className="flex items-center text-red-600">
                                        <MdTrendingDown className="mr-1" /> Usage is decreasing
                                    </span>
                                )}
                                {trend === 'stable' && (
                                    <span className="flex items-center text-stone-600">
                                        Usage is stable
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-stone-600">Usage (L)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-stone-600">Cost (₹)</span>
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={usageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey={viewMode === 'daily' ? 'day' : viewMode === 'weekly' ? 'week' : 'month'} />
                            <YAxis />
                            <Tooltip 
                                formatter={(value, name) => {
                                    if (name === 'usage') return [`${value} Liters`, 'Usage'];
                                    if (name === 'cost') return [`₹${value}`, 'Cost'];
                                    return [value, name];
                                }}
                            />
                            <Legend />
                            <Bar dataKey="usage" fill="#3b82f6" />
                            <Bar dataKey="cost" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && usageData.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8">
                    <div className="text-center py-12">
                        <MdBarChart className="mx-auto text-stone-300 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-stone-600 mb-2">No usage data available</h3>
                        <p className="text-sm text-stone-500">
                            There is no usage data for the selected {viewMode} period.
                        </p>
                    </div>
                </div>
            )}

            {/* Data Source Indicator */}
            <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                <span>
                    {loading ? '🔄 Loading...' : (
                        usageData.length > 0 ? '🟢 Real Backend Data' : '🔴 No Backend Data Available'
                    )}
                </span>
                <span>Total Periods: {usageData.length}</span>
            </div>
        </div>
    );
};

export default Usage;
