import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiUsers,
  FiFlag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiHome,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_EMAIL } from '../utils/constants';
import AdminDashboard from '../components/admin/AdminDashboard';
import PendingUsers from '../components/admin/PendingUsers';
import ReportsPanel from '../components/admin/ReportsPanel';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      toast.error('Access denied. Admin only.');
      navigate('/feed');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { id: 'pending', label: 'Pending Users', icon: FiUsers },
    { id: 'reports', label: 'Reports', icon: FiFlag },
  ];

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <FiShield className="text-3xl text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Redirecting...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: isSidebarOpen ? 0 : -300,
          }}
          className={`fixed lg:static left-0 top-0 h-screen w-64 z-50 lg:z-0 glass-morphism border-r border-[var(--glass-border)] flex flex-col transition-transform lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CONFERIA
              </h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-medium text-purple-400">Admin Mode</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon className="text-lg" />
                {tab.label}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[var(--glass-border)] space-y-2">
            <button
              onClick={() => navigate('/feed')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
            >
              <FiHome className="text-lg" />
              Back to Feed
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <FiLogOut className="text-lg" />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-30 glass-morphism border-b border-[var(--glass-border)] px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {tabs.find(t => t.id === activeTab)?.label || 'Admin'}
              </h2>
              <div className="w-10" />
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-8 pb-24 lg:pb-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'pending' && <PendingUsers />}
              {activeTab === 'reports' && <ReportsPanel />}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;