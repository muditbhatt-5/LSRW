import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, BookOpen, Mic, HelpCircle, LayoutDashboard, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Users', path: '/admin', icon: Users, exact: true },
    { label: 'Paragraph Readers', path: '/admin/admin-paragraph-readers', icon: BookOpen },
    { label: 'Paragraph Listeners', path: '/admin/admin-paragraph-listeners', icon: Mic },
    { label: 'MCQs', path: '/admin/mcqs', icon: HelpCircle },
    { label: 'User Panel', path: '/dashboard', icon: LayoutDashboard },
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname === item.path;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-72 min-h-screen p-5 flex flex-col justify-between z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0 fixed top-0 left-0 bottom-0 bg-[#071124]' : '-translate-x-full md:translate-x-0 relative'
        } border-r border-sky-500/20 bg-slate-950/70 backdrop-blur-xl`}
      >
        <div>
          {/* Header Brand */}
          <div className="flex items-center space-x-3 pb-6 mb-6 border-b border-white/10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30 border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-wide">Admin Portal</h2>
              <div className="flex items-center space-x-1.5 text-[11px] text-sky-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>System Console</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-sky-600/40 to-cyan-500/20 border border-sky-400/60 text-white shadow-lg shadow-sky-500/10 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-sky-400" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>LSRW Centralized Theme Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
