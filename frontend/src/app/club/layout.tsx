'use client';

import React from 'react';
import { ClubLayout } from '@/layouts/ClubLayout';

export default function ClubAppLayout({ children }: { children: React.ReactNode }) {
  return <ClubLayout>{children}</ClubLayout>;
}
