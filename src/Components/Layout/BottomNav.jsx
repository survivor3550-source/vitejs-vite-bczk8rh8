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
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="border-t border-slate-800 bg-[#070707] px-2 py-3">
        <div className="max-w-lg mx-auto flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-xs font-medium transition ${
                  isActive
                    ? 'text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {(() => { const Icon = item.icon; return <Icon className="text-xl" />; })()}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="h-safe-area bg-[var(--bg-primary)]" />
    </motion.nav>
  );
};

export default BottomNav;
