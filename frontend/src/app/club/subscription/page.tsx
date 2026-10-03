'use client';

import React from 'react';
import { ClubLayout } from '@/layouts/ClubLayout';
import { ClubSubscription } from '@/views/ClubSubscription';

export default function ClubSubscriptionPage() {
  return (
    <ClubLayout>
      <ClubSubscription />
    </ClubLayout>
  );
}
