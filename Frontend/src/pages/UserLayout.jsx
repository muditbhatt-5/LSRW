import React, { useState } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  Book, Mic, PenTool, LogOut, User, Sparkles,
  LayoutDashboard, X, Settings, Bell, Search, Menu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./DashboardDesign.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Paragraph Reader', path: '/paragraph-reader', icon: Book },
    { label: 'Paragraph Listener', path: '/paragraph-listener', icon: Mic },
    { label: 'Take Exam', path: '/exam', icon: PenTool },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/paragraph-reader': return 'Paragraph Reader';
      case '/paragraph-listener': return 'Paragraph Listener';
      case '/exam': return 'Take Exam';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-screen text-slate-100 flex overflow-hidden font-sans bg-transparent">
      {/* 1. SIDEBAR */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 p-5 flex flex-col justify-between z-50 transition-transform duration-300
        md:translate-x-0 md:relative md:flex shrink-0 h-screen
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
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all text-sm ${
                    active 
                    ? "bg-[#0f1535] text-white border border-sky-500/25 font-semibold shadow-lg shadow-sky-500/5"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-sky-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

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

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 h-screen overflow-y-auto relative flex flex-col p-4 sm:p-6 lg:p-8">
        {/* Top Header Navigation */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-white/5 z-20">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>Pages</span>
              <span>/</span>
              <span className="text-slate-200">{getPageTitle()}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">{getPageTitle()}</h1>
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

        {/* Dynamic Inner Content injected here */}
        <div className="relative z-10 w-full flex-1 flex flex-col">
          <Outlet />
        </div>

        {/* Footer Brand Info */}
        <footer className="w-full text-center text-[10px] text-slate-600 py-6 z-10 mt-auto">
          © {new Date().getFullYear()} LSRW Language Engine. All rights reserved.
        </footer>
      </main>

      {/* 3. PROFILE MODAL DIALOG */}
      {showUserDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
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

export default UserLayout;
