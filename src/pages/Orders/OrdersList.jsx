import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

// Custom SVG Icons (no external imports)
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CreditCardIcon = ({ color = 'text-gray-400' }) => (
  <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.offset, filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
      };
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await getOrders(params);
      if (response.data.success) {
        // Ensure we're getting the orders array properly
        const ordersData = response.data.data.orders || response.data.data || [];
        setOrders(ordersData);
        setPagination({
          ...pagination,
          total: response.data.data.total || ordersData.length || 0,
        });
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      paid: 'bg-green-500/10 text-green-700 border-green-500/20',
      failed: 'bg-red-500/10 text-red-700 border-red-500/20',
      refunded: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
      cancelled: 'bg-red-500/10 text-red-700 border-red-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-700 border-gray-500/20';
  };

  const getPaymentStatusIcon = (order) => {
    if (order.razorpayPaymentId) {
      return <CreditCardIcon color="text-green-600" />;
    } else if (order.razorpayOrderId) {
      return <CreditCardIcon color="text-yellow-600" />;
    }
    return <CreditCardIcon color="text-gray-400" />;
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Orders
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-8 h-0.5 bg-[#D3000D]"></span>
            <p className="text-sm text-gray-400 tracking-wider">Manage all orders and payments</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Orders</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {pagination.total}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Paid</p>
          <p className="text-xl font-light text-green-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {paidOrders}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-xl font-light text-yellow-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {pendingOrders}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Revenue</p>
          <p className="text-xl font-light text-[#D3000D] mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            ₹{totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <FilterIcon />
            <span className="text-sm font-medium text-gray-600">Filters:</span>
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent text-sm bg-white"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent text-sm bg-white"
            />
          </div>
          <button
            onClick={() => setFilters({ status: '', dateFrom: '', dateTo: '' })}
            className="px-4 py-2 text-sm text-gray-600 hover:text-[#D3000D] hover:bg-[#D3000D]/5 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                // Safely access user data - FIXED
                const user = order.User || order.user || {};
                const userName = user.name || 'N/A';
                const userPhone = user.phone || '';
                const event = order.event || {};
                const eventTitle = event.title || 'N/A';
                
                return (
                  <tr 
                    key={order.id} 
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-gray-800">#{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{userName}</p>
                        {userPhone && <p className="text-xs text-gray-400">{userPhone}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 line-clamp-1 max-w-[150px]">
                        {eventTitle}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(order)}
                        <div>
                          {order.razorpayPaymentId ? (
                            <span className="text-xs font-medium text-green-600">Paid</span>
                          ) : order.razorpayOrderId ? (
                            <span className="text-xs font-medium text-yellow-600">Initiated</span>
                          ) : (
                            <span className="text-xs text-gray-400">Not Initiated</span>
                          )}
                          {order.razorpayPaymentId && (
                            <div className="text-xs text-gray-400 font-mono truncate max-w-[80px]">
                              {order.razorpayPaymentId.slice(0, 10)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-2 text-gray-400 hover:text-[#D3000D] hover:bg-[#D3000D]/5 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <EyeIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBagIcon />
            </div>
            <p className="text-gray-500 font-light">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{pagination.offset + 1}</span> to{' '}
              <span className="font-medium text-gray-700">
                {Math.min(pagination.offset + pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium text-gray-700">{pagination.total}</span> orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, offset: Math.max(0, pagination.offset - pagination.limit) })}
                disabled={pagination.offset === 0}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#D3000D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => setPagination({ ...pagination, offset: pagination.offset + pagination.limit })}
                disabled={pagination.offset + pagination.limit >= pagination.total}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#D3000D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;