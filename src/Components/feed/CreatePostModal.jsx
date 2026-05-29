import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSend, 
  FiMaximize2, 
  FiMinimize2,
  FiAlertCircle,
  FiHash,
  FiShield,
  FiClock
} from 'react-icons/fi';
import { MAX_POST_CHARACTERS, POST_DELETION_DAYS } from '../../utils/constants';
import { getRandomAvatar } from '../../utils/avatarGenerator';
import { generateUsername } from '../../utils/usernameGenerator';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const { user } = useAuth();

  const avatar = getRandomAvatar(user?.uid || 'default');
  const username = generateUsername(user?.uid || 'default');
  const charCount = content.length;
  const charPercentage = (charCount / MAX_POST_CHARACTERS) * 100;
  const isNearLimit = charCount > MAX_POST_CHARACTERS * 0.8;
  const isOverLimit = charCount > MAX_POST_CHARACTERS;

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (content.trim()) {
          if (window.confirm('Discard your confession?')) {
            handleClose();
          }
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, content]);

  const handleClose = () => {
    setContent('');
    setIsExpanded(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length === 0) {
      toast.error('Confession cannot be empty! 🤔');
      return;
    }
    if (isOverLimit) {
      toast.error(`Post must be under ${MAX_POST_CHARACTERS} characters`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      toast.success('Confession posted anonymously! 🎭', {
        duration: 3000,
        icon: '✨',
      });
      handleClose();
    } catch (error) {
      toast.error('Failed to post. Please try again.');
      console.error('Post error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getCharCountColor = () => {
    if (isOverLimit) return 'text-red-400';
    if (isNearLimit) return 'text-amber-400';
    return 'text-[var(--text-secondary)]';
  };

  const getProgressColor = () => {
    if (isOverLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-purple-500';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={content.trim() ? undefined : handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25 
            }}
            className={`fixed z-50 top-4 left-4 w-[350px] max-w-[90vw] rounded-2xl ${
              isExpanded ? 'max-h-[90vh]' : 'max-h-[70vh]'
            }`}
          >
            <div className="glass-card h-full flex flex-col relative overflow-hidden max-h-[90vh]">
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <FiHash className="text-white text-sm" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)]">
                      New Confession
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Posting as <span className="text-purple-400">{username}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                    title={isExpanded ? 'Minimize' : 'Expand'}
                  >
                    {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiX className="text-lg" />
                  </motion.button>
                </div>
              </div>

              {/* User Preview */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--glass-border)]">
                <img
                  src={avatar}
                  alt={username}
                  className="w-8 h-8 rounded-full bg-[var(--bg-primary)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {username}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <FiShield className="text-purple-400" />
                    Anonymous posting
                  </p>
                </div>
              </div>

              {/* Content Area */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 overflow-y-auto">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind? Share your confession anonymously..."
                    className="w-full h-full bg-transparent text-[var(--text-primary)] placeholder-gray-500 resize-none outline-none text-sm leading-relaxed min-h-[150px]"
                    maxLength={MAX_POST_CHARACTERS + 50}
                    autoFocus
                    disabled={isSubmitting}
                  />

                  {/* Empty state hint */}
                  {content.length === 0 && (
                    <div className="absolute top-0 left-0 pointer-events-none text-xs text-[var(--text-secondary)] mt-12">
                      <p>💡 Tips for a great confession:</p>
                      <ul className="mt-2 space-y-1 ml-4">
                        <li>• Be honest and authentic</li>
                        <li>• Keep it respectful</li>
                        <li>• No personal information</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="space-y-3 mt-4">
                  {/* Character Counter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiAlertCircle className={`text-xs ${
                          isOverLimit ? 'text-red-400' : 
                          isNearLimit ? 'text-amber-400' : 
                          'text-[var(--text-secondary)]'
                        }`} />
                        <span className={`text-xs font-medium ${getCharCountColor()}`}>
                          {charCount}/{MAX_POST_CHARACTERS}
                        </span>
                      </div>
                      {isNearLimit && !isOverLimit && (
                        <span className="text-xs text-amber-400">
                          Approaching limit
                        </span>
                      )}
                      {isOverLimit && (
                        <span className="text-xs text-red-400 font-medium">
                          Over limit!
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(charPercentage, 100)}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full transition-colors ${getProgressColor()}`}
                      />
                    </div>
                  </div>

                  {/* Info & Submit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <FiClock className="text-purple-400" />
                      <span>Auto-deletes in {POST_DELETION_DAYS} days</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)]">
                        {isExpanded ? 'Esc' : 'Esc'} to cancel • Ctrl+Enter to post
                      </span>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSubmitting || isOverLimit || content.trim().length === 0}
                        className={`glass-button text-white flex items-center gap-2 text-sm px-4 py-2 ${
                          (isSubmitting || isOverLimit || content.trim().length === 0)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <FiSend className="text-sm" />
                            Post Anonymously
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;