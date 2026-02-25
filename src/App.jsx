import React, { useEffect, useState } from 'react';
import { supabase } from './Comp/lib/supabaseClient';
import DashboardLayout from './pages/DashboardLayout';

export default function App() {
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Shuru mein current session check karein
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsChecking(false); // Checking khatam ho gayi
    });

    // Jab koi login ya logout kare, toh automatically update ho jaye
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Jab tak Supabase check kar raha hai, thoda wait (loading) dikhaye
  if (isChecking) {
    return (
      <div className="h-screen w-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading Admin Panel...</p>
      </div>
    );
  }

  // Agar user login NAI hai (ya logout ho gaya hai), toh usay FORAN User Site par bhej dein
  if (!session) {
    window.location.href = 'https://saylani-hub-orpin.vercel.app/';
    return null; // Jab tak redirect ho raha hai, blank screen show kare
  }

  // Agar admin login hai, toh apna Dashboard Layout dikhaye
  return (
    <DashboardLayout />
  );
}