import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  FiHeart,
  FiThumbsDown,
  FiRepeat,
  FiMessageCircle,
  FiTrash2,
  FiClock,
  FiMoreHorizontal,
  FiShare2,
  FiFlag,
  FiAlertTriangle,
} from 'react-icons/fi';
import { getRandomAvatar } from '../../utils/avatarGenerator';
import { generateUsername } from '../../utils/usernameGenerator';
import toast from 'react-hot-toast';
import CommentSection from './CommentSection';

const PostCard = ({ post, isAdmin = false, onDelete, isOwner = false }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [reposts, setReposts] = useState(post.reposts || 0);
  const [isReposted, setIsReposted] = useState(false);

  const avatar = getRandomAvatar(post.userId);
  const username = generateUsername(post.userId);
  
  // Calculate deletion timer
  const deletionDate = new Date(post.deletionDate);
  const now = new Date();
  const daysUntilDeletion = Math.ceil((deletionDate - now) / (1000 * 60 * 60 * 24));
  const hoursUntilDeletion = Math.ceil((deletionDate - now) / (1000 * 60 * 60));
  
  // Get deletion time display
  const getDeletionDisplay = () => {
    if (daysUntilDeletion > 1) return `${daysUntilDeletion} days`;
    if (daysUntilDeletion === 1) return '1 day';
    if (hoursUntilDeletion > 1) return `${hoursUntilDeletion} hours`;
    return 'Less than 1 hour';
  };

  // Get deletion progress percentage
  const getDeletionProgress = () => {
    const totalDuration = 15 * 24 * 60 * 60 * 1000; // 15 days in ms
    const elapsed = now - new Date(post.timestamp);
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  const handleLike = () => {
    if (liked) {
      setLikes(prev => prev - 1);
      setLiked(false);
      toast.success('Like removed');
    } else {
      if (disliked) {
        setDislikes(prev => prev - 1);
        setDisliked(false);
      }
      setLikes(prev => prev + 1);
      setLiked(true);
      toast.success('Post liked! ❤️', { duration: 1500 });
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(prev => prev - 1);
      setDisliked(false);
    } else {
      if (liked) {
        setLikes(prev => prev - 1);
        setLiked(false);
      }
      setDislikes(prev => prev + 1);
      setDisliked(true);
    }
  };

  const handleRepost = () => {
    if (isReposted) {
      setReposts(prev => prev - 1);
      setIsReposted(false);
      toast.success('Repost removed');
    } else {
      setReposts(prev => prev + 1);
      setIsReposted(true);
      toast.success('Post reposted to your feed! 🔄', { duration: 2000 });
    }
  };

  const handleShare = () => {
    // Copy post link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast.success('Link copied to clipboard! 📋');
    setShowMenu(false);
  };

  const handleReport = () => {
    toast.success('Post reported for review', {
      icon: '🚩',
      duration: 3000,
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete?.(post.id);
    }
    setShowMenu(false);
  };

  const getTimeDisplay = () => {
    const postDate = new Date(post.timestamp);
    return formatDistanceToNow(postDate, { addSuffix: true });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card hover:shadow-lg hover:shadow-purple-500/5 transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={avatar}
              alt={username}
              className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--glass-border)]"
              loading="lazy"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[var(--bg-primary)]" 
                 title="Online" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">
                {username}
              </h3>
              {post.isOwner && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {getTimeDisplay()}
            </p>
          </div>
        </div>

        {/* More Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
          >
            <FiMoreHorizontal className="text-lg" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-10 z-20 w-48 glass-morphism rounded-xl overflow-hidden shadow-xl"
                >
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <FiShare2 className="text-base" />
                    Copy Link
                  </button>
                  <button
                    onClick={handleReport}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-yellow-400 transition-colors"
                  >
                    <FiFlag className="text-base" />
                    Report Post
                  </button>
                  {(isAdmin || isOwner) && (
                    <>
                      <div className="h-px bg-[var(--glass-border)]" />
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <FiTrash2 className="text-base" />
                        Delete Post
                      </button>
                    </>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Deletion Timer */}
      <div className="mb-4 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--glass-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: daysUntilDeletion <= 2 ? [0, -10, 10, -10, 0] : 0 }}
              transition={{ duration: 2, repeat: daysUntilDeletion <= 2 ? Infinity : 0 }}
            >
              <FiClock className={`text-sm ${
                daysUntilDeletion <= 1 ? 'text-red-400' : 
                daysUntilDeletion <= 3 ? 'text-amber-400' : 
                'text-blue-400'
              }`} />
            </motion.div>
            <span className="text-xs text-[var(--text-secondary)]">
              {daysUntilDeletion <= 0 ? (
                <span className="text-red-400 font-medium">Deleting soon</span>
              ) : (
                <>Deleting in <span className="font-medium text-[var(--text-primary)]">{getDeletionDisplay()}</span></>
              )}
            </span>
          </div>
          {daysUntilDeletion <= 3 && (
            <FiAlertTriangle className={`text-xs ${
              daysUntilDeletion <= 1 ? 'text-red-400' : 'text-amber-400'
            }`} />
          )}
        </div>
        <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getDeletionProgress()}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              daysUntilDeletion <= 1 
                ? 'bg-gradient-to-r from-red-500 to-red-400'
                : daysUntilDeletion <= 3
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              liked
                ? 'text-purple-400 bg-purple-500/10'
                : 'text-[var(--text-secondary)] hover:text-purple-400 hover:bg-purple-500/5'
            }`}
          >
            <FiHeart className={liked ? 'fill-current' : ''} />
            {likes > 0 && <span className="font-medium">{likes}</span>}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDislike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              disliked
                ? 'text-red-400 bg-red-500/10'
                : 'text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/5'
            }`}
          >
            <FiThumbsDown />
            {dislikes > 0 && <span className="font-medium">{dislikes}</span>}
          </motion.button>
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              showComments
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-[var(--text-secondary)] hover:text-blue-400 hover:bg-blue-500/5'
            }`}
          >
            <FiMessageCircle />
            {(post.comments?.length || 0) > 0 && (
              <span className="font-medium">{post.comments?.length || 0}</span>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRepost}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              isReposted
                ? 'text-green-400 bg-green-500/10'
                : 'text-[var(--text-secondary)] hover:text-green-400 hover:bg-green-500/5'
            }`}
          >
            <FiRepeat />
            {reposts > 0 && <span className="font-medium">{reposts}</span>}
          </motion.button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-[var(--glass-border)] overflow-hidden"
          >
            <CommentSection postId={post.id} comments={post.comments || []} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default PostCard;