import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogin } from '../api/admin';
import { useAuth } from '../hooks/useAuth';

// Custom SVG Icons
const PhoneIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ isVisible }) => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {isVisible ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </>
    )}
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// Custom Logo Component with SVG fallback
const LogoIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" stroke="#D3000D" strokeWidth="2.5"/>
    <circle cx="50" cy="50" r="34" stroke="#D3000D" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="50" cy="50" r="22" stroke="#D3000D" strokeWidth="2" opacity="0.6"/>
    <circle cx="50" cy="50" r="8" fill="#D3000D"/>
    <path d="M50 20 L50 80 M20 50 L80 50" stroke="#D3000D" strokeWidth="1.5" opacity="0.15"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    pin: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.pin) {
      toast.error('Phone and PIN are required');
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin(formData.phone, formData.pin);
      if (response.data.success) {
        const { admin, token } = response.data.data;
        login(admin, token);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="./images/about.jpg"
          alt="Drum Circle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0"></div>
        
        {/* Brand Element */}
        <div className="absolute bottom-12 left-12 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-0.5 bg-[#D3000D]"></div>
            <span className="text-xs font-light tracking-[0.3em] opacity-60">EST. 2018</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Logo & Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex flex-col items-center">
              {/* Try loading from public folder first */}
              <img 
                src="/images/logo.jpeg" 
                alt="The Djembe Circle Logo" 
                className="w-16 h-16 mb-2 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  // Show SVG fallback
                  const parent = e.target.parentElement;
                  const svgFallback = document.createElement('div');
                  svgFallback.innerHTML = `
                    <svg class="w-16 h-16 mb-2" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="46" stroke="#D3000D" stroke-width="2.5"/>
                      <circle cx="50" cy="50" r="34" stroke="#D3000D" stroke-width="1.5" opacity="0.4"/>
                      <circle cx="50" cy="50" r="22" stroke="#D3000D" stroke-width="2" opacity="0.6"/>
                      <circle cx="50" cy="50" r="8" fill="#D3000D"/>
                      <path d="M50 20 L50 80 M20 50 L80 50" stroke="#D3000D" stroke-width="1.5" opacity="0.15"/>
                    </svg>
                  `;
                  parent.appendChild(svgFallback.firstElementChild);
                }}
              />
              <div className="mt-3">
                <h1 className="text-2xl font-light tracking-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                  The Djembe Circle
                </h1>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="w-8 h-0.5 bg-[#D3000D]"></span>
                  <span className="text-[10px] text-gray-400 tracking-[0.2em]">ADMIN PORTAL</span>
                  <span className="w-8 h-0.5 bg-[#D3000D]"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-light text-gray-800" style={{ fontFamily: "'Georgia', serif" }}>
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-gray-400 tracking-wide">
              Sign in to manage your community
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="phone" className="block text-[10px] font-medium text-gray-400 uppercase tracking-[0.15em] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pin" className="block text-[10px] font-medium text-gray-400 uppercase tracking-[0.15em] mb-1.5">
                  Security PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    id="pin"
                    name="pin"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full pl-11 pr-11 py-3 border border-gray-200 rounded-full placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="Enter your PIN"
                    value={formData.pin}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                    tabIndex="-1"
                  >
                    <EyeIcon isVisible={showPassword} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#D3000D] focus:ring-[#D3000D] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-500">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#D3000D] hover:text-[#B0000A] transition-colors">
                  Forgot PIN?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border-2 border-[#D3000D] text-sm font-medium rounded-full text-white bg-[#D3000D] hover:bg-white hover:text-[#D3000D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D3000D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowIcon />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              <span className="text-[10px] text-gray-300 tracking-[0.15em]">SECURE</span>
              <span className="w-1 h-1 rounded-full bg-[#D3000D] opacity-30"></span>
              <span className="text-[10px] text-gray-300 tracking-[0.15em]">ENCRYPTED</span>
              <span className="w-1 h-1 rounded-full bg-[#D3000D] opacity-30"></span>
              <span className="text-[10px] text-gray-300 tracking-[0.15em]">PRIVATE</span>
            </div>
            <p className="text-[10px] text-gray-300 tracking-[0.2em]">
              © 2026 THE DJEMBE CIRCLE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;