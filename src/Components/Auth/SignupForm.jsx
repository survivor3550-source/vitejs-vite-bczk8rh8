import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiGrid, FiEye, FiEyeOff, FiUserPlus, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClasses = ['bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-400'];

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    section: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColorClass = ['bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-400'][Math.min(passwordStrength, 4)];
  const strengthTextClass = ['text-red-500', 'text-orange-500', 'text-amber-400', 'text-sky-400', 'text-emerald-400'][Math.min(passwordStrength, 4)];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (formData.fullName.trim().length < 3) {
      toast.error('Name must be at least 3 characters');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      toast.success('Personal info saved! 🔒', { duration: 2000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.section.trim()) {
      toast.error('Please enter your section/class');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (passwordStrength < 2) {
      toast.error('Please use a stronger password');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signup(formData.email, formData.password, formData.fullName, formData.section);
      toast.success('Account created! Awaiting admin approval ✨', { duration: 4000 });
      navigate('/waiting-approval');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-3xl border border-white/10 bg-[#070707] p-8 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.75)] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-slate-700" />

        <div className="text-center mb-8 pt-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
            <FiUserPlus className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Conferia</h1>
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <FiLock className="text-slate-400" /> Your identity stays anonymous. Always.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-sky-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
            {step > 1 ? <FiCheck className="text-sm" /> : '1'}
          </div>
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-sky-500' : 'bg-slate-700'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-sky-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
            2
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                  Full Name
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 text-sm text-white outline-none transition focus:border-sky-400"
                    placeholder="Priya Sharma"
                    required
                    autoComplete="name"
                  />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <FiLock className="text-slate-500 text-xs" /> Only visible to admins for verification
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                  College Email
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 text-sm text-white outline-none transition focus:border-sky-400"
                    placeholder="you@college.edu"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleNextStep}
                className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-sky-400"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </div>
          </div>

          <div className={step === 2 ? 'block' : 'hidden'}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                  Section / Class
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FiGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 text-sm text-white outline-none transition focus:border-sky-400"
                    placeholder="CSE-A / ECE 3rd year"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                  Password
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-400"
                    placeholder="Min. 8 characters"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${level <= passwordStrength ? strengthColorClass : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${strengthTextClass}`}>
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-800 bg-[#0f0f0f] px-10 py-3 text-sm text-white outline-none transition focus:border-sky-400"
                    placeholder="Repeat password"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </motion.button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupForm;
