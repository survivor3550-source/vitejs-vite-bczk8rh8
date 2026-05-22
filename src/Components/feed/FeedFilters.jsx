import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiTrendingUp, 
  FiHeart,
  FiFilter,
  FiX
} from 'react-icons/fi';

const filters = [
  { 
    id: 'latest', 
    label: 'Latest', 
    icon: FiClock,
    description: 'Most recent confessions'
  },
  { 
    id: 'trending', 
    label: 'Trending', 
    icon: FiTrendingUp,
    description: 'Hot & active discussions'
  },
  { 
    id: 'most-liked', 
    label: 'Most Liked', 
    icon: FiHeart,
    description: 'Popular confessions'
  },
];

const FeedFilters = ({ sortBy, onSortChange, totalPosts = 0 }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilter = filters.find(f => f.id === sortBy) || filters[0];

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Filter Label */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mr-2">
          <FiFilter className="text-purple-400" />
          <span className="hidden md:inline">Sort by:</span>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = sortBy === filter.id;
            
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSortChange(filter.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap group ${
                  isActive
                    ? 'glass-button text-white'
                    : 'glass-morphism text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`text-base transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                <span>{filter.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-100 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                  {filter.description}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Post Count */}
        {totalPosts > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-3 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--glass-border)]"
          >
            <span className="text-xs text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{totalPosts}</span> posts
            </span>
          </motion.div>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="sm:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between glass-morphism px-4 py-3 rounded-xl text-sm"
        >
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = activeFilter.icon;
              return <Icon className="text-purple-400" />;
            })()}
            <span className="font-medium text-[var(--text-primary)]">
              {activeFilter.label}
            </span>
            {totalPosts > 0 && (
              <span className="text-xs text-[var(--text-secondary)] ml-2">
                • {totalPosts} posts
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: showMobileFilters ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiFilter className="text-[var(--text-secondary)]" />
          </motion.div>
        </motion.button>

        {/* Mobile Filter Dropdown */}
        <motion.div
          initial={false}
          animate={{
            height: showMobileFilters ? 'auto' : 0,
            opacity: showMobileFilters ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-1">
            {filters.map((filter, index) => {
              const Icon = filter.icon;
              const isActive = sortBy === filter.id;

              return (
                <motion.button
                  key={filter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: showMobileFilters ? 1 : 0, 
                    x: showMobileFilters ? 0 : -20 
                  }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onSortChange(filter.id);
                    setShowMobileFilters(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <Icon className={`text-base ${isActive ? 'scale-110' : ''}`} />
                  <div className="text-left">
                    <span className="font-medium">{filter.label}</span>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {filter.description}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveFilter"
                      className="ml-auto"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Active Filter Indicator (Mobile) */}
      {sortBy !== 'latest' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:hidden mt-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 text-xs">
            {(() => {
              const Icon = activeFilter.icon;
              return <Icon className="text-purple-400" />;
            })()}
            <span className="text-purple-400 font-medium">
              Showing: {activeFilter.label}
            </span>
          </div>
          <button
            onClick={() => onSortChange('latest')}
            className="p-1 rounded text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FiX className="text-sm" />
          </button>
        </motion.div>
      )}

      {/* Quick Stats */}
      {sortBy === 'trending' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="hidden sm:flex items-center gap-3 mt-3 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--glass-border)] text-xs text-[var(--text-secondary)]"
        >
          <span>🔥 Trending now</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
          <span>Based on likes & comments</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
          <span>Updated in real-time</span>
        </motion.div>
      )}
    </>
  );
};

export default FeedFilters;