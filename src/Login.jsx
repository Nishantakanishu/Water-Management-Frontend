import { useState } from "react";
import { Navigate } from "react-router-dom";
import { MdEmail, MdLock, MdWaterDrop } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    // Temporary login check
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
    <div className="min-h-screen flex items-center justify-center bg-stone-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center relative z-10 border border-stone-100">
        
        {/* Branding / Logo */}
        <div className="mb-8 flex flex-col items-center">
            <div className="p-3 bg-amber-50 rounded-full mb-3">
                <MdWaterDrop className="text-4xl text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">
            Welcome Back
            </h2>
            <p className="text-stone-500 mt-2 text-sm text-center">
                Smart Meter Consumer Portal
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1 ml-1" htmlFor="email">Email Address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="text-stone-400 text-xl" />
                </div>
                <input
                id="email"
                type="email"
                placeholder="Ex. nishant@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-stone-400 text-stone-800"
                />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-stone-700 mb-1 ml-1" htmlFor="password">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="text-stone-400 text-xl" />
                </div>
                <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-stone-400 text-stone-800"
                />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center border border-red-100">
                {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
             <div className="flex items-center">
                 <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />
                 <label htmlFor="remember-me" className="ml-2 block text-stone-600">Remember me</label>
             </div>
             <a href="#" className="font-medium text-amber-600 hover:text-amber-500">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-amber-600 focus:ring-4 focus:ring-amber-200 transition-all transform active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-stone-100 w-full">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-2">Demo Credentials</p>
          <div className="bg-stone-50 px-4 py-2 rounded-lg inline-block text-stone-600 font-mono text-xs border border-stone-200">
             user: nishant@gmail.com <br/> pass: 12345
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

