import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { generateUsername } from '../utils/usernameGenerator';
import { getRandomAvatar } from '../utils/avatarGenerator';
import { ADMIN_EMAIL } from '../utils/constants';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || firebaseUser.displayName,
              username: userData.username,
              avatar: userData.avatar,
              isApproved: userData.status === 'active',
              isAdmin: firebaseUser.email === ADMIN_EMAIL,
              section: userData.section,
              realName: userData.realName,
              createdAt: userData.createdAt?.toDate(),
              ...userData,
            });
          } else {
            // User doc doesn't exist yet (might be in process of creation)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              isApproved: false,
              isAdmin: firebaseUser.email === ADMIN_EMAIL,
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            isApproved: false,
            isAdmin: firebaseUser.email === ADMIN_EMAIL,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if user is approved
        if (userData.status !== 'active' && email !== ADMIN_EMAIL) {
          await signOut(auth);
          throw new Error('Account pending approval');
        }
        
        toast.success('Welcome back! 🎉');
        return userCredential.user;
      } else {
        throw new Error('User data not found');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        default:
          if (err.message === 'Account pending approval') {
            errorMessage = 'Your account is still pending approval';
          }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup function
  const signup = useCallback(async (email, password, realName, section) => {
    setLoading(true);
    setError(null);
    
    try {
      // Firebase Authentication - Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Generate anonymous identity
      const username = generateUsername(userCredential.user.uid);
      const avatar = getRandomAvatar(userCredential.user.uid);
      
      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        realName: realName,
        section: section,
        username: username,
        avatar: avatar,
        displayName: username,
        status: email === ADMIN_EMAIL ? 'active' : 'pending', // Auto-approve admin
        role: email === ADMIN_EMAIL ? 'admin' : 'student',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        posts: 0,
        likes: 0,
        comments: 0,
        isBanned: false,
      });
      
      // Sign out the user (they need to wait for approval)
      await signOut(auth);
      
      toast.success('Account created! Awaiting admin approval ✨');
      return userCredential.user;
    } catch (err) {
      console.error('Signup error:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 8 characters';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox 📧');
    } catch (err) {
      console.error('Password reset error:', err);
      
      let errorMessage = 'Failed to send reset email';
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
      }
      
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (updates) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      setUser(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated!');
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error('Failed to update profile');
      throw err;
    }
  }, [user]);

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Check if user is approved
  const isApproved = user?.isApproved || user?.email === ADMIN_EMAIL;

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    isAdmin,
    isApproved,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    // If no provider, return mock for development
    console.warn('useAuth must be used within an AuthProvider. Using mock auth.');
    return useMockAuth();
  }
  
  return context;
};

// Mock auth for development without Firebase
const useMockAuth = () => {
  const [user, setUser] = useState(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('mockUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      uid: 'mock-user-123',
      email: email,
      displayName: generateUsername('mock-user-123'),
      username: generateUsername('mock-user-123'),
      avatar: getRandomAvatar('mock-user-123'),
      isApproved: true,
      isAdmin: email === ADMIN_EMAIL,
      section: 'CSE-A',
      realName: 'Demo User',
      createdAt: new Date(),
    };
    
    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const signup = async (email, password, realName, section) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    // Don't auto-login after signup (pending approval)
    return { email, realName, section };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const resetPassword = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const updateUserProfile = async (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      const updated = { ...JSON.parse(savedUser), ...updates };
      localStorage.setItem('mockUser', JSON.stringify(updated));
    }
  };

  return {
    user,
    loading,
    error: null,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    isAdmin: user?.email === ADMIN_EMAIL,
    isApproved: user?.isApproved || user?.email === ADMIN_EMAIL,
  };
};

export default useAuth;