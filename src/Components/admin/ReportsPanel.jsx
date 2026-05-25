import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toDateSafe } from '../../utils/date';
import {
  FiFlag,
  FiAlertTriangle,
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiChevronDown,
  FiUser,
  FiMessageSquare,
  FiClock,
  FiMoreHorizontal,
  FiShield,
  FiAlertCircle,
  FiInfo,
  FiUsers,
  FiThumbsDown,
  FiExternalLink,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../../firebase/config';
import toast from 'react-hot-toast';

const ReportsPanel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterReason, setFilterReason] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReport, setExpandedReport] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [selectedReports, setSelectedReports] = useState(new Set());

  // Load reports
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    if (!isFirebaseInitialized() || !db) {
      setReports([]);
      setLoading(false);
      return;
    }

    try {
      const reportsRef = collection(db, 'reports');
      const reportsQuery = query(reportsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(reportsQuery);

      const loadedReports = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: toDateSafe(data.createdAt),
          reportedBy: Array.isArray(data.reportedBy) ? data.reportedBy : [],
          reason: data.reason || 'Report',
          status: data.status || 'pending',
        };
      });

      setReports(loadedReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadReports();
    setIsRefreshing(false);
    toast.success('Reports refreshed! 🔄');
  };

  const handleDeletePost = async (reportId) => {
    if (!window.confirm('Delete this reported post?')) return;

    try {
      const report = reports.find((item) => item.id === reportId);
      if (report?.postId && isFirebaseInitialized() && db) {
        await deleteDoc(doc(db, 'posts', report.postId));
      }
      if (isFirebaseInitialized() && db) {
        await updateDoc(doc(db, 'reports', reportId), {
          status: 'resolved',
          resolvedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast.success('Post deleted and report resolved! 🗑️');
      setShowConfirmDialog(null);
    } catch (err) {
      console.error('Error deleting reported post:', err);
      toast.error('Failed to delete reported post');
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      if (isFirebaseInitialized() && db) {
        await updateDoc(doc(db, 'reports', reportId), {
          status: 'dismissed',
          dismissedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'dismissed', dismissedAt: new Date() }
            : r
        )
      );
      toast.success('Report dismissed');
    } catch (err) {
      console.error('Error dismissing report:', err);
      toast.error('Failed to dismiss report');
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      if (isFirebaseInitialized() && db) {
        await updateDoc(doc(db, 'reports', reportId), {
          status: 'resolved',
          resolvedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'resolved', resolvedAt: new Date() }
            : r
        )
      );
      toast.success('Report resolved! ✅');
    } catch (err) {
      console.error('Error resolving report:', err);
      toast.error('Failed to resolve report');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReports.size === 0) {
      toast.error('No reports selected');
      return;
    }
    
    if (window.confirm(`Delete posts for ${selectedReports.size} selected reports?`)) {
      for (const reportId of selectedReports) {
        await handleDeletePost(reportId);
      }
      setSelectedReports(new Set());
      toast.success('All selected posts deleted');
    }
  };

  const handleBulkDismiss = () => {
    if (selectedReports.size === 0) {
      toast.error('No reports selected');
      return;
    }
    
    if (window.confirm(`Dismiss ${selectedReports.size} selected reports?`)) {
      for (const reportId of selectedReports) {
        handleDismissReport(reportId);
      }
      setSelectedReports(new Set());
      toast.success('All selected reports dismissed');
    }
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      if (filterStatus !== 'all' && report.status !== filterStatus) return false;
      if (filterReason !== 'all' && report.reason !== filterReason) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          report.content.toLowerCase().includes(search) ||
          report.reportedUser.toLowerCase().includes(search) ||
          report.reason.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return toDateSafe(a.timestamp) - toDateSafe(b.timestamp);
        case 'reports':
          return b.reports - a.reports;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return toDateSafe(b.timestamp) - toDateSafe(a.timestamp);
      }
    });

  // Statistics
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    critical: reports.filter(r => r.priority === 'critical').length,
  };

  // Get unique reasons for filter
  const reasons = ['all', ...new Set(reports.map(r => r.reason))];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400';
      case 'resolved': return 'bg-green-500/10 text-green-400';
      case 'dismissed': return 'bg-gray-500/10 text-gray-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-20 h-5 rounded bg-gray-700/50" />
                <div className="w-16 h-5 rounded bg-gray-700/50" />
              </div>
              <div className="w-full h-4 rounded bg-gray-700/50" />
              <div className="w-3/4 h-4 rounded bg-gray-700/50" />
              <div className="flex gap-2">
                <div className="w-20 h-8 rounded bg-gray-700/50" />
                <div className="w-20 h-8 rounded bg-gray-700/50" />
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
            <FiFlag className="text-red-400" />
            Reported Posts
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Review and manage reported content
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: stats.total, icon: FiFlag, color: 'from-purple-500 to-pink-500' },
          { label: 'Pending', value: stats.pending, icon: FiAlertCircle, color: 'from-yellow-500 to-amber-500' },
          { label: 'Resolved', value: stats.resolved, icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'Critical', value: stats.critical, icon: FiAlertTriangle, color: 'from-red-500 to-rose-500' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports..."
            className="glass-input pl-10 pr-4 py-2.5 text-sm w-full"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="glass-input py-2.5 px-4 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
          className="glass-input py-2.5 px-4 text-sm"
        >
          {reasons.map(reason => (
            <option key={reason} value={reason}>
              {reason === 'all' ? 'All Reasons' : reason}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="glass-input py-2.5 px-4 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="reports">Most Reports</option>
          <option value="priority">By Priority</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedReports.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"
        >
          <span className="text-sm text-purple-400 font-medium">
            {selectedReports.size} report{selectedReports.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkDismiss}
              className="px-4 py-2 rounded-lg bg-gray-500/20 text-[var(--text-secondary)] hover:bg-gray-500/30 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <FiX />
              Dismiss Selected
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <FiTrash2 />
              Delete Posts
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <FiCheckCircle className="text-3xl text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              All Clear!
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              {searchTerm || filterStatus !== 'all' || filterReason !== 'all'
                ? 'No reports match your filters'
                : 'No reported posts at the moment'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="glass-card">
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedReports.has(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        className="w-4 h-4 rounded border-gray-500 checked:bg-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)]">
                        {formatDistanceToNow(toDateSafe(report.timestamp), { addSuffix: true })}
                      </span>
                      <button
                        onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                        className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <FiChevronDown
                          className={`text-sm transition-transform ${
                            expandedReport === report.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Report Content */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiAlertTriangle className="text-red-400 text-sm" />
                      <span className="text-sm font-medium text-red-400">{report.reason}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                        {report.reports} report{report.reports > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-tertiary)] p-3 rounded-lg">
                      {report.content}
                    </p>
                  </div>

                  {/* Report Meta */}
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiUser className="text-xs" />
                        Posted by {report.reportedUser}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {formatDistanceToNow(toDateSafe(report.postTimestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <FiUsers className="text-xs" />
                      {report.reportedBy.length} reporter{report.reportedBy.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--glass-border)]">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDismissReport(report.id)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-500/10 text-[var(--text-secondary)] hover:bg-gray-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <FiX className="text-sm" />
                        Dismiss
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowConfirmDialog(report.id)}
                        className="flex-1 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <FiTrash2 className="text-sm" />
                        Delete Post
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                        className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        <FiEye className="text-sm" />
                        Details
                      </motion.button>
                    </div>
                  )}

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedReport === report.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <FiUsers className="text-purple-400" />
                            Reporters ({report.reportedBy.length})
                          </h4>
                          <div className="space-y-2">
                            {report.reportedBy.map((reporter, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-primary)]"
                              >
                                <span className="text-sm text-[var(--text-primary)]">
                                  {reporter.username}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                                  {reporter.reason}
                                </span>
                              </div>
                            ))}
                          </div>

                          {report.resolvedAt && (
                            <div className="mt-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                              <p className="text-xs text-green-400 flex items-center gap-1">
                                <FiCheckCircle />
                                Resolved {formatDistanceToNow(toDateSafe(report.resolvedAt), { addSuffix: true })}
                              </p>
                            </div>
                          )}
                          {report.dismissedAt && (
                            <div className="mt-3 p-3 rounded-lg bg-gray-500/5 border border-gray-500/10">
                              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                <FiInfo />
                                Dismissed {formatDistanceToNow(toDateSafe(report.dismissedAt), { addSuffix: true })}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <FiAlertTriangle className="text-3xl text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Delete Reported Post?
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  This will permanently delete the post and resolve all associated reports.
                </p>
                <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] mb-4">
                  <p className="text-xs text-[var(--text-secondary)] text-left">
                    {reports.find(r => r.id === showConfirmDialog)?.content?.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmDialog(null)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeletePost(showConfirmDialog)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <FiTrash2 />
                    Delete Post
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

export default ReportsPanel;