import React, { useEffect, useState } from 'react';
import { supabase } from './Comp/lib/supabaseClient';
import DashboardLayout from './pages/DashboardLayout';
import AdminLogin from './pages/AdminLogin';

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

  // Jab tak Supabase check kar raha hai, bilkul safed screen dikhaye (koi admin styling nahi)
  if (isChecking) {
    return <div className="h-screen w-screen bg-white dark:bg-slate-900"></div>;
  }

  // Agar user login NAI hai, toh AdminLogin page dikhaye
  if (!session) {
    return <AdminLogin />;
  }

  // Agar login ho gaya hai, toh apna Dashboard Layout dikhaye
  return (
    <DashboardLayout />
  );
}