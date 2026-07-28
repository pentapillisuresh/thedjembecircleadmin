import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/admin';
import RevenueChart from '../components/charts/RevenueChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

// Custom SVG Icons (no external imports)
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const RupeeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 8h6m-6 4h3m-3 4h3m-3-8v12m0-12h6m-6 4h6m-6 4h6" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBagIcon,
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Paid Orders',
      value: stats?.paidOrders || 0,
      icon: TicketIcon,
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: RupeeIcon,
      change: '+15%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="w-8 h-0.5 bg-[#D3000D]"></span>
          <p className="text-sm text-gray-400 tracking-wider">Welcome back to your admin panel</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-[#D3000D]/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-light text-gray-900 mt-2" style={{ fontFamily: "'Georgia', serif" }}>
                  {card.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                    <TrendingUpIcon />
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#D3000D]/10">
                <card.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Main */}
        {stats?.ordersPerEvent && stats.ordersPerEvent.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Revenue Overview</h3>
                <p className="text-xs text-gray-400 mt-0.5">Revenue breakdown by event</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D3000D]"></span>
                <span className="text-xs text-gray-500">This month</span>
              </div>
            </div>
            <RevenueChart data={stats.ordersPerEvent} />
          </div>
        )}

        {/* Quick Stats - Side */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Total Events</span>
              <span className="text-sm font-medium text-gray-900">{stats?.totalOrders || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium text-green-600">68%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Avg Order Value</span>
              <span className="text-sm font-medium text-gray-900">
                ₹{(stats?.totalRevenue / (stats?.paidOrders || 1) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">{stats?.totalUsers || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity (Optional) */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Recent Activity</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest updates from your platform</p>
          </div>
          <button className="text-xs text-[#D3000D] hover:text-[#B0000A] font-medium transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-600 flex-1">
              <span className="font-medium text-gray-800">New order</span> received from customer
            </p>
            <span className="text-xs text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-[#D3000D]"></div>
            <p className="text-sm text-gray-600 flex-1">
              <span className="font-medium text-gray-800">New user</span> registered on the platform
            </p>
            <span className="text-xs text-gray-400">15 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm text-gray-600 flex-1">
              <span className="font-medium text-gray-800">Event</span> "Drum Circle Workshop" went live
            </p>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;