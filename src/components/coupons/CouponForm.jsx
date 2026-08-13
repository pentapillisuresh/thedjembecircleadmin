// src/components/coupons/CouponForm.jsx

import React, { useState, useEffect } from 'react';
import { createCoupon, updateCoupon } from '../../api/admin';

const CouponForm = ({ coupon = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    isActive: true,
    expiresAt: '',
    maxUses: '',
    eligibleUsers: ['All']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eligibilityType, setEligibilityType] = useState('all');

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        discountPercentage: coupon.discountPercentage || '',
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
        maxUses: coupon.maxUses !== null && coupon.maxUses !== undefined ? coupon.maxUses : '',
        eligibleUsers: coupon.eligibleUsers || ['All']
      });
      
      if (coupon.eligibleUsers && coupon.eligibleUsers.length > 0 && coupon.eligibleUsers[0] !== 'All') {
        setEligibilityType('specific');
      } else {
        setEligibilityType('all');
      }
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEligibilityChange = (e) => {
    const value = e.target.value;
    setEligibilityType(value);
    if (value === 'all') {
      setFormData(prev => ({ ...prev, eligibleUsers: ['All'] }));
    } else {
      setFormData(prev => ({ ...prev, eligibleUsers: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate discount percentage
      const discount = parseFloat(formData.discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        setError('Discount percentage must be between 0 and 100');
        setLoading(false);
        return;
      }

      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountPercentage: discount,
        isActive: formData.isActive,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        eligibleUsers: formData.eligibleUsers
      };

      if (coupon) {
        await updateCoupon(coupon.id, payload);
      } else {
        await createCoupon(payload);
      }
      
      onSuccess();
    } catch (err) {
      console.error('Save coupon error:', err);
      setError(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent uppercase"
            placeholder="e.g., SUMMER2024"
          />
          <p className="text-xs text-gray-500 mt-1">Code will be automatically converted to uppercase</p>
        </div>

        {/* Discount Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Percentage (%) *
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
            placeholder="e.g., 20"
          />
          <p className="text-xs text-gray-500 mt-1">Enter value between 0 and 100</p>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
        </div>

        {/* Max Uses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Uses
          </label>
          <input
            type="number"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
            placeholder="e.g., 100"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited uses</p>
        </div>

        {/* Eligibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eligibility
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="eligibility"
                value="all"
                checked={eligibilityType === 'all'}
                onChange={handleEligibilityChange}
                className="h-4 w-4 text-[#D3000D] focus:ring-[#D3000D] border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">All Users</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="eligibility"
                value="specific"
                checked={eligibilityType === 'specific'}
                onChange={handleEligibilityChange}
                className="h-4 w-4 text-[#D3000D] focus:ring-[#D3000D] border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Specific Users</span>
            </label>
          </div>
          {eligibilityType === 'specific' && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter user IDs (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
                onChange={(e) => {
                  const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
                  setFormData(prev => ({ ...prev, eligibleUsers: ids.length ? ids : [] }));
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Enter user IDs separated by commas</p>
            </div>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-[#D3000D] focus:ring-[#D3000D] border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Active
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#D3000D] text-white rounded-lg hover:bg-[#B3000B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;