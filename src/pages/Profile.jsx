import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateAdminProfile, adminChangePin } from '../api/admin';
import { toast } from 'react-toastify';

// Custom SVG Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Profile = () => {
  const { admin, loadProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
  });
  const [pinData, setPinData] = useState({
    oldPin: '',
    newPin: '',
    confirmPin: '',
  });

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePinChange = (e) => {
    setPinData({ ...pinData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdminProfile(formData);
      toast.success('Profile updated successfully');
      loadProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    
    if (pinData.newPin !== pinData.confirmPin) {
      toast.error('New PIN and confirm PIN do not match');
      return;
    }
    if (pinData.newPin.length < 4) {
      toast.error('PIN must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      await adminChangePin(pinData.oldPin, pinData.newPin);
      toast.success('PIN changed successfully');
      setPinData({ oldPin: '', newPin: '', confirmPin: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change PIN');
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Profile Settings
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-8 h-0.5 bg-[#D3000D]"></span>
            <p className="text-sm text-gray-400 tracking-wider">Manage your account settings</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-[#D3000D] rounded-full flex items-center justify-center text-white text-xl font-medium shadow-sm">
                  {getInitials(admin?.name)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{admin?.name || 'Admin'}</h3>
                <p className="text-sm text-gray-500">{admin?.email || admin?.phone}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#D3000D]/10 text-[#D3000D] text-xs font-medium rounded-full">
                  {admin?.role?.toUpperCase() || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <UserIcon />
              Profile Information
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon />
                  </div>
                  <input
                    type="text"
                    value={admin?.phone || ''}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Phone number cannot be changed</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#D3000D] text-white rounded-xl hover:bg-[#B0000A] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Change PIN Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <ShieldIcon />
              Change PIN
            </h3>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Current PIN *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      name="oldPin"
                      value={pinData.oldPin}
                      onChange={handlePinChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    New PIN *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      name="newPin"
                      value={pinData.newPin}
                      onChange={handlePinChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Confirm PIN *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      name="confirmPin"
                      value={pinData.confirmPin}
                      onChange={handlePinChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#D3000D] text-white rounded-xl hover:bg-[#B0000A] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Changing...
                  </span>
                ) : (
                  'Change PIN'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;