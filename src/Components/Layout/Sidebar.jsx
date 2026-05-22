import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiTrendingUp,
  FiUser,
  FiShield,
  FiLogOut,
  FiHash,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_EMAIL } from '../../utils/constants';
import ThemeToggle from '../ui/ThemeToggle';

const Sidebar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const navItems = [
    { to: '/feed', icon: FiHome, label: 'Feed', description: 'Latest confessions' },
    { to: '/trending', icon: FiTrendingUp, label: 'Trending', description: 'Hot topics' },
    ...(isAdmin
      ? [{ to: '/admin', icon: FiShield, label: 'Admin Panel', description: 'Moderation tools' }]
      : []),
    { to: '/profile', icon: FiUser, label: 'Profile', description: 'Your anonymous identity' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Firebase signOut will be called here
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="h-screen p-6 flex flex-col glass-morphism border-r border-[var(--glass-border)]"
    >
      {/* Logo Section */}
      <div className="mb-8">
        <NavLink to="/feed" className="inline-block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CONFERIA
          </h1>
        </NavLink>
        <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
          <FiHash className="text-purple-400" />
          Anonymous Campus Network
        </p>
        {isAdmin && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-medium text-purple-400">Admin Mode</span>
          </motion.div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`text-lg transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                <div className="flex-1">
                  <span className="font-medium text-sm">{item.label}</span>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="absolute right-2 w-1 h-8 bg-purple-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info Section */}
      {user && (
        <div className="mb-4 p-3 rounded-xl bg-[var(--bg-tertiary)]">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
              {user.displayName?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)] truncate">
                {user.displayName || 'Anonymous User'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-[var(--glass-border)]">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm text-[var(--text-secondary)]">Theme</span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full group"
        >
          <FiLogOut className="text-lg group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium text-sm">Sign Out</span>
        </motion.button>

        <p className="text-center text-xs text-[var(--text-secondary)] pt-2">
          v1.0.0 • Made for Students
        </p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;