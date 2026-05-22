import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiGrid, 
  FiEye, 
  FiEyeOff, 
  FiUserPlus,
  FiCheck,
  FiX,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

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

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['red', 'orange', 'yellow', 'blue', 'green'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    // Validation
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
      // Firebase authentication will be integrated here
      // await createUserWithEmailAndPassword(auth, email, password);
      // Then save user data to Firestore with pending status
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.section
      );
      
      toast.success('Account created! Awaiting admin approval ✨', {
        duration: 4000,
      });
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
      <div className="glass-card relative overflow-hidden">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
        
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
          >
            <FiUserPlus className="text-2xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join Conferia
          </h1>
          <p className="text-[var(--text-secondary)] text-sm flex items-center justify-center gap-2">
            <FiShield className="text-purple-400" />
            Your identity stays anonymous. Always.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            {step > 1 ? <FiCheck className="text-sm" /> : '1'}
          </div>
          <div className={`w-12 h-0.5 transition-all ${step >= 2 ? 'bg-purple-500' : 'bg-gray-700'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            2
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : -20 }}
            className={step === 1 ? 'block' : 'hidden'}
          >
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  Full Name
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="glass-input pl-10 pr-4"
                    placeholder="Priya Sharma"
                    required
                    autoComplete="name"
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] ml-1 flex items-center gap-1">
                  <FiShield className="text-purple-400 text-xs" />
                  Only visible to admins for verification
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  College Email
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input pl-10 pr-4"
                    placeholder="you@college.edu"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Next Button */}
              <motion.button
                type="button"
                onClick={handleNextStep}
                className="glass-button w-full text-white flex items-center justify-center gap-2 mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
                <span className="text-lg">→</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Step 2: Account Setup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: step === 2 ? 1 : 0, x: step === 2 ? 0 : 20 }}
            className={step === 2 ? 'block' : 'hidden'}
          >
            <div className="space-y-5">
              {/* Section/Class */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  Section / Class
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <FiGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="glass-input pl-10 pr-4"
                    placeholder="CSE-A / ECE-3rd Year"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  Password
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input pl-10 pr-12"
                    placeholder="Min. 8 characters"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--text-primary)] transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= passwordStrength
                              ? `bg-${strengthColors[passwordStrength]}-500`
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs text-${strengthColors[passwordStrength]}-400`}>
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                  Confirm Password
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="glass-input pl-10 pr-4"
                    placeholder="Re-enter password"
                    required
                    autoComplete="new-password"
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {formData.password === formData.confirmPassword ? (
                        <FiCheck className="text-green-400" />
                      ) : (
                        <FiX className="text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 rounded-xl border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Back
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-[2] glass-button text-white flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="text-lg" />
                      Create Anonymous Account
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center pb-2">
          <p className="text-[var(--text-secondary)] text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10"
      >
        <div className="flex items-start gap-2">
          <FiShield className="text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-[var(--text-primary)] mb-1">
              Your Privacy Matters
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Your real identity is only used for verification and is never shown publicly. 
              You'll receive an auto-generated anonymous username and avatar.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;