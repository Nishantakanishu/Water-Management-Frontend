import React, { useState } from 'react'
import {
  MdDashboard,
  MdPerson,
  MdWaterDrop,
  MdReceiptLong,
  MdReportProblem,
  MdSettings,
  MdLogout
} from 'react-icons/md';
import NishantProfilePic from './assets/image/Nishant profile pic.jpeg';
import { useNavigate } from 'react-router-dom';
import { authAPI } from './services/api';

// Import Components
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Billing from './components/Billing';
import Usage from './components/Usage';
import Report from './components/Report';
import APITest from './components/APITest';

// Sidebar Configuration
const sidebarIcons = [
  { id: 'dashboard', icon: <MdDashboard size={24} />, label: 'Dashboard' },
  { id: 'profile', icon: <MdPerson size={24} />, label: 'Profile' },
  { id: 'usage', icon: <MdWaterDrop size={24} />, label: 'Water Usage' },
  { id: 'billing', icon: <MdReceiptLong size={24} />, label: 'Bills & Payments' },
  { id: 'report', icon: <MdReportProblem size={24} />, label: 'Report Issue' },
];

const ConsumerPage = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const consumerName = localStorage.getItem('consumerName') || 'User';
  const customerId = localStorage.getItem('meterSerialNumber') || 'ANN2411';

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // Call logout API (optional, as it will clear localStorage anyway)
      await authAPI.logout();
      
      // Clear all localStorage data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('consumerName');
      localStorage.removeItem('meterSerialNumber');
      localStorage.removeItem('mobileNo');
      localStorage.removeItem('address');
      localStorage.removeItem('zone');
      localStorage.removeItem('role');
      
      console.log('✅ Logged out successfully');
      
      // Redirect to login page
      navigate('/');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if API fails, clear localStorage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('consumerName');
      localStorage.removeItem('meterSerialNumber');
      localStorage.removeItem('mobileNo');
      localStorage.removeItem('address');
      localStorage.removeItem('zone');
      localStorage.removeItem('role');
      navigate('/');
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
        case 'dashboard':
            return <Dashboard />;
        case 'profile':
            return <Profile />;
        case 'usage':
            return <Usage />;
        case 'billing':
            return <Billing />;
        case 'report':
            return <Report />;
        case 'api-test':
            return <APITest />;
        default:
            return <Dashboard />;
    }
  };
  

  return (

    
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-900">
      
      {/* Sidebar Navigation */}
      <aside className={`bg-white transition-all duration-300 ease-in-out flex flex-col fixed inset-y-0 left-0 z-30 shadow-xl border-r border-stone-100
        ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between h-20 px-4 border-b border-stone-100">
            <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && 'justify-center w-full'}`}>
                 <button 
                   onClick={() => setSidebarOpen(!sidebarOpen)}
                   className="bg-amber-500 p-2 rounded-lg flex-shrink-0 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                 >
                    <MdWaterDrop className="text-xl" />
                 </button>
                 <span className={`font-bold text-lg tracking-wide whitespace-nowrap text-stone-800 transition-opacity duration-300 ${!sidebarOpen && 'hidden'}`}>Smart Meter</span>
            </div>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
            {sidebarIcons.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group
                    ${activeTab === item.id ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}
                    ${!sidebarOpen && 'justify-center'}
                  `}>
                    <div className={`${activeTab === item.id ? 'text-amber-600' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</div>
                    <span className={`font-medium text-sm transition-opacity duration-300 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
            <button 
                onClick={handleLogout}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors ${!sidebarOpen && 'justify-center'}`}
            >
                <MdLogout size={24} />
                <span className={`font-medium text-sm transition-opacity duration-300 ${!sidebarOpen && 'hidden'}`}>Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Top Header here*/}
        
        <header className="h-15 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 border-b border-stone-100">
        
            <div className="w-full h-15 bg-white px-8 py-4 shadow-sm">
  <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
    Smart <span className="text-amber-500">Water Meter</span>
  </h1>
</div>


            <div className="flex items-center gap-2 md:gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-stone-800">{consumerName}</p>
                    <p className="text-xs text-stone-500">Consumer ID: {customerId}</p>
                </div>
                <img 
                    src={NishantProfilePic} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-amber-200 object-cover shadow-sm"
                />
            </div>
        </header>

        {/* Dynamic Content idhar rahega*/}
        {renderContent()}

      </main>
    </div>
  )
}

export default ConsumerPage;