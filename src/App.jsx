import React, { useEffect, useState } from 'react';
import { supabase } from './Comp/lib/supabaseClient';
import DashboardLayout from './pages/DashboardLayout';

export default function App() {
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsChecking(false); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <div className="h-screen w-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading Admin Panel...</p>
      </div>
    );
  }

  // Agar user login NAI hai (toh usay FORAN User Site par bhej dein)
  if (!session) {
    window.location.replace('https://saylani-hub-orpin.vercel.app/');
    return null; 
  }

  // Agar login hai toh Dashboard dikhaye
  return (
    <DashboardLayout />
  );
}