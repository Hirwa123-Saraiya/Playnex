'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FacilityOpsSidebar } from '@/components/facility-ops/FacilityOpsSidebar';
import { FacilityOpsDashboard } from '@/views/facility-ops/FacilityOpsDashboard';
import { Loader2 } from 'lucide-react';

export const FacilityOpsLayout: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('COURTS');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-white">
      <FacilityOpsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <FacilityOpsDashboard activeTab={activeTab} />
      </div>
    </div>
  );
};
