// src/components/coupons/CouponList.jsx

import React, { useState, useEffect } from 'react';
import { getCoupons, deleteCoupon, toggleCouponStatus } from '../../api/admin';

const CouponList = ({ onEdit, refreshTrigger }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, [refreshTrigger]);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      
      const data = await getCoupons(params);
      // Ensure data is always an array
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch coupons error:', err);
      setError(err.response?.data?.message || 'Failed to fetch coupons');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        await fetchCoupons();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete coupon');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleCouponStatus(id);
      await fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle coupon status');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCoupons();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    // Fetch after state update
    setTimeout(() => fetchCoupons(), 0);
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isActive, expiresAt) => {
    if (!isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Inactive</span>;
    }
    if (isExpired(expiresAt)) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Expired</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>;
  };

  const getDaysRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D3000D]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search coupons by code..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#D3000D] text-white rounded-lg hover:bg-[#B3000B] transition-colors"
          >
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="m-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-sm text-[#D3000D]">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-lg">{coupon.discountPercentage}%</span>
                    <span className="text-xs text-gray-500 block">off</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {coupon.usedCount || 0}
                      {coupon.maxUses !== null && coupon.maxUses !== undefined && (
                        <span className="text-xs text-gray-500 block">/ {coupon.maxUses} max</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{formatDate(coupon.expiresAt)}</div>
                    {!isExpired(coupon.expiresAt) && coupon.isActive && coupon.expiresAt && (
                      <div className="text-xs text-gray-500">
                        {getDaysRemaining(coupon.expiresAt)} days remaining
                      </div>
                    )}
                    {isExpired(coupon.expiresAt) && coupon.expiresAt && (
                      <div className="text-xs text-red-500">Expired</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(coupon.isActive, coupon.expiresAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(coupon.id)}
                        className={`text-sm font-medium ${
                          coupon.isActive ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponList;