import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

// Custom SVG Icons (no external imports)
const DashboardIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const EventsIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const OrdersIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const GalleryIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4 4m4-4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CouponsIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const LeadsIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const BlogIcon = ({ active }) => (
  <svg className={`w-5 h-5 ${active ? 'text-[#D3000D]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/', icon: DashboardIcon, label: 'Dashboard' },
    { path: '/events', icon: EventsIcon, label: 'Events' },
    { path: '/users', icon: UsersIcon, label: 'Users' },
    { path: '/orders', icon: OrdersIcon, label: 'Orders' },
    { path: '/leads', icon: LeadsIcon, label: 'Leads' },
      { path: '/blog', icon: BlogIcon, label: 'Blog' },
    { path: '/gallery', icon: GalleryIcon, label: 'Gallery' },
    { path: '/coupons', icon: CouponsIcon, label: 'Coupons' },
    { path: '/profile', icon: ProfileIcon, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`h-screen bg-black fixed left-0 top-0 flex flex-col transition-all duration-300 border-r border-white/5 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Section */}
      <div className={`p-5 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {/* Logo Image */}
          <div className="flex-shrink-0">
            <img 
              src="/images/logo.jpeg" 
              alt="The Djembecircle" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 bg-[#D3000D]/20 border-2 border-[#D3000D]/30 flex items-center justify-center text-lg font-bold text-[#D3000D]';
                  fallback.textContent = 'D';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-light tracking-tight text-white" style={{ fontFamily: "'Georgia', serif" }}>
                The Djembecircle
              </h1>
              <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">Admin Panel</p>
            </div>
          )}
        </div>
        <button
          onClick={toggleCollapse}
          className={`p-1.5 hover:bg-white/5 transition-colors text-gray-500 hover:text-[#D3000D] ${
            isCollapsed ? 'hidden' : ''
          }`}
        >
          <ChevronLeftIcon />
        </button>
      </div>

      {/* Collapse Toggle Button (when collapsed) */}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 p-1.5 bg-black border border-white/10 shadow-lg hover:shadow-xl transition-all hover:border-[#D3000D]/30 group"
        >
          <ChevronRightIcon />
        </button>
      )}
      
      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => {
              const baseClasses = `flex items-center px-3 py-2.5 transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-[#D3000D]/20 text-white shadow-lg shadow-[#D3000D]/5' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`;
              return isCollapsed ? `${baseClasses} justify-center` : baseClasses;
            }}
          >
            {({ isActive }) => (
              <>
                <item.icon active={isActive} />
                {!isCollapsed && (
                  <span className={`ml-3 text-sm font-medium transition-all ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-white/5 shadow-lg">
                    {item.label}
                  </div>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-6 bg-[#D3000D]"></div>
                )}
                {isActive && isCollapsed && (
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#D3000D]"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section - User Info & Logout */}
      <div className={`p-4 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group relative ${
            isCollapsed ? 'justify-center w-full' : 'w-full'
          }`}
        >f
          <LogoutIcon />
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium">Sign Out</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-white/5 shadow-lg">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;