import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/Comp/lib/supabaseClient';
import { Users, AlertCircle, MessageSquare, Loader2, Clock } from 'lucide-react';
// Naye Components Import kiye
import PageHeader from '../Comp/DashboardComp/PageHeader';
import StatCard from '../Comp/DashboardComp/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState({ volunteers: 0, complaints: 0, messages: 0 });
  const [recentVolunteers, setRecentVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Counts lana
    const { count: volCount } = await supabase.from('volunteer_applications').select('*', { count: 'exact', head: true });
    const { count: compCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
    const { count: msgCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });

    setStats({ volunteers: volCount || 0, complaints: compCount || 0, messages: msgCount || 0 });

    // 2. Haaliya 3 Volunteers lana (For Recent Activity Section)
    const { data: recentVols } = await supabase
      .from('volunteer_applications')
      .select('id, full_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
      
    if(recentVols) setRecentVolunteers(recentVols);

    setLoading(false);
  };

  if (loading) {
    return <div className="flex h-full min-h-[60vh] items-center justify-center"><Loader2 className="w-16 h-16 animate-spin text-[#014990]" /></div>;
  }

  return (
    <div className="animate-page-fade font-sans">
      
      {/* REUSABLE HEADER COMPONENT */}
      <PageHeader 
        title="Dashboard Overview" 
        subtitle="Welcome back, Admin! Here's a look at your platform's performance today."
      />

      {/* MODERN STATS GRID (Using StatCard Component) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Volunteers" 
          count={stats.volunteers} 
          icon={Users} 
          variant="green" // Saylani Green Theme
        />
        <StatCard 
          title="Pending Complaints" 
          count={stats.complaints} 
          icon={AlertCircle} 
          variant="orange" // Warning Theme
        />
        <StatCard 
          title="New Messages" 
          count={stats.messages} 
          icon={MessageSquare} 
          variant="blue" // Saylani Blue Theme
        />
      </div>

      {/* RECENT ACTIVITY SECTION (Bonus Design) */}
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <Clock className="text-[#014990]" /> Recent Registrations
          </h3>
          <button className="text-sm font-bold text-[#014990] hover:underline">View All</button>
        </div>

        {recentVolunteers.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {recentVolunteers.map((vol) => (
              <div key={vol.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#014990]/10 text-[#014990] flex items-center justify-center font-bold">
                    {vol.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{vol.full_name}</h4>
                    <p className="text-xs text-gray-500">{new Date(vol.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  vol.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                  vol.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {vol.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;