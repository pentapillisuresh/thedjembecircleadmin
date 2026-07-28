import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom SVG Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const Header = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Left Side - Greeting */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-lg font-light text-gray-700" style={{ fontFamily: "'Georgia', serif" }}>
              <span className="text-gray-400">Welcome back,</span>{' '}
              <span className="font-medium text-gray-900">{admin?.name || 'Admin'}</span>
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-6 h-0.5 bg-[#D3000D] opacity-40"></span>
              <span className="text-[10px] text-gray-400 tracking-widest">
                {admin?.role?.toUpperCase() || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-400 hover:text-[#D3000D] rounded-full hover:bg-gray-50 transition-all duration-300">
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D3000D] rounded-full border-2 border-white"></span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-[#D3000D] rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm group-hover:shadow-md transition-all duration-300">
                  {getInitials(admin?.name)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 leading-tight">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-gray-400 tracking-wider">
                  {admin?.email || admin?.phone || 'Administrator'}
                </p>
              </div>
              <ChevronIcon />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                  <p className="text-xs text-gray-500">{admin?.email || admin?.phone}</p>
                </div>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#D3000D] transition-colors"
                >
                  <UserIcon />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <LogoutIcon />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;