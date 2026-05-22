import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
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
import toast from 'react-hot-toast';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [expandedUser, setExpandedUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);

  // Load pending users
  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    setLoading(true);
    // Firebase Firestore integration will be here
    // const snapshot = await getDocs(query(collection(db, 'users'), where('status', '==', 'pending')));
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setPendingUsers([
      {
        id: 'p1',
        name: 'Aditya Kumar',
        email: 'aditya.k@college.edu',
        section: 'CSE-2nd Year',
        appliedAt: new Date(Date.now() - 3600000 * 3),
        reason: 'New student registration',
        verificationStatus: 'pending',
      },
      {
        id: 'p2',
        name: 'Zara Sheikh',
        email: 'zara.s@college.edu',
        section: 'ECE-A',
        appliedAt: new Date(Date.now() - 3600000 * 5),
        reason: 'New student registration',
        verificationStatus: 'pending',
      },
      {
        id: 'p3',
        name: 'Mohammed Ali',
        email: 'mohammed.a@college.edu',
        section: 'MECH-3rd Year',
        appliedAt: new Date(Date.now() - 3600000 * 8),
        reason: 'New student registration',
        verificationStatus: 'pending',
      },
      {
        id: 'p4',
        name: 'Ananya Gupta',
        email: 'ananya.g@college.edu',
        section: 'IT-B',
        appliedAt: new Date(Date.now() - 3600000 * 12),
        reason: 'Transfer student',
        verificationStatus: 'pending',
      },
      {
        id: 'p5',
        name: 'Rohan Deshmukh',
        email: 'rohan.d@college.edu',
        section: 'CIVIL-4th Year',
        appliedAt: new Date(Date.now() - 3600000 * 24),
        reason: 'New student registration',
        verificationStatus: 'pending',
      },
      {
        id: 'p6',
        name: 'Neha Kapoor',
        email: 'neha.k@college.edu',
        section: 'EEE-B',
        appliedAt: new Date(Date.now() - 3600000 * 36),
        reason: 'Re-registration',
        verificationStatus: 'pending',
      },
      {
        id: 'p7',
        name: 'Amit Verma',
        email: 'amit.v@college.edu',
        section: 'CSE-C',
        appliedAt: new Date(Date.now() - 3600000 * 48),
        reason: 'New student registration',
        verificationStatus: 'pending',
      },
    ]);
    
    setLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPendingUsers();
    setIsRefreshing(false);
    toast.success('List refreshed! 🔄');
  };

  const handleApprove = async (userId) => {
    // Firebase: Update user status to 'active'
    // await updateDoc(doc(db, 'users', userId), { status: 'active', approvedAt: new Date() });
    
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    
    const user = pendingUsers.find(u => u.id === userId);
    toast.success(`${user?.name || 'User'} approved successfully! ✅`, {
      duration: 3000,
    });
  };

  const handleReject = async (userId) => {
    // Firebase: Update user status to 'rejected'
    // await updateDoc(doc(db, 'users', userId), { status: 'rejected', rejectedAt: new Date() });
    
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    
    const user = pendingUsers.find(u => u.id === userId);
    toast.success(`${user?.name || 'User'} rejected`, {
      icon: '❌',
    });
    setShowConfirmDialog(null);
  };

  const handleApproveAll = async () => {
    if (pendingUsers.length === 0) return;
    
    if (window.confirm(`Approve all ${pendingUsers.length} pending users?`)) {
      // Firebase: Batch update
      for (const user of pendingUsers) {
        await handleApprove(user.id);
      }
      setPendingUsers([]);
      setSelectedUsers(new Set());
      toast.success('All users approved! 🎉');
    }
  };

  const handleRejectAll = async () => {
    if (pendingUsers.length === 0) return;
    
    if (window.confirm(`Reject all ${pendingUsers.length} pending users? This cannot be undone.`)) {
      // Firebase: Batch update
      for (const user of pendingUsers) {
        await handleReject(user.id);
      }
      setPendingUsers([]);
      setSelectedUsers(new Set());
      toast.success('All users rejected');
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
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
    
    if (window.confirm(`Reject ${selectedUsers.size} selected users?`)) {
      for (const userId of selectedUsers) {
        await handleReject(userId);
      }
      setSelectedUsers(new Set());
    }
  };

  // Filter and sort users
  const filteredUsers = pendingUsers
    .filter(user => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.section.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.appliedAt) - new Date(b.appliedAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'section':
          return a.section.localeCompare(b.section);
        default: // newest
          return new Date(b.appliedAt) - new Date(a.appliedAt);
      }
    });

  // Statistics
  const stats = {
    total: pendingUsers.length,
    today: pendingUsers.filter(u => {
      const today = new Date();
      const userDate = new Date(u.appliedAt);
      return userDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: pendingUsers.filter(u => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(u.appliedAt) > weekAgo;
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
              <stat.icon className="text-white text-sm" />
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
                        {user.name.charAt(0)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[var(--text-primary)] text-sm truncate">
                            {user.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs flex-shrink-0">
                            Pending
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
                          Applied {formatDistanceToNow(user.appliedAt, { addSuffix: true })}
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
                                  {formatDistanceToNow(user.appliedAt, { addSuffix: true })}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[var(--text-secondary)] mb-1">Status</p>
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
                                  Awaiting Review
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
              className="glass-card max-w-sm w-full"
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