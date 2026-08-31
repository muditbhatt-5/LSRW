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
  const { login, token } = useAuth();

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

        if (role === "admin") {
          login({ userID, userName, userEmail, userMobile, userImage, enrollment }, token);
          navigate("/admin");
        } else if (role === "user") {
          if (userAccess === "active") {
            login({ userID, userName, userEmail, userMobile, userImage, enrollment }, token);
            navigate("/dashboard");
          } else {
            setError("User is not active. Please contact admin.");
          }
        } else {
          setError("Invalid role. Access denied.");
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
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="ambient-glow-1 -top-20 -left-20 animate-pulse" />
      <div className="ambient-glow-2 -bottom-20 -right-20 animate-pulse" />

      {/* Main Glass Panel */}
      <div className="w-full max-w-4xl cyan-panel-3d overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px] relative z-10">
        
        {/* Left Side: 3D Visual Branding Section */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 bg-transparent">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Next-Gen LSRW Platform</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Elevate Your <br />
              <span className="text-gradient-cyan">Language Skills</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Experience an immersive, AI-assisted platform designed to refine Listening, Speaking, Reading, and Writing with real-time feedback.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-center hover:border-white/25 hover:bg-white/[0.06] transition-all">
              <BookOpen className="w-6 h-6 text-sky-400 mx-auto mb-1" />
              <span className="text-xs font-medium text-slate-200">Read</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-center hover:border-white/25 hover:bg-white/[0.06] transition-all">
              <Mic className="w-6 h-6 text-sky-400 mx-auto mb-1" />
              <span className="text-xs font-medium text-slate-200">Listen</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-center hover:border-white/25 hover:bg-white/[0.06] transition-all">
              <Award className="w-6 h-6 text-sky-400 mx-auto mb-1" />
              <span className="text-xs font-medium text-slate-200">Assess</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between pt-4 border-t border-white/10">
            <span>© {new Date().getFullYear()} LSRW Engine</span>
            <span className="text-sky-400 font-medium">3D Glass UI</span>
          </div>
        </div>

        {/* Right Side: Glass Login Form */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-transparent">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30 border border-white/20">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to continue your learning journey</p>
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
                  placeholder="name@example.com"
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
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center space-x-1"
              >
                <span>Don't have an account?</span>
                <span className="underline decoration-sky-400/50 underline-offset-4 font-semibold">Sign up now</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
