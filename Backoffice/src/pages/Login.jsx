import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Sparkles, BookOpen, Mic, Award, ArrowRight } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [UserEmail, setUserEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, token, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7106/api/User/login", {
        UserEmail,
        Password,
      });

      if (response.data?.token) {
        const { userID, userName, userEmail, userMobile, userImage, enrollment, token, role, userAccess } = response.data;

        if (userAccess === "inactive" || userAccess?.toLowerCase() === "inactive") {
          setError("Your account has been inactived so contanct to your adminstrator");
          return;
        }

        if (role === "admin") {
          login({ userID, userName, userEmail, userMobile, userImage, enrollment }, token);
          navigate("/admin");
        } else {
          setError("Invalid role. Access denied. Backoffice is for admins only.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email Or Password.");
    }
  };

  useEffect(() => {
    if (token) {
      if (user && user.role === 'admin') {
        navigate("/admin");
      }
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="ambient-glow-1 -top-20 -left-20 animate-pulse" />
      <div className="ambient-glow-2 -bottom-20 -right-20 animate-pulse" />

      {/* Main Glass Panel */}
      <div className="w-full max-w-4xl cyan-panel-3d overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px] relative z-10">
        
        {/* Left Side: 3D Visual Branding Section */}
        <div className="lg:col-span-6 py-5 px-8 lg:py-6 lg:px-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 bg-transparent">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Backoffice Administration</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Manage the <br />
              <span className="text-gradient-cyan">LSRW Platform</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Access the administrative dashboard to manage users, content, exams, and platform settings.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-4 border-t border-white/10">
            <span>© {new Date().getFullYear()} LSRW Engine</span>
            <span className="text-sky-400 font-medium">Backoffice</span>
          </div>
        </div>

        {/* Right Side: Glass Login Form */}
        <div className="lg:col-span-6 py-5 px-8 lg:py-6 lg:px-12 flex flex-col justify-center bg-transparent">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30 border border-white/20">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">Admin Portal</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in with your administrator account</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center shadow-inner font-medium">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="UserEmail" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  id="UserEmail"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 input-3d text-sm placeholder-slate-500"
                  value={UserEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="Password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  id="Password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 input-3d text-sm placeholder-slate-500"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 btn-3d-cyan flex items-center justify-center space-x-2 text-base font-semibold shadow-lg group"
                >
                  <span>Admin Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
