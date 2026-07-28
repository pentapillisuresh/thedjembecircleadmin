import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, toggleUserStatus } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

// Custom SVG Icons (no external imports)
const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UserCheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserXIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.offset, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        search: search || undefined,
        limit: pagination.limit,
        offset: pagination.offset,
      });
      if (response.data.success) {
        setUsers(response.data.data.users || []);
        setPagination({
          ...pagination,
          total: response.data.data.total || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleUserStatus(id, !currentStatus);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Calculate stats
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = users.filter(u => !u.isActive).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Users
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-8 h-0.5 bg-[#D3000D]"></span>
            <p className="text-sm text-gray-400 tracking-wider">Manage your community members</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-white text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Users</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {pagination.total}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Active</p>
          <p className="text-xl font-light text-green-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {activeUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Inactive</p>
          <p className="text-xl font-light text-red-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {inactiveUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Showing</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {users.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D3000D]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#D3000D]">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{user.phone}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{user.email || '-'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      user.isActive 
                        ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                        : 'bg-red-500/10 text-red-700 border-red-500/20'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="p-2 text-gray-400 hover:text-[#D3000D] hover:bg-[#D3000D]/5 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          user.isActive 
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <UserXIcon /> : <UserCheckIcon />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <UsersIcon />
            </div>
            <p className="text-gray-500 font-light">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
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
              of <span className="font-medium text-gray-700">{pagination.total}</span> users
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

export default UsersList;