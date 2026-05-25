import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2,
  FiBarChart2,
  FiMessageSquare,
  FiTrendingUp,
  FiClock,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiMoreHorizontal,
  FiX,
  FiChevronDown,
  FiActivity,
  FiFlag,
  FiThumbsUp,
  FiMessageCircle,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { toDateSafe } from '../../utils/date';
import { ADMIN_EMAIL } from '../../utils/constants';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { db, storage } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    setAvatarPreview(user?.avatar || '');
  }, [user]);

  useEffect(() => {
    if (!db) return;

    const usersRef = collection(db, 'users');
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const loadedUsers = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.realName || data.displayName || data.username || data.email?.split('@')[0] || 'User',
          email: data.email || '',
          section: data.section || '',
          status: data.status || 'pending',
          posts: Number(data.posts || 0),
          joinedAt: toDateSafe(data.createdAt),
          ...data,
        };
      });

      setAllUsers(loadedUsers);
      setPendingUsers(loadedUsers.filter((u) => u.status === 'pending'));
    }, (err) => {
      console.error('Error listening for users:', err);
      toast.error('Failed to load users');
    });

    const reportsRef = collection(db, 'reports');
    const reportsQuery = query(reportsRef, orderBy('createdAt', 'desc'));

    const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
      const loadedReports = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: toDateSafe(data.createdAt),
          reportedBy: Array.isArray(data.reportedBy) ? data.reportedBy : [],
          status: data.status || 'pending',
        };
      });

      setReportedPosts(loadedReports);
    }, (err) => {
      console.error('Error listening for reports:', err);
      toast.error('Failed to load reports');
    });

    return () => {
      unsubscribeUsers();
      unsubscribeReports();
    };
  }, []);

  // Stats calculations
  const stats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.status === 'active').length,
    bannedUsers: allUsers.filter(u => u.status === 'banned').length,
    pendingApprovals: pendingUsers.length,
    reportedPosts: reportedPosts.length,
    totalPosts: allUsers.reduce((sum, u) => sum + u.posts, 0),
  };

  const handleApprove = async (userId) => {
    if (!db) {
      toast.error('Firestore unavailable');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'active',
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('User approved successfully! ✅');
    } catch (err) {
      console.error('Error approving user:', err);
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;
    if (!db) {
      toast.error('Firestore unavailable');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('User rejected');
    } catch (err) {
      console.error('Error rejecting user:', err);
      toast.error('Failed to reject user');
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Ban this user? They will not be able to access the platform.')) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'banned',
        updatedAt: serverTimestamp(),
      });
      toast.success('User banned successfully');
    } catch (err) {
      console.error('Error banning user:', err);
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'active',
        updatedAt: serverTimestamp(),
      });
      toast.success('User unbanned');
    } catch (err) {
      console.error('Error unbanning user:', err);
      toast.error('Failed to unban user');
    }
  };

  const handleDeletePost = async (reportId) => {
    if (!window.confirm('Delete this reported post?')) return;

    try {
      const report = reportedPosts.find((item) => item.id === reportId);
      if (report?.postId && db) {
        await deleteDoc(doc(db, 'posts', report.postId));
      }
      if (!db) {
        toast.error('Firestore unavailable');
        return;
      }
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Post deleted successfully');
    } catch (err) {
      console.error('Error deleting reported post:', err);
      toast.error('Failed to delete reported post');
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: 'dismissed',
        dismissedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Report dismissed');
    } catch (err) {
      console.error('Error dismissing report:', err);
      toast.error('Failed to dismiss report');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Dashboard refreshed! 🔄');
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'pending', label: 'Pending', icon: FiClock, count: pendingUsers.length },
    { id: 'reports', label: 'Reports', icon: FiFlag, count: reportedPosts.length },
    { id: 'users', label: 'Users', icon: FiUsers },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FiShield className="text-purple-400" />
            Admin Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage users, posts, and moderation
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="glass-button text-white px-4 py-2 flex items-center gap-2 text-sm"
        >
          <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
          Refresh
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'from-blue-500 to-cyan-500', change: '+12%' },
          { label: 'Active', value: stats.activeUsers, icon: FiUserCheck, color: 'from-green-500 to-emerald-500', change: '+5%' },
          { label: 'Banned', value: stats.bannedUsers, icon: FiUserX, color: 'from-red-500 to-rose-500', change: '-2%' },
          { label: 'Pending', value: stats.pendingApprovals, icon: FiClock, color: 'from-yellow-500 to-amber-500', change: '+3' },
          { label: 'Reports', value: stats.reportedPosts, icon: FiFlag, color: 'from-orange-500 to-red-500', change: '-1' },
          { label: 'Posts', value: stats.totalPosts, icon: FiMessageSquare, color: 'from-purple-500 to-pink-500', change: '+24' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
              {(() => {
                const Icon = stat.icon;
                return <Icon className="text-white text-sm" />;
              })()}
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'glass-button text-white'
                : 'glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {(() => { const Icon = tab.icon; return <Icon className="text-base" />; })()}
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Recent Activity */}
            <div className="glass-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiActivity className="text-purple-400" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {[
                  { icon: FiUserCheck, text: 'New user registration', time: '5 minutes ago', color: 'text-green-400' },
                  { icon: FiFlag, text: 'Post reported by Anonymous 45', time: '12 minutes ago', color: 'text-red-400' },
                  { icon: FiMessageSquare, text: '50th post published today', time: '1 hour ago', color: 'text-blue-400' },
                  { icon: FiThumbsUp, text: 'Trending post reached 200 likes', time: '2 hours ago', color: 'text-purple-400' },
                  { icon: FiMessageCircle, text: 'Comment thread with 50+ replies', time: '3 hours ago', color: 'text-green-400' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]"
                  >
                    {(() => { const Icon = activity.icon; return <Icon className={`text-lg ${activity.color}`} />; })()}
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text-primary)]">{activity.text}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Approve All', icon: FiCheckCircle, color: 'text-green-400', onClick: () => {} },
                { label: 'View Reports', icon: FiEye, color: 'text-blue-400', onClick: () => setActiveTab('reports') },
                { label: 'Manage Users', icon: FiUsers, color: 'text-purple-400', onClick: () => setActiveTab('users') },
                { label: 'Clear All', icon: FiTrash2, color: 'text-red-400', onClick: () => {} },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="glass-card flex items-center gap-3 p-4"
                >
                  {(() => { const Icon = action.icon; return <Icon className={`text-xl ${action.color}`} />; })()}
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pending Users Tab */}
        {activeTab === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiClock className="text-yellow-400" />
                  Pending Approvals ({pendingUsers.length})
                </h2>
                {pendingUsers.length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      pendingUsers.forEach(u => handleApprove(u.id));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors"
                  >
                    Approve All
                  </motion.button>
                )}
              </div>

              {pendingUsers.length === 0 ? (
                <div className="text-center py-8">
                  <FiCheckCircle className="text-3xl text-green-400 mx-auto mb-2" />
                  <p className="text-[var(--text-secondary)]">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--glass-border)]"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-[var(--text-primary)] text-sm">
                            {user.name}
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {user.section} • {user.email}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Applied {formatDistanceToNow(toDateSafe(user.appliedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(user.id)}
                          className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium"
                        >
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(user.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                        >
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass-card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiFlag className="text-red-400" />
                Reported Posts ({reportedPosts.length})
              </h2>

              {reportedPosts.length === 0 ? (
                <div className="text-center py-8">
                  <FiCheckCircle className="text-3xl text-green-400 mx-auto mb-2" />
                  <p className="text-[var(--text-secondary)]">No reported posts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportedPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-red-500/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle className="text-red-400" />
                          <span className="text-sm font-medium text-red-400">
                            {post.reason}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                            {post.reports} reports
                          </span>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {formatDistanceToNow(toDateSafe(post.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-sm text-[var(--text-primary)] mb-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <span>By {post.user}</span>
                          <span>•</span>
                          <span>Reported by {post.reportedBy.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDismissReport(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-gray-500/20 text-[var(--text-secondary)] hover:bg-gray-500/30 transition-colors text-xs"
                          >
                            Dismiss
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeletePost(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs flex items-center gap-1"
                          >
                            <FiTrash2 className="text-xs" />
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiUsers className="text-purple-400" />
                  All Users ({filteredUsers.length})
                </h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users..."
                      className="glass-input pl-9 pr-4 py-2 text-sm w-full sm:w-48"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="glass-input py-2 px-3 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-secondary)]">User</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-secondary)]">Section</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-secondary)]">Posts</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[var(--text-secondary)]">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-[var(--text-secondary)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[var(--glass-border)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                              <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">{user.section}</td>
                        <td className="py-3 px-4 text-sm text-[var(--text-primary)]">{user.posts}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {user.status === 'active' ? (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleBanUser(user.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs"
                            >
                              Ban
                            </motion.button>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUnbanUser(user.id)}
                              className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-xs"
                            >
                              Unban
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;