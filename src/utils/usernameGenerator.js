// ============================================
// CONFERIA - Anonymous Username Generator
// ============================================

import { ADMIN_EMAIL } from './constants';

// Counter for sequential username generation
let globalUsernameCounter = 1;

// Reserved usernames that cannot be assigned
const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'moderator',
  'mod',
  'system',
  'conferia',
  'official',
  'staff',
  'faculty',
  'professor',
  'teacher',
  'principal',
  'director',
  'dean',
  'hod',
  'registrar',
];

// Adjectives for alternative username formats (future use)
const ADJECTIVES = [
  'Silent',
  'Mysterious',
  'Hidden',
  'Secret',
  'Unknown',
  'Shadowy',
  'Veiled',
  'Masked',
  'Covert',
  'Stealthy',
  'Phantom',
  'Ghostly',
  'Enigmatic',
  'Cryptic',
  'Elusive',
  'Incognito',
  'Nameless',
  'Faceless',
  'Unseen',
  'Private',
];

// Nouns for alternative username formats (future use)
const NOUNS = [
  'Phoenix',
  'Wolf',
  'Eagle',
  'Tiger',
  'Falcon',
  'Raven',
  'Fox',
  'Owl',
  'Panther',
  'Dragon',
  'Cobra',
  'Hawk',
  'Lynx',
  'Viper',
  'Jaguar',
  'Badger',
  'Coyote',
  'Mustang',
  'Scorpion',
  'Wolverine',
];

// Generate anonymous username based on user ID
export const generateUsername = (userId) => {
  if (!userId) {
    return 'Anonymous User';
  }

  // Check if user is admin
  if (userId === 'admin' || userId.includes('admin')) {
    return 'Admin';
  }

  // Generate deterministic number from userId hash
  const assignedNumber = getDeterministicNumber(userId);
  
  return `Anonymous ${assignedNumber}`;
};

// Generate sequential username (increments counter)
export const generateSequentialUsername = () => {
  const username = `Anonymous ${globalUsernameCounter}`;
  globalUsernameCounter++;
  
  // Reset counter if it exceeds max
  if (globalUsernameCounter > 300) {
    globalUsernameCounter = 1;
  }
  
  return username;
};

// Get deterministic number from string hash
const getDeterministicNumber = (str) => {
  const hash = hashString(str);
  // Generate number between 1 and 300
  return (hash % 300) + 1;
};

// Generate a unique username not already in use
export const generateUniqueUsername = (existingUsernames = []) => {
  let username;
  let attempts = 0;
  const maxAttempts = 300;

  do {
    username = `Anonymous ${Math.floor(Math.random() * 300) + 1}`;
    attempts++;
  } while (existingUsernames.includes(username) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    // Fallback to sequential if random fails
    return generateSequentialUsername();
  }

  return username;
};

