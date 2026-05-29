import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiMessageSquare, FiLock, FiDownload } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 group"
  >
    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-colors duration-300">
      <Icon className="text-2xl" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-zinc-500 text-base leading-relaxed group-hover:text-zinc-400 transition-colors">
      {description}
    </p>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      icon: FiLock,
      title: "Anonymous Posting",
      description: "Speak your mind freely without revealing your identity. True anonymity for honest campus conversations."
    },
    {
      icon: FiUsers,
      title: "Campus Communities",
      description: "Connect with students from your own university. Exclusive spaces for your campus culture."
    },
    {
      icon: FiMessageSquare,
      title: "Realtime Discussions",
      description: "Engage in live conversations. Watch the pulse of your campus change in real-time."
    },
    {
      icon: FiShield,
      title: "Privacy First",
      description: "Your data is yours. We prioritize security and privacy above all else in our network."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black antialiased font-sans">
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          {/* Logo & Identity */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <span className="text-black font-black text-3xl tracking-tighter">C</span>
            </div>
            <h1 className="text-sm font-black tracking-[0.3em] text-zinc-500 uppercase">CONFERIA</h1>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
            Campus Conversations.<br />
            <span className="text-zinc-700">Reimagined.</span>
          </h2>

          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The exclusive anonymous network for university students. 
            Connect, share, and discover what's happening on campus without filters.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 transition-all hover:bg-zinc-200 text-lg shadow-xl"
            >
              <FiDownload className="text-xl" />
              Download App For Android
            </motion.button>
            <motion.button
              disabled
              className="w-full sm:w-auto px-10 py-5 bg-transparent text-zinc-600 rounded-full font-bold border border-zinc-800 flex items-center justify-center gap-3 cursor-not-allowed text-lg"
            >
              <FaApple className="text-xl" />
              iOS Coming Soon
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </motion.section>

        {/* Simple Footer */}
        <footer className="py-12 border-t border-zinc-900/50 text-center">
          <p className="text-zinc-700 text-xs font-bold tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} CONFERIA &bull; Anonymous Campus Network
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;