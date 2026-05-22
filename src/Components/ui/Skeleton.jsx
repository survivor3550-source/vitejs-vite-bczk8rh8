import { motion } from 'framer-motion';

const Skeleton = ({ type = 'card', count = 1, className = '' }) => {
  const shimmer = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const baseShimmerStyle = {
    background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--glass-border) 50%, var(--bg-tertiary) 75%)',
    backgroundSize: '200% 100%',
  };

  // Post Card Skeleton
  const PostCardSkeleton = () => (
    <div className="glass-card animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-10 h-10 rounded-full"
        />
        <div className="space-y-2 flex-1">
          <motion.div
            {...shimmer}
            style={baseShimmerStyle}
            className="w-32 h-3 rounded-lg"
          />
          <motion.div
            {...shimmer}
            style={baseShimmerStyle}
            className="w-20 h-2 rounded-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-full h-3 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-5/6 h-3 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-4/6 h-3 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-3/6 h-3 rounded-lg"
        />
      </div>

      {/* Timer */}
      <div className="mb-4 p-3 rounded-lg bg-[var(--bg-tertiary)]">
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-36 h-2 rounded-lg mb-2"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-full h-1.5 rounded-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-[var(--glass-border)]">
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-16 h-8 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-16 h-8 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-16 h-8 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-16 h-8 rounded-lg"
        />
      </div>
    </div>
  );

  // Comment Skeleton
  const CommentSkeleton = () => (
    <div className="flex gap-3 animate-pulse">
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <motion.div
            {...shimmer}
            style={baseShimmerStyle}
            className="w-24 h-3 rounded-lg"
          />
          <motion.div
            {...shimmer}
            style={baseShimmerStyle}
            className="w-16 h-2 rounded-lg"
          />
        </div>
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-full h-3 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-3/4 h-3 rounded-lg"
        />
      </div>
    </div>
  );

  // Profile Skeleton
  const ProfileSkeleton = () => (
    <div className="glass-card text-center animate-pulse">
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-40 h-6 rounded-lg mx-auto mb-2"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-28 h-4 rounded-lg mx-auto mb-4"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-24 h-8 rounded-full mx-auto"
      />
    </div>
  );

  // Feed Filters Skeleton
  const FiltersSkeleton = () => (
    <div className="flex gap-2 animate-pulse">
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-24 h-10 rounded-xl"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-28 h-10 rounded-xl"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-32 h-10 rounded-xl"
      />
    </div>
  );

  // List Item Skeleton
  const ListItemSkeleton = () => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)] animate-pulse">
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-10 h-10 rounded-lg"
      />
      <div className="flex-1 space-y-2">
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-40 h-4 rounded-lg"
        />
        <motion.div
          {...shimmer}
          style={baseShimmerStyle}
          className="w-60 h-3 rounded-lg"
        />
      </div>
    </div>
  );

  // Stats Card Skeleton
  const StatsSkeleton = () => (
    <div className="glass-card animate-pulse">
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-10 h-10 rounded-lg mb-3"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-16 h-8 rounded-lg mb-2"
      />
      <motion.div
        {...shimmer}
        style={baseShimmerStyle}
        className="w-24 h-4 rounded-lg"
      />
    </div>
  );

  // Text Line Skeleton
  const TextSkeleton = ({ width = 'w-full', height = 'h-4' }) => (
    <motion.div
      {...shimmer}
      style={baseShimmerStyle}
      className={`${width} ${height} rounded-lg`}
    />
  );

  // Avatar Skeleton
  const AvatarSkeleton = ({ size = 'w-10 h-10' }) => (
    <motion.div
      {...shimmer}
      style={baseShimmerStyle}
      className={`${size} rounded-full`}
    />
  );

  // Button Skeleton
  const ButtonSkeleton = ({ width = 'w-24', height = 'h-10' }) => (
    <motion.div
      {...shimmer}
      style={baseShimmerStyle}
      className={`${width} ${height} rounded-xl`}
    />
  );

  // Render based on type
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
      case 'post':
        return <PostCardSkeleton />;
      case 'comment':
        return <CommentSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'filters':
        return <FiltersSkeleton />;
      case 'list-item':
        return <ListItemSkeleton />;
      case 'stats':
        return <StatsSkeleton />;
      case 'text':
        return <TextSkeleton />;
      case 'avatar':
        return <AvatarSkeleton />;
      case 'button':
        return <ButtonSkeleton />;
      case 'feed':
        return (
          <div className="space-y-4">
            <FiltersSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        );
      default:
        return <PostCardSkeleton />;
    }
  };

  // Multiple skeletons with stagger animation
  if (count > 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {renderSkeleton()}
          </motion.div>
        ))}
      </div>
    );
  }

  return <div className={className}>{renderSkeleton()}</div>;
};

// Specialized skeleton components for direct use
export const PostSkeleton = () => <Skeleton type="post" />;
export const CommentSkeleton = () => <Skeleton type="comment" />;
export const ProfileSkeleton = () => <Skeleton type="profile" />;
export const FeedSkeleton = () => <Skeleton type="feed" />;
export const FiltersSkeleton = () => <Skeleton type="filters" />;
export const StatsSkeleton = () => <Skeleton type="stats" />;

// Grid layout skeletons
export const SkeletonGrid = ({ cols = 2, rows = 3, type = 'card' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {Array.from({ length: cols * rows }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Skeleton type={type} />
        </motion.div>
      ))}
    </div>
  );
};

// Loading overlay skeleton
export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              animate={{
                y: [-5, 5, -5],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-purple-400"
            />
          ))}
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      </div>
    </motion.div>
  );
};

export default Skeleton;