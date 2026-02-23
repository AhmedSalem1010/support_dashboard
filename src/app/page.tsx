'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import Dashboard from '@/components/pages/Dashboard';
import { Vehicles } from '@/components/pages/Vehicles';
import { Users } from '@/components/pages/Users';
import { Authorizations } from '@/components/pages/Authorizations';
import { Equipment } from '@/components/pages/Equipment';
import { Maintenance } from '@/components/pages/Maintenance';
import { Accidents } from '@/components/pages/Accidents';
import { Expenses } from '@/components/pages/Expenses';
import FinancialReports from '@/components/pages/FinancialReports';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

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
      case 'equipment':
        return <Equipment />;
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <main className="flex-1 p-3 sm:p-4 md:p-6">
        {renderPage()}
      </main>
    </div>
  );
}
