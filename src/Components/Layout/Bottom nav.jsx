import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiUser, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN_EMAIL } from '../../utils/constants';

const BottomNav = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const navItems = [
    { to: '/feed', icon: FiHome, label: 'Feed' },
    { to: '/trending', icon: FiTrendingUp, label: 'Trending' },
    ...(isAdmin ? [{ to: '/admin', icon: FiShield, label: 'Admin' }] : []),
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      <div className="glass-morphism border-t border-[var(--glass-border)]">
        <div className="max-w-lg mx-auto flex justify-around py-3 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-purple-400 scale-110'
                    : 'text-gray-400 hover:text-gray-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`text-xl transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-0.5 w-8 h-0.5 bg-purple-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* Safe area padding for mobile devices */}
      <div className="h-safe-area bg-[var(--bg-primary)]" />
    </motion.nav>
  );
};

export default BottomNav;