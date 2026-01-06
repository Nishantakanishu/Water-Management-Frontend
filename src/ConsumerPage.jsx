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

const sidebarIcons = [
  { icon: <MdDashboard size={28} />, label: 'Dashboard' },
  { icon: <MdPerson size={28} />, label: 'Profile' },
  { icon: <MdWaterDrop size={28} />, label: 'Water Usage' },
  { icon: <MdReceiptLong size={28} />, label: 'Bills' },
  { icon: <MdReportProblem size={28} />, label: 'Report' },
  { icon: <MdSettings size={28} />, label: 'Settings' },
  { icon: <MdLogout size={28} />, label: 'Logout' }
];

const ConsumerPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default

  return (
    <nav className="bg-gradient-to-br from-yellow-300 to-yellow-500 min-h-screen flex items-center justify-center py-8 relative">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-20 flex flex-col items-center transition-all duration-300 ${sidebarOpen ? 'w-20 bg-white shadow-2xl' : 'w-0 overflow-hidden'}`}>
        {sidebarOpen ? (
          <button
            className="mt-8 mb-6 bg-yellow-500 text-white rounded-full p-3 shadow-lg hover:bg-yellow-600 transition"
            onClick={() => setSidebarOpen(false)}
            title="Hide Sidebar"
          >
            <span className="font-bold text-lg">≡</span>
          </button>
        ) : null}
        <div className="flex flex-col gap-6 items-center">
          {sidebarOpen && sidebarIcons.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center group cursor-pointer">
              <div className="text-yellow-600 group-hover:text-yellow-800 transition">
                {item.icon}
              </div>
              <span className="text-xs text-gray-500 mt-1 group-hover:text-yellow-700 transition">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar pop button when closed */}
      {!sidebarOpen && (
        <button
          className="fixed left-2 top-8 z-30 bg-yellow-500 text-white rounded-full p-3 shadow-lg hover:bg-yellow-600 transition"
          onClick={() => setSidebarOpen(true)}
          title="Show Sidebar"
        >
          <span className="font-bold text-lg">≡</span>
        </button>
      )}
      {/* Main Content */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 flex flex-row gap-10 ml-24">
        {/* Left Side: Consumer Info */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-3xl font-bold text-yellow-700 mb-4 tracking-wide drop-shadow-lg">Water Management Consumer Portal</p>
          <p className="text-xl font-semibold bg-yellow-400 rounded-xl py-3 mb-8 shadow text-center">Welcome, RAMKISHORE S/O PATAN DEEN</p>
          
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gray-100 rounded-full p-2 shadow-lg mb-4">
              <img className="rounded-full w-32 h-32 border-4 border-yellow-500 object-cover" src={NishantProfilePic} alt="Nishant profile" />
            </div>
            <p className="text-2xl font-bold text-yellow-800 mb-2">RAMKISHORE S/O PATAN DEEN</p>
            <p className="text-gray-600 text-lg mb-4">Consumer No: <span className="font-semibold">ANN2411</span></p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-yellow-50 rounded-2xl p-6 shadow">
            <p className="font-medium text-yellow-700">Meter No:</p>
            <p className="text-gray-700">6799416</p>
            <p className="font-medium text-yellow-700">Last Login:</p>
            <p className="text-gray-700">--</p>
            <p className="font-medium text-yellow-700">Email Address:</p>
            <p className="text-gray-700">--</p>
            <p className="font-medium text-yellow-700">Address:</p>
            <p className="text-gray-700">0</p>
            <p className="font-medium text-yellow-700">Registration Date:</p>
            <p className="text-gray-700">2025-02-13</p>
          </div>
        </div>
        {/* Right Side: Map */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-300">
            <iframe
              title="Consumer Location Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.2090%2C28.6139%2C77.2190%2C28.6239&layer=mapnik"
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default ConsumerPage;