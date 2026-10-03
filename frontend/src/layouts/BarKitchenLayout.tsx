'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { BarKitchenHeader } from '../components/bar-kitchen/BarKitchenHeader';
import { BarKitchenSidebar } from '../components/bar-kitchen/BarKitchenSidebar';
import { useBarKitchenStore } from '../store/BarKitchenStore';
import { Loader2 } from 'lucide-react';

// Views
import { BarKitchenDashboard } from '../views/bar-kitchen/BarKitchenDashboard';
import { BarKitchenMenuManagement } from '../views/bar-kitchen/BarKitchenMenuManagement';
import { BarKitchenTableManagement } from '../views/bar-kitchen/BarKitchenTableManagement';
import { BarKitchenReservations } from '../views/bar-kitchen/BarKitchenReservations';
import { BarKitchenOrderManagement } from '../views/bar-kitchen/BarKitchenOrderManagement';
import { BarKitchenKOT } from '../views/bar-kitchen/BarKitchenKOT';
import { BarKitchenKDS } from '../views/bar-kitchen/BarKitchenKDS';
import { BarKitchenBarOperations } from '../views/bar-kitchen/BarKitchenBarOperations';
import { BarKitchenBilling } from '../views/bar-kitchen/BarKitchenBilling';
import { BarKitchenPayments } from '../views/bar-kitchen/BarKitchenPayments';
import { BarKitchenInventory } from '../views/bar-kitchen/BarKitchenInventory';
import { BarKitchenRecipes } from '../views/bar-kitchen/BarKitchenRecipes';
import { BarKitchenStewards } from '../views/bar-kitchen/BarKitchenStewards';
import { BarKitchenBanquet } from '../views/bar-kitchen/BarKitchenBanquet';
import { BarKitchenDiscounts } from '../views/bar-kitchen/BarKitchenDiscounts';
import { BarKitchenAudit } from '../views/bar-kitchen/BarKitchenAudit';
import { BarKitchenReports } from '../views/bar-kitchen/BarKitchenReports';
import { BarKitchenSettings } from '../views/bar-kitchen/BarKitchenSettings';
import { BarKitchenOrderDetails } from '../views/bar-kitchen/BarKitchenOrderDetails';

export const BarKitchenLayout: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { activeNav } = useBarKitchenStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071A3D] text-white">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const renderActiveView = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <BarKitchenDashboard />;
      case 'Menu Management':
        return <BarKitchenMenuManagement />;
      case 'Table Management':
        return <BarKitchenTableManagement />;
      case 'Reservations':
        return <BarKitchenReservations />;
      case 'Order Management':
        return <BarKitchenOrderManagement />;
      case 'Kitchen Operations':
        return <BarKitchenKDS />;
      case 'KOT':
        return <BarKitchenKOT />;
      case 'Bar Operations':
        return <BarKitchenBarOperations />;
      case 'Billing & Payments':
        return <BarKitchenBilling />;
      case 'Payments':
        return <BarKitchenPayments />;
      case 'Inventory':
        return <BarKitchenInventory />;
      case 'Recipes':
        return <BarKitchenRecipes />;
      case 'Stewards':
        return <BarKitchenStewards />;
      case 'Banquet & Catering':
        return <BarKitchenBanquet />;
      case 'Member Discounts':
        return <BarKitchenDiscounts />;
      case 'Audit Logs':
        return <BarKitchenAudit />;
      case 'Reports & Analytics':
        return <BarKitchenReports />;
      case 'Settings':
        return <BarKitchenSettings />;
      case 'Order Details':
        return <BarKitchenOrderDetails />;
      default:
        return <BarKitchenDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex w-full min-w-0 overflow-x-hidden font-sans">
      {/* Sidebar Navigation */}
      <BarKitchenSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <BarKitchenHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1720px] w-full mx-auto min-w-0">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
