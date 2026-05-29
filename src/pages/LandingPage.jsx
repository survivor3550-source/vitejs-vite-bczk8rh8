import React from 'react';
import { motion } from 'framer-motion';
import { FaAndroid, FaApple } from 'react-icons/fa';
import { APK_URL } from '@/config/download';

/**
 * Premium Single-Page Landing Page for Conferia
 * Designed with a monochrome, minimal aesthetic.
 */
const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/40 font-sans antialiased scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter cursor-pointer">CONFERIA</div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">App Preview</a>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative pt-32 md:pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-24 bg-white rounded-3xl mb-12 flex items-center justify-center text-black font-black text-5xl shadow-2xl"
          >
            C
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-8 text-white leading-[1.1]"
          >
            Campus Conversations.<br /> Reimagined.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-zinc-400 text-xl md:text-2xl mb-16 max-w-2xl font-light"
          >
            Anonymous. Campus-first. Realtime discussions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <a
              href={APK_URL}
              className="group px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-300 transition-all flex items-center gap-3 text-lg shadow-2xl"
            >
              <FaAndroid className="text-2xl" />
              Download for Android
            </a>
            <button 
              disabled 
              className="px-10 py-5 bg-zinc-900 text-zinc-500 font-bold rounded-2xl border border-white/10 flex items-center gap-3 text-lg cursor-not-allowed"
            >
              <FaApple className="text-2xl opacity-50" />
              iOS Coming Soon
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Features */}
      <section id="features" className="py-32 px-6 border-y border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Anonymous Posting"
              description="Speak freely without revealing your identity." 
              icon="🔒"
            />
            <FeatureCard 
              title="Campus Communities"
              description="Connect with students around your campus." 
              icon="🏫"
            />
            <FeatureCard 
              title="Realtime Discussions"
              description="Instant conversations and updates." 
              icon="⚡"
            />
            <FeatureCard 
              title="Privacy First"
              description="Built with simplicity and privacy." 
              icon="🛡️"
            />
          </div>
        </div>
      </section>

      {/* Section 3: App Preview */}
      <section id="preview" className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-4xl font-bold mb-6">Designed for Students.</h2>
          <p className="text-zinc-400 text-lg">Clean, monochrome, and focused on what matters.</p>
        </div>
        
        <div className="flex justify-center gap-12 flex-wrap lg:flex-nowrap">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              {...fadeInUp}
              className="w-full max-w-[300px] aspect-[9/19] bg-zinc-950 rounded-[3rem] border-[12px] border-zinc-900 shadow-2xl flex items-center justify-center relative group overflow-hidden"
            >
              <span className="text-zinc-700 font-bold uppercase tracking-widest text-sm italic group-hover:text-zinc-500 transition-colors">
                Mockup {i}
              </span>
              <div className="absolute inset-0 border border-white/5 rounded-[2.2rem] pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: CTA */}
      <section id="download" className="py-48 px-6 text-center">
        <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-12 tracking-tight">Ready to join Conferia?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={APK_URL}
              className="inline-flex px-12 py-6 bg-white text-black font-black rounded-2xl hover:bg-zinc-300 transition-all text-xl md:text-2xl"
            >
              Download Android App
            </a>
            <button
              disabled
              className="inline-flex px-12 py-6 bg-transparent text-zinc-500 font-bold rounded-2xl border border-white/10 text-xl md:text-2xl cursor-not-allowed"
            >
              iOS Coming Soon
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div>
            <div className="text-2xl font-black tracking-tighter mb-2">CONFERIA</div>
            <p className="text-zinc-500 text-sm">Made for students.</p>
          </div>
          <div className="flex gap-12 text-sm text-zinc-400">
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="p-10 rounded-3xl bg-zinc-900 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group">
    <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-zinc-500 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;