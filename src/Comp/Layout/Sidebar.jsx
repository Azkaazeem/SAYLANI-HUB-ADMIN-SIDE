import React from 'react';
import { LayoutDashboard, Users, HandHeart, MessageSquare, AlertTriangle, Settings } from 'lucide-react';
import smitLogo from '../../assets/SMIT.png';

const NavItem = ({ icon, label, isActive, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed text-gray-400' :
      isActive ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default function Sidebar({ currentView, setCurrentView }) {
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-colors duration-300">
      <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-slate-700">
        <img src={smitLogo} alt="SMIT Logo" className="h-12 w-auto object-contain" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isActive={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
        <NavItem icon={<Users size={20} />} label="Manage Users" isActive={currentView === 'users'} onClick={() => setCurrentView('users')} />
        <NavItem icon={<HandHeart size={20} />} label="Volunteers" isActive={currentView === 'volunteers'} onClick={() => setCurrentView('volunteers')} />
        <NavItem icon={<MessageSquare size={20} />} label="Contacts" isActive={currentView === 'contacts'} onClick={() => setCurrentView('contacts')} />
        <NavItem icon={<AlertTriangle size={20} />} label="Complaints" isActive={currentView === 'complaints'} onClick={() => setCurrentView('complaints')} />
        
        {/* Disabled because settings page is not created yet */}
        <NavItem icon={<Settings size={20} />} label="Settings (Disabled)" disabled={true} />
      </nav>
    </aside>
  );
}