import React, { useState, useEffect } from 'react';
import Sidebar from '../Comp/Layout/Sidebar';
import Header from '../Comp/Layout/Header';
import MainDashboard from './MainDashboard';
import DataTable from '../Comp/DashboardComp/DataTable';
import ManageUsers from './ManageUsers';

export default function DashboardLayout() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  // PERFECT MOOD CHANGER LOGIC
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Render content
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <MainDashboard />;
      case 'users':
        return <ManageUsers />; // Yahan generic table hata kar naya component call kiya hai
      case 'volunteers':
        return <DataTable tableName="volunteer_applications" title="Volunteer Applications" />;
      case 'contacts':
        return <DataTable tableName="contacts" title="User Contact Messages" />;
      case 'complaints':
        return <DataTable tableName="complaints" title="User Complaints" />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 font-sans transition-colors duration-300">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}