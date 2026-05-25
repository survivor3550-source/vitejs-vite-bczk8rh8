import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiRefreshCw, FiArrowUp, FiBarChart2 } from 'react-icons/fi';
import PostCard from '../Components/feed/PostCard';
import CreatePostModal from '../Components/feed/CreatePostModal';
import FeedFilters from '../Components/feed/FeedFilters';
import Skeleton from '../Components/ui/Skeleton';
import EmptyState from '../Components/ui/EmptyState';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth.jsx';
import { ADMIN_EMAIL } from '../utils/constants';
import toast from 'react-hot-toast';

const FeedPage = () => {
  const [sortBy, setSortBy] = useState('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    posts,
    loading,
    addPost,
    deletePost,
    refreshPosts,
    likePost,
    unlikePost,
    dislikePost,
    undislikePost,
    repostPost,
    addComment,
  } = usePosts(sortBy);
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPosts();
    setIsRefreshing(false);
    toast.success('Feed refreshed! 🔄');
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle post deletion
  const handleDeletePost = useCallback((postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  }, [deletePost]);

  // Handle new post creation
  const handleCreatePost = useCallback((content) => {
    addPost(content);
  }, [addPost]);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 lg:pb-8">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 pt-4 pb-3"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          opacity: 0.95,
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              CONFERIA
            </motion.h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Anonymous Campus Confessions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Refresh feed"
            >
              <FiRefreshCw className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Feed Filters */}
        <FeedFilters 
          sortBy={sortBy} 
          onSortChange={setSortBy} 
          totalPosts={posts.length}
        />
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-4 mt-4">
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
              <Skeleton type="post" />
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                title="No confessions yet"
                description="Be the first to share an anonymous confession on campus! Your identity stays hidden."
                action={{
                  label: 'Create First Post',
                  icon: <FiPlus />,
                  onClick: () => setIsModalOpen(true),
                }}
                variant="posts"
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
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: Math.min(index * 0.05, 0.5),
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  layout
                >
                  <PostCard
                    post={post}
                    isAdmin={isAdmin}
                    onDelete={handleDeletePost}
                    onLike={likePost}
                    onUnlike={unlikePost}
                    onDislike={dislikePost}
                    onUndislike={undislikePost}
                    onRepost={repostPost}
                    onAddComment={addComment}
                  />
                </motion.div>
              ))}
              
              {/* End of feed message */}
              {posts.length > 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--glass-border)]">
                    <span className="text-sm text-[var(--text-secondary)]">
                      You're all caught up! 🎉
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button - Create Post */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center hover:shadow-xl hover:shadow-purple-500/30 transition-shadow"
        aria-label="Create new post"
      >
        <FiPlus className="text-2xl" />
      </motion.button>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-40 right-6 lg:bottom-24 lg:right-8 z-40 w-10 h-10 rounded-full glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Quick Stats Bar - Desktop Only */}
      <div className="hidden lg:block fixed right-8 top-24 w-64 space-y-3">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FiBarChart2 className="text-purple-400" />
            Feed Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Total Posts</span>
              <span className="text-[var(--text-primary)] font-medium">{posts.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Sorting by</span>
              <span className="text-purple-400 font-medium capitalize">{sortBy.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Your Identity</span>
              <span className="text-green-400 font-medium">Anonymous</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">💡 Tips</h3>
          <ul className="space-y-1.5">
            <li className="text-xs text-[var(--text-secondary)]">
              • Posts auto-delete after 15 days
            </li>
            <li className="text-xs text-[var(--text-secondary)]">
              • Be respectful and mindful
            </li>
            <li className="text-xs text-[var(--text-secondary)]">
              • Your identity is always hidden
            </li>
            <li className="text-xs text-[var(--text-secondary)]">
              • Report inappropriate content
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedPage;