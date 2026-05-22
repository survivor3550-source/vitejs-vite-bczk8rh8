import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  FiSend, 
  FiHeart, 
  FiMoreHorizontal,
  FiTrash2,
  FiFlag,
  FiCornerDownRight,
  FiMessageSquare
} from 'react-icons/fi';
import { getRandomAvatar } from '../../utils/avatarGenerator';
import { generateUsername } from '../../utils/usernameGenerator';
import { MAX_COMMENT_CHARACTERS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_EMAIL } from '../../utils/constants';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments: initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const commentInputRef = useRef(null);
  const replyInputRef = useRef(null);
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Focus reply input when replying
  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (newComment.trim().length === 0) {
      toast.error('Comment cannot be empty!');
      return;
    }
    
    if (newComment.length > MAX_COMMENT_CHARACTERS) {
      toast.error(`Comment must be under ${MAX_COMMENT_CHARACTERS} characters`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Firebase Firestore integration will be here
      // await addDoc(collection(db, 'comments'), { ... });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        postId,
        userId: user?.uid || 'current-user',
        content: newComment.trim(),
        timestamp: new Date(),
        likes: 0,
        replies: [],
        isOwner: true,
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment added! 💬', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Comment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    if (replyContent.trim().length === 0) {
      toast.error('Reply cannot be empty!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const reply = {
        id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentId: parentCommentId,
        userId: user?.uid || 'current-user',
        content: replyContent.trim(),
        timestamp: new Date(),
        likes: 0,
        isOwner: true,
      };

      setComments(prev =>
        prev.map(comment =>
          comment.id === parentCommentId
            ? { ...comment, replies: [...(comment.replies || []), reply] }
            : comment
        )
      );
      
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply added! ↩️', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    const likeKey = isReply ? `${parentId}-${commentId}` : commentId;
    
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(likeKey)) {
        newSet.delete(likeKey);
      } else {
        newSet.add(likeKey);
      }
      return newSet;
    });

    if (isReply && parentId) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies?.map(reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likes: likedComments.has(likeKey)
                          ? reply.likes - 1
                          : reply.likes + 1,
                      }
                    : reply
                ),
              }
            : comment
        )
      );
    } else {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                likes: likedComments.has(likeKey)
                  ? comment.likes - 1
                  : comment.likes + 1,
              }
            : comment
        )
      );
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted');
    }
    setMenuOpen(null);
  };

  const handleDeleteReply = (parentId, replyId) => {
    if (window.confirm('Delete this reply?')) {
      setComments(prev =>
        prev.map(comment =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies?.filter(reply => reply.id !== replyId),
              }
            : comment
        )
      );
      toast.success('Reply deleted');
    }
    setMenuOpen(null);
  };

  const handleReportComment = (commentId) => {
    toast.success('Comment reported for review', { icon: '🚩' });
    setMenuOpen(null);
  };

  const handleKeyDown = (e, type = 'comment') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'comment') {
        handleAddComment(e);
      } else {
        handleAddReply(replyingTo);
      }
    }
  };

  const renderComment = (comment, isReply = false, parentId = null) => {
    const avatar = getRandomAvatar(comment.userId);
    const username = generateUsername(comment.userId);
    const likeKey = isReply ? `${parentId}-${comment.id}` : comment.id;
    const isLiked = likedComments.has(likeKey);

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.3 }}
        className={`flex gap-3 ${isReply ? 'ml-8 mt-2' : ''}`}
      >
        <div className="flex-shrink-0">
          <img
            src={avatar}
            alt={username}
            className={`rounded-full bg-[var(--bg-primary)] border border-[var(--glass-border)] ${
              isReply ? 'w-7 h-7' : 'w-9 h-9'
            }`}
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="p-3 rounded-xl bg-[var(--bg-tertiary)]">
            {/* Comment Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`font-medium text-[var(--text-primary)] truncate ${
                  isReply ? 'text-xs' : 'text-sm'
                }`}>
                  {username}
                </span>
                {comment.isOwner && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium flex-shrink-0">
                    You
                  </span>
                )}
                <span className="text-xs text-[var(--text-secondary)] flex-shrink-0">
                  {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                </span>
              </div>

              {/* Comment Menu */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(menuOpen === comment.id ? null : comment.id)}
                  className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <FiMoreHorizontal className="text-sm" />
                </button>

                <AnimatePresence>
                  {menuOpen === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-8 z-10 w-40 glass-morphism rounded-lg overflow-hidden shadow-xl"
                    >
                      <button
                        onClick={() => handleReportComment(comment.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-yellow-400 transition-colors"
                      >
                        <FiFlag className="text-sm" />
                        Report
                      </button>
                      {(isAdmin || comment.isOwner) && (
                        <button
                          onClick={() => isReply 
                            ? handleDeleteReply(parentId, comment.id)
                            : handleDeleteComment(comment.id)
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <FiTrash2 className="text-sm" />
                          Delete
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Comment Content */}
            <p className={`text-[var(--text-primary)] ${isReply ? 'text-sm' : 'text-sm'}`}>
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-3 mt-1.5 ml-1">
            <button
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked
                  ? 'text-purple-400'
                  : 'text-[var(--text-secondary)] hover:text-purple-400'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>

            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                  setReplyContent('');
                }}
                className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-blue-400 transition-colors"
              >
                <FiCornerDownRight />
                Reply
              </button>
            )}

            {(comment.replies?.length || 0) > 0 && !isReply && (
              <span className="text-xs text-[var(--text-secondary)]">
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {replyingTo === comment.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-2 mt-2 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    ref={replyInputRef}
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddReply(comment.id);
                      }
                      if (e.key === 'Escape') {
                        setReplyingTo(null);
                        setReplyContent('');
                      }
                    }}
                    placeholder={`Reply to ${username}...`}
                    className="flex-1 glass-input text-xs py-2 px-3"
                    maxLength={MAX_COMMENT_CHARACTERS}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAddReply(comment.id)}
                    disabled={replyContent.trim().length === 0 || isSubmitting}
                    className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
                  >
                    <FiSend className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          <AnimatePresence>
            {comment.replies?.map(reply => (
              <div key={reply.id}>
                {renderComment(reply, true, comment.id)}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Comment Count */}
      {comments.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <FiMessageSquare className="text-purple-400" />
          <span>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
      )}

      {/* Add Comment Input */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={commentInputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'comment')}
            placeholder="Add a comment..."
            className="w-full glass-input text-sm py-2.5 pl-4 pr-16"
            maxLength={MAX_COMMENT_CHARACTERS}
            disabled={isSubmitting}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className={`text-xs ${
              newComment.length > MAX_COMMENT_CHARACTERS * 0.9
                ? 'text-red-400'
                : 'text-[var(--text-secondary)]'
            }`}>
              {newComment.length}/{MAX_COMMENT_CHARACTERS}
            </span>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={newComment.trim().length === 0 || isSubmitting}
              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="text-sm" />
              )}
            </motion.button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {comments.map((comment) => (
            <div key={comment.id}>
              {renderComment(comment)}
            </div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <FiMessageSquare className="text-3xl text-[var(--text-secondary)] mx-auto mb-2 opacity-50" />
            <p className="text-sm text-[var(--text-secondary)]">
              No comments yet. Start the conversation!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;