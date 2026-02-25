import React, { useEffect, useState } from 'react';
import { supabase } from '../Comp/lib/supabaseClient';
import { Trash2, CheckCircle, Search, Clock } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' ya 'approved'

  const fetchUsers = async () => {
    setLoading(true);
    // Real data fetch kar rahe hain
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      // Agar database mein status column nahi hai to default 'pending' maan lenge
      const formattedData = data.map(u => ({ ...u, status: u.status || 'pending' }));
      setUsers(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this user?");
    if (!confirmApprove) return;

    // Supabase mein status update karega
    const { error } = await supabase.from('profiles').update({ status: 'approved' }).eq('id', id);
    if (!error) {
      fetchUsers(); // Data refresh karega
    } else {
      alert("Error approving user!");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) fetchUsers();
  };

  // Search aur Tab (Status) ke hisab se data filter karna
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = user.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm transition-colors duration-300">
        
        {/* --- TABS FOR PENDING / APPROVED --- */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
          >
            <Clock size={16} /> Pending Users
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'approved' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
          >
            <CheckCircle size={16} /> Approved
          </button>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="relative w-full md:w-64 text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-200">
          <Search size={18} className="absolute top-2.5 left-3"/>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-slate-700 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none dark:text-white transition-colors" 
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400">No {activeTab} users found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-slate-700">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Email/Name</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="font-semibold">{user.email || 'No Email'}</div>
                      <div className="text-xs text-gray-500">{user.name || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right flex justify-end space-x-2">
                      {activeTab === 'pending' && (
                        <button onClick={() => handleApprove(user.id)} className="text-emerald-500 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20" title="Approve User">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete User">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}