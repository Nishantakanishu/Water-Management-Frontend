import React from 'react';
import { MdLocationOn, MdEdit } from 'react-icons/md';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import NishantProfilePic from '../assets/image/Nishant profile pic.jpeg';

const Dashboard = () => {
    // Water usage data per month
    const waterUsageData = [
        { month: 'Jan', usage: 4200, target: 4000 },
        { month: 'Feb', usage: 3800, target: 4000 },
        { month: 'Mar', usage: 4500, target: 4000 },
        { month: 'Apr', usage: 5200, target: 4000 },
        { month: 'May', usage: 5800, target: 4000 },
        { month: 'Jun', usage: 6100, target: 4000 },
        { month: 'Jul', usage: 5900, target: 4000 },
        { month: 'Aug', usage: 5400, target: 4000 },
        { month: 'Sep', usage: 4900, target: 4000 },
        { month: 'Oct', usage: 4300, target: 4000 },
        { month: 'Nov', usage: 3900, target: 4000 },
        { month: 'Dec', usage: 4100, target: 4000 }
    ];

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-stone-200">
                    <p className="text-sm font-semibold text-stone-800">{payload[0].payload.month}</p>
                    <p className="text-sm text-amber-600 font-bold">{payload[0].value.toLocaleString()} L</p>
                    {payload[1] && (
                        <p className="text-xs text-stone-500">Target: {payload[1].value.toLocaleString()} L</p>
                    )}
                </div>
            );
        }
        return null;
    };
    return (
        
        
        <div className="p-2 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
                <h5 className="font-bold text-stone-800">Dashboard Overview</h5>
                {/* <p className="text-sm md:text-base text-stone-500">Welcome back, here's what's happening with your meter today.</p> */}
            </div>
            

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Left Column: Profile & Details */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3 md:p-6 text-white shadow-xl shadow-orange-100 relative overflow-hidden">
                         <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <img className="w-10 h-10 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 object-cover shadow-md" src={NishantProfilePic} alt="Profile" />
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl md:text-2xl font-bold mb-1 text-white">Ramkishore S/O Patan Deen</h2>
                                <p className="text-amber-100 opacity-90 font-medium text-sm md:text-base">High Consumer Category • Active</p>
                                <div className="mt-4 flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm border border-white/10">Meter #6799416</span>
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
                                    <Tooltip content={<CustomTooltip />} />
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

    <Tooltip content={<CustomTooltip />} />

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

                            
                            {/* Stats Summary */}
                            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
                                <div className="text-center">
                                    <p className="text-xs text-stone-500 mb-1">Avg Monthly</p>
                                    <p className="text-lg font-bold text-stone-800">4,925L</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-stone-500 mb-1">Peak Month</p>
                                    <p className="text-lg font-bold text-blue-400">Jun (6,100L)</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-stone-500 mb-1">This Month</p>
                                    <p className="text-lg font-bold text-emerald-600">4,100L</p>
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
        </div>
    );
};

export default Dashboard;