// Generate username from real name (not used publicly, for admin reference only)
export const generatePrivateUsername = (realName) => {
  if (!realName) return 'Unknown';
  
  const parts = realName.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1]}`.toLowerCase();
  }
  return parts[0].toLowerCase();
};

// Check if username is valid
export const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  
  // Check if it's a reserved username
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) return false;
  
  // Check format: "Anonymous X" where X is 1-300
  const match = username.match(/^Anonymous (\d+)$/);
  if (match) {
    const number = parseInt(match[1]);
    return number >= 1 && number <= 300;
  }
  
  return false;
};

// Parse username to get number
export const getUsernameNumber = (username) => {
  const match = username?.match(/^Anonymous (\d+)$/);
  return match ? parseInt(match[1]) : null;
};

// Format display username
export const formatUsername = (username) => {
  if (!username) return 'Anonymous';
  
  // If already in correct format, return as is
  if (username.startsWith('Anonymous')) return username;
  
  // If it's a private username, hide it
  return 'Anonymous';
};

// Generate a batch of usernames
export const generateBatchUsernames = (count) => {
  const usernames = [];
  for (let i = 0; i < count; i++) {
    usernames.push(generateSequentialUsername());
  }
  return usernames;
};

// Reset username counter (for testing)
export const resetUsernameCounter = () => {
  globalUsernameCounter = 1;
};

// Get current counter value
export const getUsernameCounter = () => {
  return globalUsernameCounter;
};

// Set username counter to specific value
export const setUsernameCounter = (value) => {
  if (value >= 1 && value <= 300) {
    globalUsernameCounter = value;
  }
};

// Generate creative anonymous username (alternative format)
export const generateCreativeUsername = (userId) => {
  if (!userId) return 'Anonymous';

  const hash = hashString(userId);
  const adjective = ADJECTIVES[hash % ADJECTIVES.length];
  const noun = NOUNS[(hash * 7) % NOUNS.length];
  
  return `${adjective}${noun}`;
};

// Generate username with custom prefix
export const generateCustomUsername = (userId, prefix = 'Anonymous') => {
  const number = getDeterministicNumber(userId);
  return `${prefix} ${number}`;
};

// Check if username belongs to specific user
export const isUserUsername = (userId, username) => {
  const expectedUsername = generateUsername(userId);
  return expectedUsername === username;
};

// Get all possible usernames
export const getAllPossibleUsernames = () => {
  const usernames = [];
  for (let i = 1; i <= 300; i++) {
    usernames.push(`Anonymous ${i}`);
  }
  return usernames;
};

// Get username color based on number
export const getUsernameColor = (username) => {
  const number = getUsernameNumber(username);
  if (!number) return '#7c3aed'; // Default purple
  
  const colors = [
    '#7c3aed', // Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#f97316', // Orange
    '#14b8a6', // Teal
  ];
  
  return colors[number % colors.length];
};

// Get username avatar seed
export const getUsernameAvatarSeed = (username) => {
  const number = getUsernameNumber(username);
  return number ? `user-${number}` : 'default-user';
};

// Admin username check
export const isAdminUsername = (username) => {
  return username?.toLowerCase() === 'admin';
};

// Generate admin display name
export const generateAdminUsername = (email) => {
  if (email === ADMIN_EMAIL) {
    return 'Admin';
  }
  return generateUsername(email);
};

// Format username for display with styling
export const getUsernameDisplay = (username, isAdmin = false) => {
  return {
    displayName: username || 'Anonymous',
    isAnonymous: username?.startsWith('Anonymous'),
    isAdmin: isAdmin || isAdminUsername(username),
    color: getUsernameColor(username),
    avatarSeed: getUsernameAvatarSeed(username),
  };
};

// Simple string hash function (consistent with avatar generator)
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Username statistics
export const getUsernameStats = (usedUsernames = []) => {
  return {
    total: 300,
    used: usedUsernames.length,
    available: 300 - usedUsernames.length,
    percentage: Math.round((usedUsernames.length / 300) * 100),
  };
};

// Find next available username
export const findNextAvailableUsername = (usedUsernames = []) => {
  for (let i = 1; i <= 300; i++) {
    const username = `Anonymous ${i}`;
    if (!usedUsernames.includes(username)) {
      return username;
    }
  }
  return null; // All usernames taken
};

// Export default
export default {
  generateUsername,
  generateSequentialUsername,
  generateUniqueUsername,
  generatePrivateUsername,
  isValidUsername,
  getUsernameNumber,
  formatUsername,
  generateBatchUsernames,
  resetUsernameCounter,
  getUsernameCounter,
  setUsernameCounter,
  generateCreativeUsername,
  generateCustomUsername,
  isUserUsername,
  getAllPossibleUsernames,
  getUsernameColor,
  getUsernameAvatarSeed,
  isAdminUsername,
  generateAdminUsername,
  getUsernameDisplay,
  getUsernameStats,
  findNextAvailableUsername,
};