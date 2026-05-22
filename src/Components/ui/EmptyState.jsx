import { motion } from 'framer-motion';
import { 
  FiInbox, 
  FiMessageSquare, 
  FiUser, 
  FiHeart,
  FiSearch,
  FiAlertCircle,
  FiLock,
  FiClock,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiPlus,
  FiRefreshCw
} from 'react-icons/fi';

const EmptyState = ({ 
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  description = '',
  action,
  secondaryAction,
  variant = 'default',
  size = 'md',
  animated = true,
  className = ''
}) => {
  
  // Variant presets
  const variants = {
    default: {
      icon: FiInbox,
      iconBg: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    posts: {
      icon: FiMessageSquare,
      iconBg: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    comments: {
      icon: FiMessageSquare,
      iconBg: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/20',
    },
    users: {
      icon: FiUsers,
      iconBg: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
    },
    search: {
      icon: FiSearch,
      iconBg: 'from-gray-500/20 to-slate-500/20',
      iconColor: 'text-gray-400',
      borderColor: 'border-gray-500/20',
    },
    error: {
      icon: FiAlertCircle,
      iconBg: 'from-red-500/20 to-rose-500/20',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/20',
    },
    locked: {
      icon: FiLock,
      iconBg: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/20',
    },
    trending: {
      icon: FiTrendingUp,
      iconBg: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-500/20',
    },
  };

  const selectedVariant = variants[variant] || variants.default;
  const DisplayIcon = icon || selectedVariant.icon;

  // Size configurations
  const sizes = {
    sm: {
      container: 'py-8 px-4',
      iconWrapper: 'w-14 h-14',
      icon: 'text-2xl',
      title: 'text-base',
      description: 'text-xs',
      maxWidth: 'max-w-xs',
    },
    md: {
      container: 'py-12 px-4',
      iconWrapper: 'w-20 h-20',
      icon: 'text-3xl',
      title: 'text-lg',
      description: 'text-sm',
      maxWidth: 'max-w-sm',
    },
    lg: {
      container: 'py-16 px-4',
      iconWrapper: 'w-24 h-24',
      icon: 'text-4xl',
      title: 'text-xl',
      description: 'text-base',
      maxWidth: 'max-w-md',
    },
  };

  const currentSize = sizes[size] || sizes.md;

  // Floating particles animation
  const FloatingParticles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${selectedVariant.iconColor} opacity-20`}
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
          }}
          animate={{
            y: ['0%', '-20%', '0%'],
            x: ['0%', '10%', '0%'],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.95 } : false}
      animate={animated ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`relative ${currentSize.container} ${className}`}
    >
      <div className={`flex flex-col items-center text-center ${currentSize.maxWidth} mx-auto`}>
        {/* Icon Container */}
        <motion.div
          animate={animated ? {
            scale: [1, 1.05, 1],
            rotate: [0, -5, 5, -5, 0],
          } : false}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative ${currentSize.iconWrapper} rounded-2xl bg-gradient-to-br ${selectedVariant.iconBg} border ${selectedVariant.borderColor} flex items-center justify-center mb-6`}
        >
          {/* Floating particles around icon */}
          {animated && <FloatingParticles />}
          
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-2xl ${selectedVariant.iconColor} opacity-10 blur-xl`} />
          
          {/* Icon */}
          <motion.div
            animate={animated ? {
              y: [0, -3, 0],
            } : false}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10"
          >
            <DisplayIcon className={`${currentSize.icon} ${selectedVariant.iconColor}`} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={animated ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.2 }}
          className={`${currentSize.title} font-bold text-[var(--text-primary)] mb-2`}
        >
          {title}
        </motion.h3>

        {/* Description */}
        {description && (
          <motion.p
            initial={animated ? { opacity: 0, y: 10 } : false}
            animate={animated ? { opacity: 1, y: 0 } : false}
            transition={{ delay: 0.3 }}
            className={`${currentSize.description} text-[var(--text-secondary)] mb-6`}
          >
            {description}
          </motion.p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Primary Action */}
          {action && (
            <motion.button
              initial={animated ? { opacity: 0, y: 10 } : false}
              animate={animated ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className="glass-button text-white px-6 py-2.5 flex items-center gap-2 text-sm font-medium"
            >
              {action.icon || <FiPlus className="text-base" />}
              {action.label}
            </motion.button>
          )}

          {/* Secondary Action */}
          {secondaryAction && (
            <motion.button
              initial={animated ? { opacity: 0, y: 10 } : false}
              animate={animated ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={secondaryAction.onClick}
              className="glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-6 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors rounded-xl"
            >
              {secondaryAction.icon || <FiRefreshCw className="text-base" />}
              {secondaryAction.label}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Preset empty states for common use cases
export const NoPostsEmptyState = ({ onCreatePost }) => (
  <EmptyState
    variant="posts"
    title="No confessions yet"
    description="Be the first to share an anonymous confession on campus! Your identity stays hidden."
    action={{
      label: 'Create First Post',
      icon: <FiPlus />,
      onClick: onCreatePost,
    }}
  />
);

export const NoCommentsEmptyState = () => (
  <EmptyState
    variant="comments"
    title="No comments yet"
    description="Start the conversation! Be the first to share your thoughts."
    size="sm"
    icon={FiMessageSquare}
  />
);

export const NoSearchResultsState = ({ onClearSearch }) => (
  <EmptyState
    variant="search"
    title="No results found"
    description="Try adjusting your search terms or filters."
    icon={FiSearch}
    secondaryAction={{
      label: 'Clear Search',
      icon: <FiRefreshCw />,
      onClick: onClearSearch,
    }}
  />
);

export const NoTrendingState = () => (
  <EmptyState
    variant="trending"
    title="Nothing trending yet"
    description="Check back later when the campus is more active!"
    icon={FiTrendingUp}
  />
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <EmptyState
    variant="error"
    title="Oops! An error occurred"
    description={message}
    icon={FiAlertCircle}
    action={onRetry ? {
      label: 'Try Again',
      icon: <FiRefreshCw />,
      onClick: onRetry,
    } : undefined}
  />
);

export const NoAccessState = ({ message = 'You don\'t have access to this content' }) => (
  <EmptyState
    variant="locked"
    title="Access Restricted"
    description={message}
    icon={FiLock}
  />
);

export const NoUsersState = () => (
  <EmptyState
    variant="users"
    title="No users found"
    description="New users will appear here once they join."
    icon={FiUsers}
  />
);

export const PendingState = ({ message = 'Waiting for approval' }) => (
  <EmptyState
    variant="locked"
    title="Pending Approval"
    description={message}
    icon={FiClock}
    animated={true}
  />
);

export default EmptyState;