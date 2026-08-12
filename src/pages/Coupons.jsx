// src/pages/Coupons.jsx

import React, { useState } from 'react';
import CouponList from '../components/coupons/CouponList';
import CouponForm from '../components/coupons/CouponForm';

const Coupons = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCoupon(null);
    // Refresh the list will be handled by the CouponList component internally
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-light">Coupons</h1>
          <p className="text-gray-400 mt-1">Manage discount coupons for events</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#D3000D] text-white rounded-lg hover:bg-[#B3000B] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Coupon
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
          </div>
          <CouponForm
            coupon={editingCoupon}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <CouponList onEdit={handleEdit} />
      )}
    </div>
  );
};

export default Coupons;