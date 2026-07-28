import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

// Custom SVG Icons (no external imports)
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BanknoteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await getOrder(id);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      toast.success('Order status updated');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircleIcon />;
      case 'pending': return <ClockIcon />;
      case 'failed': return <XCircleIcon />;
      case 'refunded': return <RefreshIcon />;
      default: return <ClockIcon />;
    }
  };

  const getPaymentMethodDisplay = (order) => {
    if (!order.razorpayPaymentId && !order.razorpayOrderId) {
      return 'Not Initiated';
    }
    if (order.status === 'paid' && order.razorpayPaymentId) {
      return 'Razorpay - Card/UPI';
    }
    if (order.status === 'pending' && order.razorpayOrderId) {
      return 'Razorpay - Pending';
    }
    return 'Razorpay';
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="p-6 text-center text-gray-500">Order not found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#D3000D] transition-colors text-sm"
          >
            <ArrowLeftIcon />
            Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 text-sm font-medium rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </span>
            {order.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('paid')}
                disabled={updating}
                className="px-4 py-1.5 bg-[#D3000D] text-white rounded-lg hover:bg-[#B0000A] transition-all text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50"
              >
                Mark Paid
              </button>
            )}
            {order.status === 'paid' && (
              <button
                onClick={() => handleStatusUpdate('refunded')}
                disabled={updating}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50"
              >
                Refund
              </button>
            )}
            {order.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={updating}
                className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                Order #{order.id}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Amount</p>
              <p className="text-2xl font-light text-[#D3000D]" style={{ fontFamily: "'Georgia', serif" }}>
                ₹{order.totalAmount?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Payment Status</p>
            <div className="mt-1 flex items-center gap-2">
              {order.status === 'paid' ? (
                <CheckCircleIcon />
              ) : order.status === 'pending' ? (
                <ClockIcon />
              ) : order.status === 'failed' ? (
                <XCircleIcon />
              ) : (
                <CreditCardIcon />
              )}
              <span className="text-sm font-medium capitalize text-gray-700">{order.status}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Payment Method</p>
            <div className="mt-1 flex items-center gap-2">
              <CreditCardIcon />
              <span className="text-sm text-gray-700">{getPaymentMethodDisplay(order)}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Order Date</p>
            <div className="mt-1">
              <span className="text-sm text-gray-700">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        {(order.razorpayOrderId || order.razorpayPaymentId) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <BanknoteIcon />
              Payment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.razorpayOrderId && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Razorpay Order ID</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-gray-700 flex-1">
                      {order.razorpayOrderId}
                    </code>
                    <button
                      onClick={() => handleCopy(order.razorpayOrderId)}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-[#D3000D]/5 hover:border-[#D3000D]/30 transition-all"
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Razorpay Payment ID</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-200 font-mono text-gray-700 flex-1">
                      {order.razorpayPaymentId}
                    </code>
                    <button
                      onClick={() => handleCopy(order.razorpayPaymentId)}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-[#D3000D]/5 hover:border-[#D3000D]/30 transition-all"
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer & Event Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <UserIcon />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-20 text-gray-400">Name</span>
                <span className="font-medium text-gray-800">{order.user?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-20 text-gray-400">Phone</span>
                <span className="font-medium text-gray-800">{order.user?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <TicketIcon />
              Event Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-20 text-gray-400">Event</span>
                <span className="font-medium text-gray-800">{order.event?.title || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-20 text-gray-400">Date</span>
                <span className="font-medium text-gray-800">
                  {order.event?.date ? new Date(order.event.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Order Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Ticket Class</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Discount</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-6">
                      <span className="text-sm font-medium text-gray-700">{item.ticketClass?.name || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-6 text-right text-sm text-gray-600">{item.quantity}</td>
                    <td className="py-3 px-6 text-right text-sm text-gray-600">₹{item.priceAtTime?.toFixed(2)}</td>
                    <td className="py-3 px-6 text-right text-sm text-gray-600">{item.discountPercentageAtTime || 0}%</td>
                    <td className="py-3 px-6 text-right text-sm font-medium text-gray-800">₹{item.subtotal?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50/50">
                  <td colSpan="4" className="py-4 px-6 text-right">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-lg font-light text-[#D3000D]" style={{ fontFamily: "'Georgia', serif" }}>
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;