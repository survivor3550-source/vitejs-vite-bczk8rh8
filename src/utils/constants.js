// ============================================
// CONFERIA - Application Constants
// ============================================

// Admin Configuration
export const ADMIN_EMAIL = 'survivor3550@gmail.com';

// Post Configuration
export const MAX_POST_CHARACTERS = 500;
export const MAX_COMMENT_CHARACTERS = 300;
export const POST_DELETION_DAYS = 15;
export const POSTS_PER_PAGE = 10;
export const MAX_REPLY_DEPTH = 3;

// Username Configuration
export const ANONYMOUS_PREFIX = 'Anonymous';
export const MAX_USERNAME_NUMBER = 300;

// App Configuration
export const APP_NAME = 'CONFERIA';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Anonymous Campus Community';
export const APP_TAGLINE = 'Your identity stays anonymous. Always.';

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FEED: '/feed',
  TRENDING: '/trending',
  PROFILE: '/profile',
  ADMIN: '/admin',
  WAITING_APPROVAL: '/waiting-approval',
  POST: '/post/:postId',
  NOT_FOUND: '*',
};

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  ADMIN_LOGS: 'adminLogs',
  BANS: 'bans',
};

// User Status
export const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  BANNED: 'banned',
  REJECTED: 'rejected',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Auto-approved email addresses
export const AUTO_APPROVED_EMAILS = [
  ADMIN_EMAIL,
  'test102@gmail.com',
];

// Post Status
export const POST_STATUS = {
  ACTIVE: 'active',
  DELETED: 'deleted',
  REPORTED: 'reported',
  FLAGGED: 'flagged',
};

// Report Reasons
export const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Inappropriate Content', icon: '⚠️' },
  { id: 'spam', label: 'Spam', icon: '🗑️' },
  { id: 'harassment', label: 'Harassment', icon: '🚫' },
  { id: 'hate_speech', label: 'Hate Speech', icon: '🛑' },
  { id: 'privacy', label: 'Privacy Violation', icon: '🔒' },
  { id: 'bullying', label: 'Bullying', icon: '😔' },
  { id: 'misinformation', label: 'Misinformation', icon: '❌' },
  { id: 'self_harm', label: 'Self Harm Content', icon: '🆘' },
  { id: 'other', label: 'Other', icon: '📋' },
];

// Report Status
export const REPORT_STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
};

// Report Priority
export const REPORT_PRIORITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  REPLY: 'reply',
  REPOST: 'repost',
  REPORT: 'report',
  APPROVAL: 'approval',
  BAN: 'ban',
  WARNING: 'warning',
  SYSTEM: 'system',
};

// Theme Configuration
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'conferia-theme',
  USER: 'conferia-user',
  TOKEN: 'conferia-token',
  SETTINGS: 'conferia-settings',
  ONBOARDING: 'conferia-onboarding',
};

// Animation Durations (in seconds)
export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  VERY_SLOW: 0.8,
  SPRING: { type: 'spring', stiffness: 300, damping: 25 },
  EASE: [0.4, 0, 0.2, 1],
};

// Toast Configuration
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
  PERSISTENT: Infinity,
};


// Dummy data removed — no development-only feed data remains.

// Trending Topics (for sidebar/widget)
export const TRENDING_TOPICS = [
  { id: 'topic1', name: 'Exam Stress', posts: 145, color: '#FF6B6B' },
  { id: 'topic2', name: 'Campus Life', posts: 123, color: '#4ECDC4' },
  { id: 'topic3', name: 'Relationships', posts: 98, color: '#FFEAA7' },
  { id: 'topic4', name: 'Placements', posts: 87, color: '#DDA0DD' },
  { id: 'topic5', name: 'Hostel Stories', posts: 76, color: '#45B7D1' },
  { id: 'topic6', name: 'Food Reviews', posts: 65, color: '#96CEB4' },
  { id: 'topic7', name: 'Professor Reviews', posts: 54, color: '#BB8FCE' },
  { id: 'topic8', name: 'Fest Season', posts: 43, color: '#F8C471' },
];

// Section/Class Options for Signup
export const SECTION_OPTIONS = [
  'CSE-1st Year',
  'CSE-2nd Year',
  'CSE-3rd Year',
  'CSE-4th Year',
  'ECE-1st Year',
  'ECE-2nd Year',
  'ECE-3rd Year',
  'ECE-4th Year',
  'MECH-1st Year',
  'MECH-2nd Year',
  'MECH-3rd Year',
  'MECH-4th Year',
  'IT-1st Year',
  'IT-2nd Year',
  'IT-3rd Year',
  'IT-4th Year',
  'EEE-1st Year',
  'EEE-2nd Year',
  'EEE-3rd Year',
  'EEE-4th Year',
  'CIVIL-1st Year',
  'CIVIL-2nd Year',
  'CIVIL-3rd Year',
  'CIVIL-4th Year',
];

// Admin Activity Log Types
export const ADMIN_ACTIONS = {
  APPROVE_USER: 'approve_user',
  REJECT_USER: 'reject_user',
  BAN_USER: 'ban_user',
  UNBAN_USER: 'unban_user',
  DELETE_POST: 'delete_post',
  DISMISS_REPORT: 'dismiss_report',
  RESOLVE_REPORT: 'resolve_report',
  SYSTEM_CONFIG: 'system_config',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please sign in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please slow down.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Your confession has been posted anonymously!',
  POST_DELETED: 'Post deleted successfully.',
  COMMENT_ADDED: 'Comment added successfully.',
  ACCOUNT_CREATED: 'Account created! Waiting for admin approval.',
  LOGIN_SUCCESS: 'Welcome back to Conferia!',
  LOGOUT_SUCCESS: 'Signed out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  REPORT_SUBMITTED: 'Report submitted for review.',
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  COLLEGE_EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.edu$/,
};

// Export all constants as default
export default {
  ADMIN_EMAIL,
  MAX_POST_CHARACTERS,
  MAX_COMMENT_CHARACTERS,
  POST_DELETION_DAYS,
  APP_NAME,
  APP_VERSION,
  ROUTES,
  COLLECTIONS,
  USER_STATUS,
  USER_ROLES,
  POST_STATUS,
  REPORT_REASONS,
  REPORT_STATUS,
  REPORT_PRIORITY,
  NOTIFICATION_TYPES,
  THEMES,
  STORAGE_KEYS,
  ANIMATION,
  TOAST_DURATION,
  TRENDING_TOPICS,
  SECTION_OPTIONS,
  ADMIN_ACTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
};