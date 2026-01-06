import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  MdDashboard,
  MdPerson,
  MdWaterDrop,
  MdReceiptLong,
  MdReportProblem,
  MdSettings,
  MdLogout
} from 'react-icons/md';

const sidebarIcons = [
  { icon: <MdDashboard size={28} />, label: 'Dashboard' },
  { icon: <MdPerson size={28} />, label: 'Profile' },
  { icon: <MdWaterDrop size={28} />, label: 'Water Usage' },
  { icon: <MdReceiptLong size={28} />, label: 'Bills' },
  { icon: <MdReportProblem size={28} />, label: 'Report' },
  { icon: <MdSettings size={28} />, label: 'Settings' },
  { icon: <MdLogout size={28} />, label: 'Logout' }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Temporary login ke liye
    if (email === "nishant@gmail.com" && password === "12345") {
      setError("");
      setRedirect(true);
      alert("Login Successful");
    } else {
      setError("Invalid email or password");
    }
  };

  if (redirect) {
    return <Navigate to="/portal" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 relative">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-20 flex flex-col items-center transition-all duration-300 ${sidebarOpen ? 'w-20 bg-white shadow-2xl' : 'w-0 overflow-hidden'}`}>
        <button
          className="mt-8 mb-6 bg-yellow-500 text-white rounded-full p-3 shadow-lg hover:bg-yellow-600 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle Sidebar"
        >
          <span className="font-bold text-lg">≡</span>
        </button>
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
      {/* Main Login Card */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center ml-24">
        <h2 className="text-3xl font-bold text-yellow-700 mb-6 drop-shadow-lg tracking-wide">
          Consumer Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg shadow"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg shadow"
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold text-lg shadow hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">Demo credentials:</p>
          <p className="text-gray-700 font-mono text-sm">
            nishant@gmail.com / 12345
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
