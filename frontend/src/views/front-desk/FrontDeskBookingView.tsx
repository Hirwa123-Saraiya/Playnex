'use client';

// Re-export the front desk quick booking page as an inline component
import React from 'react';
import FrontDeskPage from '@/app/admin/front-desk/page';

export default function FrontDeskBookingView() {
  return <FrontDeskPage />;
}
