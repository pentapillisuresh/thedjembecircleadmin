import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Calendar, ShoppingBag, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import { getUser } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await getUser(id);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="p-6 text-center text-gray-500">User not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/users')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Users
      </button>

      {/* User Profile Card */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-indigo-600">
                  {user.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <div className="flex items-center mt-1 space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500">ID: #{user.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 mr-3 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail className="w-5 h-5 mr-3 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-3 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{user.orders?.length || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Orders</p>
              <p className="text-2xl font-bold">
                {user.orders?.filter(o => o.status === 'paid').length || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold">
                {user.orders?.filter(o => o.status === 'pending').length || 0}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold">
                ₹{user.orders?.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2" />
          Order History
        </h3>
        
        {user.orders && user.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Event</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">#{order.id}</td>
                    <td className="py-3 px-4">{order.event?.title || 'N/A'}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ₹{order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No orders found for this user</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;