import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiGrid, 
  FiSettings,
  FiShield,
  FiClock,
  FiMessageSquare,
  FiHeart,
  FiEdit2,
  FiLogOut,
  FiAlertCircle,
  FiCheckCircle,
  FiCopy,
  FiInfo,
  FiPlus,
} from 'react-icons/fi';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../firebase/config';
import { getRandomAvatar } from '../utils/avatarGenerator';
import { generateUsername } from '../utils/usernameGenerator';
import { useAuth } from '../hooks/useAuth.jsx';
import { ADMIN_EMAIL } from '../utils/constants';
import { formatDistanceToNow } from 'date-fns';
import { toDateSafe } from '../utils/date';
import toast from 'react-hot-toast';
import CreatePostModal from '../Components/feed/CreatePostModal';
import { usePosts } from '../hooks/usePosts';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    memberSince: toDateSafe(user?.createdAt),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addPost } = usePosts('latest');

  const avatar = user?.avatar || getRandomAvatar(user?.uid || 'default');
  const username = user?.username || generateUsername(user?.uid || 'default');
  const isAdmin = user?.email === ADMIN_EMAIL;
  const isVerified = user?.verified;

  useEffect(() => {
    if (!user?.uid || !isFirebaseInitialized() || !db) {
      setUserPosts([]);
      return;
    }

    const postsRef = collection(db, 'posts');
    const postsQuery = query(
      postsRef,
      where('userId', '==', user.uid),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((docSnap) => {
        const postData = docSnap.data();
        return {
          id: docSnap.id,
          ...postData,
          createdAt: toDateSafe(postData.createdAt),
          comments: Array.isArray(postData.comments) ? postData.comments : [],
        };
      });

      setUserPosts(postsData);
      setStats({
        totalPosts: postsData.length,
        totalLikes: postsData.reduce((sum, post) => sum + (post.likes || 0), 0),
        totalComments: postsData.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
        memberSince: toDateSafe(user?.createdAt),
      });
    }, (err) => {
      console.error('Failed to load profile posts:', err);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(username);
    toast.success('Username copied! 📋');
  };

  const handlePostSubmit = async (content) => {
    try {
      await addPost(content);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error posting from profile:', err);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
      toast.success('Signed out successfully');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 pb-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your anonymous identity
        </p>
      </motion.div>

      <div className="glass-card bg-black/90 border border-white/10 text-white p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[.3em] text-white/70 mb-2">Conferia</p>
            <h2 className="text-xl font-semibold">Anonymous posting backed by verified moderation</h2>
            <p className="text-xs text-white/70 mt-1 max-w-xl">
              Your private profile is only visible to you and administrators. Verified students earn a trusted badge across the network.
            </p>
          </div>
          <div className="text-right text-xs text-white/60">
            <span className="block">Real Firebase profile data</span>
            <span className="block">Auto-approved users: test102@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card relative overflow-hidden mb-6"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
        
        {/* Profile Header */}
        <div className="text-center pt-6 pb-4">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="relative inline-block"
          >
            <img
              src={avatar}
              alt={username}
              className="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] border-4 border-[var(--glass-border)] mx-auto"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[var(--bg-primary)]" />
          </motion.div>

          {/* Username */}
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{username}</h2>
              {isVerified && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 font-medium">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Your anonymous identity on campus
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {isAdmin && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-1">
                <FiShield className="text-xs" />
                Admin
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              isVerified ? 'bg-blue-500/10 text-blue-300' : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              <FiCheckCircle className="text-xs" />
              {isVerified ? 'Verified Student' : 'Pending Verification'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-[var(--glass-border)]">
          {[
            { label: 'Posts', value: stats.totalPosts, icon: FiMessageSquare, color: 'text-blue-400' },
            { label: 'Likes', value: stats.totalLikes, icon: FiHeart, color: 'text-red-400' },
            { label: 'Comments', value: stats.totalComments, icon: FiMessageSquare, color: 'text-green-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              {(() => {
                const Icon = stat.icon;
                return <Icon className={`text-lg mx-auto mb-1 ${stat.color}`} />;
              })()}
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'glass-button text-white'
                : 'glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {(() => { const Icon = tab.icon; return <Icon className="text-base" />; })()}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Account Info */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FiInfo className="text-purple-400" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <FiUser className="text-purple-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">Real Name</p>
                    <p className="font-medium text-sm text-[var(--text-primary)] flex items-center gap-1">
                      <FiShield className="text-purple-400 text-xs" />
                      Hidden for privacy
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <FiMail className="text-purple-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">Email</p>
                    <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                      {user?.email || 'Hidden'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <FiGrid className="text-purple-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">Section / Class</p>
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {user?.section || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <FiClock className="text-purple-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">Member Since</p>
                    <p className="font-medium text-sm text-[var(--text-primary)]">
                      {formatDistanceToNow(stats.memberSince, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <FiShield className="text-purple-400 text-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">Account Status</p>
                    <p className="font-medium text-sm text-green-400 flex items-center gap-1">
                      <FiCheckCircle className="text-xs" />
                      {user?.isApproved ? 'Active' : 'Pending Approval'}
                      {isVerified ? ' • Verified' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="glass-card">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-yellow-400 text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
                    Privacy Note
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Your real identity is only visible to system administrators for verification purposes. 
                    Other students will only see your anonymous username and randomly generated avatar. 
                    Your privacy is our top priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Account Settings */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FiSettings className="text-purple-400" />
                Account Settings
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => toast('Feature coming soon!', { icon: '🔧' })}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors text-sm"
                >
                  <span>Change Password</span>
                  <FiEdit2 className="text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => toast('Feature coming soon!', { icon: '🔧' })}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors text-sm"
                >
                  <span>Notification Preferences</span>
                  <FiEdit2 className="text-[var(--text-secondary)]" />
                </button>
                <button
                  onClick={() => toast('Feature coming soon!', { icon: '🔧' })}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors text-sm"
                >
                  <span>Privacy Controls</span>
                  <FiEdit2 className="text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card border-red-500/20">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <FiAlertCircle />
                Danger Zone
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => toast('Feature coming soon!', { icon: '🔧' })}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                >
                  <span>Delete My Account</span>
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => toast('Feature coming soon!', { icon: '🔧' })}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                >
                  <span>Delete All My Posts</span>
                  <FiEdit2 />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sign Out Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 font-medium"
      >
        <FiLogOut className="text-lg" />
        Sign Out
      </motion.button>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostSubmit}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500 text-white shadow-2xl shadow-purple-500/30 hover:bg-purple-600"
        aria-label="Create new post"
      >
        <FiPlus className="text-2xl" />
      </motion.button>

      {/* App Version */}
      <p className="text-center text-xs text-[var(--text-secondary)] mt-4 pb-4">
        Conferia v1.0.0 • Made with ❤️ for Students
      </p>
    </div>
  );
};

export default ProfilePage;