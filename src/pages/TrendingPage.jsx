import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiClock, 
  FiHeart, 
  FiMessageSquare, 
  FiRepeat,
  FiRefreshCw,
  FiAlertCircle,
  FiAward,
  FiStar
} from 'react-icons/fi';
import PostCard from '../Components/feed/PostCard';
import Skeleton from '../Components/ui/Skeleton';
import EmptyState from '../Components/ui/EmptyState';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth.jsx';
import { ADMIN_EMAIL } from '../utils/constants';
import { formatDistanceToNow } from 'date-fns';
import { toDateSafe } from '../utils/date';
import toast from 'react-hot-toast';

const TrendingPage = () => {
  const [timeframe, setTimeframe] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [topPosts, setTopPosts] = useState([]);
  
  const { 
    posts, 
    loading, 
    deletePost, 
    refreshPosts,
    likePost,
    unlikePost,
    dislikePost,
    undislikePost,
    repostPost,
    undoRepost,
    addComment 
  } = usePosts('trending');
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Calculate trending score
  const getTrendingScore = (post) => {
    return (post.likes || 0) * 2 + (post.comments?.length || 0) * 3 + (post.reposts || 0) * 4;
  };

  // Get top 3 trending posts
  useEffect(() => {
    if (posts.length > 0) {
      const sorted = [...posts].sort((a, b) => getTrendingScore(b) - getTrendingScore(a));
      setTopPosts(sorted.slice(0, 3));
    }
  }, [posts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPosts();
    setIsRefreshing(false);
    toast.success('Trending feed refreshed! 🔄');
  };

  const handleDeletePost = useCallback((postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  }, [deletePost]);

  const timeframes = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  // Filter posts based on timeframe
  const filteredPosts = posts.filter(post => {
    const postDate = toDateSafe(post.timestamp || post.createdAt);
    const now = new Date();
    
    switch (timeframe) {
      case 'today':
        return postDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return postDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        return postDate >= monthAgo;
      default:
        return true;
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 pb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
            >
              <FiTrendingUp className="text-white text-lg" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Trending
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                What's hot on campus right now
              </p>
            </div>
          </div>
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Refresh trending"
          >
            <FiRefreshCw className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Timeframe Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-4 mb-4"
      >
        {timeframes.map((tf) => (
          <motion.button
            key={tf.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTimeframe(tf.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              timeframe === tf.id
                ? 'glass-button text-white'
                : 'glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tf.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Top 3 Trending Posts */}
      {!loading && topPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <FiAward className="text-yellow-400" />
            Top Posts
          </h2>
          
          <div className="space-y-3">
            {topPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                {/* Rank Badge */}
                <div className="absolute -left-2 -top-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                    index === 0 
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700'
                      : 'bg-gradient-to-br from-orange-400 to-red-500'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <PostCard
                  post={post}
                  isAdmin={isAdmin}
                  isOwner={user?.uid === post.userId}
                  onDelete={handleDeletePost}
                  onLike={likePost}
                  onUnlike={unlikePost}
                  onDislike={dislikePost}
                  onUndislike={undislikePost}
                  onRepost={repostPost}
                  onUndoRepost={undoRepost}
                  onAddComment={addComment}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Trending Posts */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-purple-400" />
          All Trending Posts
          {filteredPosts.length > 0 && (
            <span className="text-sm font-normal text-[var(--text-secondary)]">
              ({filteredPosts.length})
            </span>
          )}
        </h2>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Skeleton type="post" />
                <Skeleton type="post" />
                <Skeleton type="post" />
              </motion.div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  variant="trending"
                  title="Nothing trending yet"
                  description={
                    timeframe === 'today'
                      ? 'No trending posts today. Check back later!'
                      : timeframe === 'week'
                      ? 'No trending posts this week. Be the first to start a trend!'
                      : 'No posts found for this time period.'
                  }
                  icon={FiTrendingUp}
                />
              </motion.div>
            ) : (
              <motion.div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: Math.min(index * 0.05, 0.3),
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <PostCard
                      post={post}
                      isAdmin={isAdmin}
                      isOwner={user?.uid === post.userId}
                      onDelete={handleDeletePost}
                      onLike={likePost}
                      onUnlike={unlikePost}
                      onDislike={dislikePost}
                      onUndislike={undislikePost}
                      onRepost={repostPost}
                      onUndoRepost={undoRepost}
                      onAddComment={addComment}
                    />
                  </motion.div>
                ))}

                {/* End of feed */}
                {filteredPosts.length > 10 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--glass-border)]">
                      <FiTrendingUp className="text-purple-400" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        You're all caught up with trends! 🔥
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Trending Stats - Desktop Sidebar */}
      <div className="hidden lg:block fixed right-8 top-24 w-64 space-y-3">
        {/* Trending Score Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FiAlertCircle className="text-purple-400" />
            How Trending Works
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Posts are ranked based on likes, comments, and reposts. 
            Recent activity has more weight than older interactions.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FiStar className="text-yellow-400" />
            Trending Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Total Posts</span>
              <span className="text-[var(--text-primary)] font-medium">{filteredPosts.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Total Likes</span>
              <span className="text-red-400 font-medium">
                {filteredPosts.reduce((sum, p) => sum + (p.likes || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Total Comments</span>
              <span className="text-blue-400 font-medium">
                {filteredPosts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Total Reposts</span>
              <span className="text-green-400 font-medium">
                {filteredPosts.reduce((sum, p) => sum + (p.reposts || 0), 0)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FiAward className="text-yellow-400" />
            Top Contributors
          </h3>
          <div className="space-y-2">
            {topPosts.slice(0, 5).map((post, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`text-xs font-bold ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-400' :
                  index === 2 ? 'text-orange-400' :
                  'text-[var(--text-secondary)]'
                }`}>
                  #{index + 1}
                </span>
                <span className="text-xs text-[var(--text-primary)] truncate flex-1">
                  {post.content?.substring(0, 30)}...
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {post.likes || 0} ❤️
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingPage;