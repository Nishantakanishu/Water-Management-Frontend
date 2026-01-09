import React, { useState } from 'react';
import { MdWaterDrop, MdTrendingUp, MdTrendingDown, MdCalendarToday, MdShowChart } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Usage = () => {
    const [viewMode, setViewMode] = useState('monthly'); // daily, weekly, monthly

    // Demo data for water usage (in liters)
    const monthlyData = [
        { month: 'Jan', usage: 4200, cost: 420 },
        { month: 'Feb', usage: 3800, cost: 380 },
        { month: 'Mar', usage: 4500, cost: 450 },
        { month: 'Apr', usage: 5100, cost: 510 },
        { month: 'May', usage: 5800, cost: 580 },
        { month: 'Jun', usage: 6200, cost: 620 },
        { month: 'Jul', usage: 5900, cost: 590 },
        { month: 'Aug', usage: 5400, cost: 540 },
        { month: 'Sep', usage: 4900, cost: 490 },
        { month: 'Oct', usage: 4600, cost: 460 },
        { month: 'Nov', usage: 4300, cost: 430 },
        { month: 'Dec', usage: 4500, cost: 450 },
    ];

    const weeklyData = [
        { week: 'Week 1', usage: 1200, cost: 120 },
        { week: 'Week 2', usage: 1100, cost: 110 },
        { week: 'Week 3', usage: 1400, cost: 140 },
        { week: 'Week 4', usage: 1500, cost: 150 },
    ];

    const dailyData = [
        { day: 'Mon', usage: 180, cost: 18 },
        { day: 'Tue', usage: 165, cost: 16.5 },
        { day: 'Wed', usage: 200, cost: 20 },
        { day: 'Thu', usage: 190, cost: 19 },
        { day: 'Fri', usage: 175, cost: 17.5 },
        { day: 'Sat', usage: 220, cost: 22 },
        { day: 'Sun', usage: 210, cost: 21 },
    ];

    const getCurrentData = () => {
        switch (viewMode) {
            case 'daily':
                return dailyData;
            case 'weekly':
                return weeklyData;
            case 'monthly':
            default:
                return monthlyData;
        }
    };

    const data = getCurrentData();
    const maxUsage = Math.max(...data.map(d => d.usage));
    const avgUsage = (data.reduce((sum, d) => sum + d.usage, 0) / data.length).toFixed(0);
    const totalUsage = data.reduce((sum, d) => sum + d.usage, 0);
    const totalCost = data.reduce((sum, d) => sum + d.cost, 0).toFixed(2);

    // Calculate trend (comparing last two data points)
    const trend = data.length >= 2 ? 
        ((data[data.length - 1].usage - data[data.length - 2].usage) / data[data.length - 2].usage * 100).toFixed(1) 
        : 0;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-stone-800">Water Usage Analytics</h1>
                <p className="text-sm md:text-base text-stone-500">Track your water consumption and identify patterns.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-100 text-xs md:text-sm font-medium">Total Usage</p>
                        <MdWaterDrop className="text-2xl md:text-3xl text-blue-200 opacity-60" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">{totalUsage.toLocaleString()}</h3>
                    <p className="text-blue-100 text-xs">Liters this {viewMode === 'daily' ? 'week' : viewMode === 'weekly' ? 'month' : 'year'}</p>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-stone-500 text-xs md:text-sm font-medium">Average Daily</p>
                        <MdShowChart className="text-xl md:text-2xl text-stone-300" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">{avgUsage}</h3>
                    <p className="text-stone-400 text-xs">Liters per day</p>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-stone-500 text-xs md:text-sm font-medium">Total Cost</p>
                        <span className="text-xl md:text-2xl text-stone-300">₹</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">₹{totalCost}</h3>
                    <p className="text-stone-400 text-xs">This {viewMode === 'daily' ? 'week' : viewMode === 'weekly' ? 'month' : 'year'}</p>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-stone-500 text-xs md:text-sm font-medium">Trend</p>
                        {parseFloat(trend) >= 0 ? (
                            <MdTrendingUp className="text-xl md:text-2xl text-red-500" />
                        ) : (
                            <MdTrendingDown className="text-xl md:text-2xl text-green-500" />
                        )}
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-1 ${parseFloat(trend) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {parseFloat(trend) >= 0 ? '+' : ''}{trend}%
                    </h3>
                    <p className="text-stone-400 text-xs">vs previous period</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-stone-100 p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
                    <div>
                        <h3 className="font-bold text-base md:text-lg text-stone-800 mb-1">Consumption Overview</h3>
                        <p className="text-xs md:text-sm text-stone-500">Visual breakdown of your water usage</p>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex gap-1 md:gap-2 bg-stone-100 p-1 rounded-lg mt-4 md:mt-0">
                        <button
                            onClick={() => setViewMode('daily')}
                            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all ${
                                viewMode === 'daily'
                                    ? 'bg-white text-stone-800 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setViewMode('weekly')}
                            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all ${
                                viewMode === 'weekly'
                                    ? 'bg-white text-stone-800 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setViewMode('monthly')}
                            className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all ${
                                viewMode === 'monthly'
                                    ? 'bg-white text-stone-800 shadow-sm'
                                    : 'text-stone-500 hover:text-stone-700'
                            }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="mt-4">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                            <XAxis 
                                dataKey={viewMode === 'daily' ? 'day' : viewMode === 'weekly' ? 'week' : 'month'}
                                tick={{ fill: '#78716c', fontSize: 12 }}
                                tickLine={{ stroke: '#d6d3d1' }}
                            />
                            <YAxis 
                                tick={{ fill: '#78716c', fontSize: 12 }}
                                tickLine={{ stroke: '#d6d3d1' }}
                                label={{ value: 'Usage (L)', angle: -90, position: 'insideLeft', fill: '#78716c' }}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e7e5e4',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                                formatter={(value, name) => {
                                    if (name === 'usage') return [`${value.toLocaleString()} L`, 'Usage'];
                                    if (name === 'cost') return [`₹${value}`, 'Cost'];
                                    return value;
                                }}
                            />
                            <Legend 
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />
                            <Bar 
                                dataKey="usage" 
                                fill="url(#barGradient)" 
                                radius={[8, 8, 0, 0]}
                                name="Usage (L)"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-amber-500 p-2 rounded-lg">
                            <MdCalendarToday className="text-white text-xl" />
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-800 mb-1">Peak Usage Period</h4>
                            <p className="text-sm text-stone-600 mb-2">
                                Your highest consumption was in{' '}
                                <span className="font-bold text-amber-700">
                                    {data.reduce((max, item) => item.usage > max.usage ? item : max).month || 
                                     data.reduce((max, item) => item.usage > max.usage ? item : max).week ||
                                     data.reduce((max, item) => item.usage > max.usage ? item : max).day}
                                </span>
                            </p>
                            <p className="text-xs text-stone-500">
                                Consider checking for leaks or unusual activities during high usage periods.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="bg-green-500 p-2 rounded-lg">
                            <MdWaterDrop className="text-white text-xl" />
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-800 mb-1">Conservation Tip</h4>
                            <p className="text-sm text-stone-600 mb-2">
                                You could save up to <span className="font-bold text-green-700">15-20%</span> on your water bill
                            </p>
                            <p className="text-xs text-stone-500">
                                Fix dripping taps, use water-efficient appliances, and take shorter showers to reduce consumption.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Usage;
