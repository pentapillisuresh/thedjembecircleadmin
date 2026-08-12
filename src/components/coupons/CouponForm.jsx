// src/components/coupons/CouponForm.jsx

import React, { useState, useEffect } from 'react';
import { createCoupon, updateCoupon } from '../../api/admin';

const CouponForm = ({ coupon = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    isActive: true,
    expiresAt: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        discountPercentage: coupon.discountPercentage || '',
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : ''
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountPercentage: parseFloat(formData.discountPercentage),
        isActive: formData.isActive,
        expiresAt: new Date(formData.expiresAt).toISOString()
      };

      if (coupon) {
        await updateCoupon(coupon.id, payload);
      } else {
        await createCoupon(payload);
      }
      
      onSuccess();
    } catch (err) {
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
            Expiry Date *
          </label>
          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
          />
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