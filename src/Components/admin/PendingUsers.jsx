import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toDateSafe } from '../../utils/date';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMail,
  FiGrid,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronDown,
  FiAlertCircle,
  FiUsers,
  FiEye,
  FiMoreHorizontal,
  FiUserCheck,
  FiUserX,
  FiCalendar,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { collection, query, orderBy, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../../firebase/config';
import { AUTO_APPROVED_EMAILS } from '../../utils/constants';
import toast from 'react-hot-toast';

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [expandedUser, setExpandedUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    if (!isFirebaseInitialized() || !db) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(usersQuery);
      const loadedUsers = snapshot.docs.map((docSnap) => {
        const userData = docSnap.data();
        return {
          id: docSnap.id,
          ...userData,
          appliedAt: toDateSafe(userData.createdAt),
        };
      });

      setUsers(loadedUsers);
      setLoading(false);

      // Auto-approve known testing emails if they are still pending
      loadedUsers.forEach((user) => {
        if (AUTO_APPROVED_EMAILS.includes(user.email?.toLowerCase()) && user.status !== 'active') {
          updateDoc(doc(db, 'users', user.id), {
            status: 'active',
            updatedAt: serverTimestamp(),
          }).catch(console.error);
        }
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load pending users');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setIsRefreshing(false);
    toast.success('List refreshed! 🔄');
  };

  const updateUserStatus = async (userId, updates) => {
    if (!isFirebaseInitialized() || !db) return;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)));
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
      throw err;
    }
  };

  const handleApprove = async (userId) => {
    const user = users.find((u) => u.id === userId);
    await updateUserStatus(userId, { status: 'active', approvedAt: serverTimestamp() });
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    toast.success(`${user?.displayName || user?.username || user?.email || 'User'} approved ✅`);
  };

  const handleReject = async (userId) => {
    const user = users.find((u) => u.id === userId);
    await updateUserStatus(userId, { status: 'rejected', rejectedAt: serverTimestamp() });
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    toast.success(`${user?.displayName || user?.username || user?.email || 'User'} rejected ❌`);
    setShowConfirmDialog(null);
  };

  const handleToggleVerified = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    await updateUserStatus(userId, { verified: !user.verified });
    toast.success(`Verification ${user.verified ? 'removed' : 'granted'} for ${user.displayName || user.email}`);
  };

  const handleBan = async (userId) => {
    const user = users.find((u) => u.id === userId);
    await updateUserStatus(userId, { status: 'banned' });
    toast.success(`${user?.displayName || user?.email || 'User'} banned`);
  };

  const handleUnban = async (userId) => {
    const user = users.find((u) => u.id === userId);
    await updateUserStatus(userId, { status: 'active' });
    toast.success(`${user?.displayName || user?.email || 'User'} unbanned`);
  };

  const handleApproveAll = async () => {
    const pendingCount = users.filter((u) => u.status === 'pending').length;
    if (pendingCount === 0) return;
    if (!window.confirm(`Approve all ${pendingCount} pending users?`)) return;

    for (const user of users.filter((u) => u.status === 'pending')) {
      await updateUserStatus(user.id, { status: 'active', approvedAt: serverTimestamp() });
    }

    setSelectedUsers(new Set());
    toast.success('All pending users approved 🎉');
  };

  const handleRejectAll = async () => {
    const pendingCount = users.filter((u) => u.status === 'pending').length;
    if (pendingCount === 0) return;
    if (!window.confirm(`Reject all ${pendingCount} pending users? This cannot be undone.`)) return;

    for (const user of users.filter((u) => u.status === 'pending')) {
      await updateUserStatus(user.id, { status: 'rejected', rejectedAt: serverTimestamp() });
    }

    setSelectedUsers(new Set());
    toast.success('All pending users rejected');
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected');
      return;
    }
    
    if (window.confirm(`Approve ${selectedUsers.size} selected users?`)) {
      for (const userId of selectedUsers) {
        await handleApprove(userId);
      }
      setSelectedUsers(new Set());
    }
  };

  const handleBulkReject = async () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected');
      return;
    }

    if (!window.confirm(`Reject ${selectedUsers.size} selected users?`)) return;

    for (const userId of selectedUsers) {
      await handleReject(userId);
    }

    setSelectedUsers(new Set());
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => user.status !== 'rejected')
    .filter((user) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        (user.displayName || user.username || user.email || '')
          .toLowerCase()
          .includes(search) ||
        (user.section || '').toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return toDateSafe(a.appliedAt) - toDateSafe(b.appliedAt);
        case 'name':
          return (a.displayName || a.username || a.email)
            .localeCompare(b.displayName || b.username || b.email);
        case 'section':
          return (a.section || '').localeCompare(b.section || '');
        default: // newest
          return toDateSafe(b.appliedAt) - toDateSafe(a.appliedAt);
      }
    });

  // Statistics
  const stats = {
    total: users.length,
    today: users.filter((u) => {
      const today = new Date();
      const userDate = toDateSafe(u.appliedAt);
      return userDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: users.filter((u) => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return toDateSafe(u.appliedAt) > weekAgo;
    }).length,
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700/50" />
              <div className="flex-1 space-y-2">
                <div className="w-48 h-4 rounded bg-gray-700/50" />
                <div className="w-32 h-3 rounded bg-gray-700/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FiUsers className="text-yellow-400" />
            Pending Approvals
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Review and manage new user registrations
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

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Pending', value: stats.total, icon: FiClock, color: 'from-yellow-500 to-amber-500' },
          { label: 'Today', value: stats.today, icon: FiCalendar, color: 'from-blue-500 to-cyan-500' },
          { label: 'This Week', value: stats.thisWeek, icon: FiUsers, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card text-center"
          >
            <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
              {(() => {
                const Icon = stat.icon;
                return <Icon className="text-white text-sm" />;
              })()}
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or section..."
            className="glass-input pl-10 pr-4 py-2.5 text-sm w-full"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="glass-input py-2.5 px-4 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
          <option value="section">By Section</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <span className="text-sm text-purple-400 font-medium">
            {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkApprove}
              className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <FiCheck />
              Approve Selected
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkReject}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <FiX />
              Reject Selected
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Users List */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-500 checked:bg-purple-500"
              />
              <span className="text-sm text-[var(--text-secondary)]">Select All</span>
            </label>
            {filteredUsers.length > 0 && (
              <span className="text-xs text-[var(--text-secondary)]">
                {filteredUsers.length} user{filteredUsers.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {filteredUsers.length > 0 && (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApproveAll}
                  className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-xs"
                >
                  Approve All
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRejectAll}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs"
                >
                  Reject All
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <FiCheckCircle className="text-3xl text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              All Clear!
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              {searchTerm 
                ? 'No users match your search criteria'
                : 'No pending user approvals at the moment'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  {/* User Card */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      expandedUser === user.id
                        ? 'bg-[var(--bg-tertiary)] border-purple-500/30'
                        : 'bg-[var(--bg-tertiary)] border-[var(--glass-border)] hover:border-purple-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 rounded border-gray-500 checked:bg-purple-500 flex-shrink-0"
                      />

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {(user.displayName || user.username || user.email || 'U').charAt(0).toUpperCase()}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[var(--text-primary)] text-sm truncate">
                            {user.displayName || user.username || user.email}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                            user.status === 'active'
                              ? 'bg-green-500/10 text-green-300'
                              : user.status === 'banned'
                              ? 'bg-red-500/10 text-red-300'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {user.status?.replace('_', ' ') || 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                            <FiMail className="text-xs" />
                            {user.email}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                            <FiGrid className="text-xs" />
                            {user.section}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                          <FiClock className="text-xs" />
                            Applied {formatDistanceToNow(toDateSafe(user.appliedAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all"
                          title="View details"
                        >
                          <FiEye className="text-sm" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(user.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          <FiUserCheck className="text-xs" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleVerified(user.id)}
                          className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium flex items-center gap-1 ${
                            user.verified ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-slate-500/10 text-slate-200 hover:bg-slate-500/20'
                          }`}
                        >
                          <FiCheckCircle className="text-xs" />
                          {user.verified ? 'Unverify' : 'Verify'}
                        </motion.button>
                        {user.status === 'banned' ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUnban(user.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors text-xs font-medium"
                          >
                            Unban
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleBan(user.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs font-medium"
                          >
                            Ban
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowConfirmDialog(user.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          <FiUserX className="text-xs" />
                          Reject
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedUser === user.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Full Name</p>
                                <p className="text-sm text-[var(--text-primary)]">{user.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Email</p>
                                <p className="text-sm text-[var(--text-primary)]">{user.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Section</p>
                                <p className="text-sm text-[var(--text-primary)]">{user.section}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Reason</p>
                                <p className="text-sm text-[var(--text-primary)]">{user.reason}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Applied</p>
                                <p className="text-sm text-[var(--text-primary)]">
                                  {formatDistanceToNow(toDateSafe(user.appliedAt), { addSuffix: true })}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Status</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  user.status === 'active'
                                    ? 'bg-green-500/10 text-green-300'
                                    : user.status === 'banned'
                                    ? 'bg-red-500/10 text-red-300'
                                    : 'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                  {user.status?.replace('_', ' ') || 'Pending'}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Verified badge</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  user.verified
                                    ? 'bg-blue-500/10 text-blue-300'
                                    : 'bg-slate-500/10 text-slate-300'
                                }`}>
                                  {user.verified ? 'Verified' : 'Not verified'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-sm w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiAlertCircle className="text-2xl text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Confirm Rejection
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Are you sure you want to reject this user? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmDialog(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(showConfirmDialog)}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    Reject User
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingUsers;