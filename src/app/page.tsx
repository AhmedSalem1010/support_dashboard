'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/pages/Dashboard';
import { Vehicles } from '@/components/pages/Vehicles';
import { Users } from '@/components/pages/Users';
import { Authorizations } from '@/components/pages/Authorizations';
import Inspection from '@/components/pages/Inspection';
import { Maintenance } from '@/components/pages/Maintenance';
import { Accidents } from '@/components/pages/Accidents';
import { Expenses } from '@/components/pages/Expenses';
import { FinancialReports } from '@/components/pages/FinancialReports';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <Vehicles />;
      case 'users':
        return <Users />;
      case 'authorizations':
        return <Authorizations />;
      case 'inspection':
        return <Inspection />;
      case 'maintenance':
        return <Maintenance />;
      case 'accidents':
        return <Accidents />;
      case 'expenses':
        return <Expenses />;
      case 'reports':
        return <FinancialReports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
