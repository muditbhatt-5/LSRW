import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Book, Mic, PenTool, LogOut, Github, Mail, User, Sparkles, 
  ChevronRight, X, LayoutDashboard, Settings, Bell, Search,
  Award, Clock, CheckCircle2, ShieldCheck, Activity, Menu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./DashboardDesign.css";
import jellyfishBg from "./jellyfish_dashboard_bg.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const features = [
    {
      title: "Paragraph Reader",
      description: "Read and listen to structured paragraphs to enhance pronunciation & fluency.",
      icon: Book,
      path: "/paragraph-reader",
      badge: "Reading & Listening",
      glowColor: "rgba(56, 189, 248, 0.3)",
      gradient: "from-sky-500 to-cyan-400",
    },
    {
      title: "Paragraph Listener",
      description: "Practice speech output with AI evaluation and real-time accuracy scoring.",
      icon: Mic,
      path: "/paragraph-listener",
      badge: "Speaking & Feedback",
      glowColor: "rgba(129, 140, 248, 0.3)",
      gradient: "from-indigo-500 to-purple-400",
    },
    {
      title: "Take Exam",
      description: "Evaluate your comprehensive knowledge with MCQs and downloadable result card.",
      icon: PenTool,
      path: "/exam",
      badge: "Assessment",
      glowColor: "rgba(6, 182, 212, 0.3)",
      gradient: "from-cyan-500 to-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex overflow-hidden font-sans bg-transparent">
      {/* 1. SIDEBAR (VISION UI STYLE) */}
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 p-5 flex flex-col justify-between z-50 transition-transform duration-300
        md:translate-x-0 md:relative md:flex shrink-0
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        bg-[#060b18]/80 backdrop-blur-2xl border-r border-white/5
      `}>
        <div className="space-y-8">
          {/* Logo / Branding */}
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30 border border-white/15">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-black tracking-wider text-white">
              VISION UI <span className="text-sky-400">FREE</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { navigate("/dashboard"); setMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl bg-[#0f1535] text-white border border-sky-500/25 font-semibold text-sm shadow-lg shadow-sky-500/5 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { navigate("/paragraph-reader"); setMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <Book className="w-4 h-4 text-slate-400" />
              <span>Paragraph Reader</span>
            </button>

            <button
              onClick={() => { navigate("/paragraph-listener"); setMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <Mic className="w-4 h-4 text-slate-400" />
              <span>Paragraph Listener</span>
            </button>

            <button
              onClick={() => { navigate("/exam"); setMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <PenTool className="w-4 h-4 text-slate-400" />
              <span>Take Exam</span>
            </button>

            <div className="pt-6 pb-2">
              <span className="px-4 text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                Account Pages
              </span>
            </div>

            <button
              onClick={() => { setShowUserDetails(true); setMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/5 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">LSRW Platform v1.2</span>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE (RIGHT SIDE) */}
      <main className="flex-1 min-h-screen overflow-y-auto relative flex flex-col p-4 sm:p-6 lg:p-8">
        
        {/* Top Header Navigation */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-white/5 z-20">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Pages</span>
              <span>/</span>
              <span className="text-slate-200">Dashboard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Type here..."
                className="w-full sm:w-56 pl-10 pr-4 py-2 text-xs bg-[#0b1437]/70 border border-white/10 rounded-2xl focus:outline-none focus:border-sky-400/80 text-white placeholder-slate-400 transition-colors"
              />
            </div>

            {/* Profile trigger pill */}
            <div 
              className="flex items-center space-x-2 bg-[#0b1437]/70 border border-white/10 px-3.5 py-1.5 rounded-2xl cursor-pointer hover:border-sky-400/50 transition-colors"
              onClick={() => setShowUserDetails(true)}
            >
              <img
                src={user.userImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt=""
                className="w-6 h-6 rounded-full object-cover border border-sky-400"
              />
              <span className="text-xs font-semibold text-white hidden sm:inline">{user.userName || "Guest"}</span>
            </div>

            {/* Settings & Bell icons */}
            <button className="p-2 text-slate-400 hover:text-white bg-[#0b1437]/70 border border-white/10 rounded-2xl transition-colors">
              <Settings className="w-4 h-4" />
            </button>

            <button className="p-2 text-slate-400 hover:text-white bg-[#0b1437]/70 border border-white/10 rounded-2xl transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-[#0b1437]/70 border border-white/10 rounded-2xl transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ROW 1: METRIC CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 z-10">
          <div className="bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Modules</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg font-black text-white">3 Panels</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">+100%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/25 border border-white/15">
              <Book className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Practice Status</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg font-black text-white">Active</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Online</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/15">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Session</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg font-black text-white">12 Tasks</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">+25%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-2xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accuracy Goal</span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-lg font-black text-white">92%</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">+4%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-white/15">
              <Activity className="w-4 h-4 text-white" />
            </div>
          </div>
        </section>

        {/* ROW 2: WELCOME CARD + METERS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6 z-10">
          
          {/* Welcome Card (with jellyfish background) */}
          <div 
            className="lg:col-span-6 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[280px] shadow-2xl border border-white/10"
            style={{
              backgroundImage: `url(${jellyfishBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Absolute overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent z-0" />
            
            <div className="relative z-10 space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Welcome back,</span>
              <h2 className="text-3xl font-black text-white tracking-wide">{user.userName || "Mark Johnson"}</h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm pt-2">
                Glad to see you again! Practice daily to analyze pronunciation, listening comprehension, and track real-time scores.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button 
                onClick={() => navigate("/paragraph-reader")}
                className="flex items-center text-xs font-bold text-white hover:text-sky-300 transition-colors group"
              >
                <span>Tap to start practicing</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Satisfaction Rate Gauge */}
          <div className="lg:col-span-3 bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">Satisfaction Rate</h3>
              <p className="text-xs text-slate-400 font-medium">From all projects</p>
            </div>

            {/* Circular Arc SVG Meter */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center mt-3">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background Arc */}
                <path
                  d="M 20 80 A 35 35 0 1 1 80 80"
                  fill="none"
                  stroke="#12182b"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Foreground Arc */}
                <path
                  d="M 20 80 A 35 35 0 1 1 80 80"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="165"
                  strokeDashoffset={165 * (1 - 0.95)}
                  style={{ filter: "drop-shadow(0 0 6px rgba(2, 132, 199, 0.7))" }}
                />
              </svg>
              <div className="absolute bottom-4 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center mb-0.5">
                  <span className="text-sm">😊</span>
                </div>
                <span className="text-2xl font-black text-white">95%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Based on likes</span>
              </div>
            </div>
          </div>

          {/* Referral Tracking / Learning Progress */}
          <div className="lg:col-span-3 bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-2xl">
            <h3 className="text-base font-extrabold text-white tracking-wide">Learning Progress</h3>
            
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="space-y-4">
                <div className="p-3 bg-[#0b1437]/75 border border-white/5 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Listens Done</span>
                  <span className="text-sm font-black text-white">8 Sessions</span>
                </div>
                <div className="p-3 bg-[#0b1437]/75 border border-white/5 rounded-2xl">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Practice Score</span>
                  <span className="text-sm font-black text-emerald-400">+12% up</span>
                </div>
              </div>

              {/* Glowing Green Score Meter */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#12182b"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeDasharray="238.7"
                    strokeDashoffset={238.7 * (1 - 0.93)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.7))" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 uppercase font-bold">Safety</span>
                  <span className="text-xl font-black text-white">9.3</span>
                  <span className="text-[8px] text-emerald-400 font-bold uppercase">Score</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 3: FEATURE CARDS GRID */}
        <section className="space-y-4 mb-8 z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-black text-white tracking-wide">LSRW Practice Modules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-between cursor-pointer group hover:border-sky-400/60 transition-all duration-300 relative overflow-hidden shadow-2xl"
              >
                {/* Decorative floating massive icon background */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <feature.icon className="w-24 h-24 text-sky-400" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${feature.gradient} flex items-center justify-center shadow-lg border border-white/15 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/15">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-bold text-sky-400 group-hover:text-sky-300">
                  <span>Start Practice Session</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Support Info */}
        <section className="bg-[#060b1a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 z-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-1 text-left">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>About LSRW Platform</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                LSRW is a professional language skill evaluation system designed to refine Listening, Speaking, Reading, and Writing through automated voice analysis and real-time speech feedback.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
              <a
                href="https://github.com/muditbhatt-5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-[#0b1437]/70 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold transition-all"
              >
                <Github className="w-3.5 h-3.5 text-sky-400" />
                <span>GitHub</span>
              </a>

              <a
                href="mailto:bhattmudit213@gmail.com"
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold shadow-lg shadow-sky-600/20 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer Brand Info */}
        <footer className="w-full text-center text-[10px] text-slate-600 py-6 z-10">
          © {new Date().getFullYear()} LSRW Language Engine. All rights reserved.
        </footer>
      </main>

      {/* 3. PROFILE MODAL DIALOG */}
      {showUserDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="blur-background" onClick={() => setShowUserDetails(false)} />
          <div className="w-full max-w-md profile-modal-glow rounded-3xl p-6 relative z-50 text-white animate-in fade-in zoom-in duration-200 bg-[#060b1a]/95 border border-white/10">
            <button
              onClick={() => setShowUserDetails(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={user.userImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-sky-400"
                />
                <span className="absolute bottom-0 right-0 px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase rounded-full shadow-lg">
                  Active
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{user.userName || "Guest"}</h2>
              <p className="text-xs text-sky-400 font-medium">{user.userEmail || "guest@example.com"}</p>
            </div>

            <div className="mt-5 space-y-2.5 p-4 rounded-2xl bg-[#0b1437]/70 border border-white/5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400 font-medium">User ID:</span>
                <span className="text-slate-200 font-mono">{user.userID || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400 font-medium">Mobile:</span>
                <span className="text-slate-200 font-mono">{user.userMobile || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Enrollment:</span>
                <span className="text-slate-200 font-mono">{user.enrollment || "N/A"}</span>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => { setShowUserDetails(false); logout(); }} 
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white rounded-2xl text-xs font-bold shadow-lg transition-all"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
