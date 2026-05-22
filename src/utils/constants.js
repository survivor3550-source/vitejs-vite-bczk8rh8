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

// ============================================
// DUMMY DATA (Development Only)
// ============================================

// Dummy Users
export const DUMMY_USERS = [
  { id: 'user1', name: 'Rahul Sharma', section: 'CSE-A', email: 'rahul.s@college.edu' },
  { id: 'user2', name: 'Priya Patel', section: 'ECE-B', email: 'priya.p@college.edu' },
  { id: 'user3', name: 'Arjun Reddy', section: 'MECH-C', email: 'arjun.r@college.edu' },
  { id: 'user4', name: 'Sneha Gupta', section: 'CSE-B', email: 'sneha.g@college.edu' },
  { id: 'user5', name: 'Vikram Singh', section: 'IT-A', email: 'vikram.s@college.edu' },
  { id: 'user6', name: 'Neha Kapoor', section: 'EEE-B', email: 'neha.k@college.edu' },
  { id: 'user7', name: 'Amit Joshi', section: 'CIVIL-A', email: 'amit.j@college.edu' },
  { id: 'user8', name: 'Riya Malhotra', section: 'CSE-C', email: 'riya.m@college.edu' },
  { id: 'user9', name: 'Karan Mehta', section: 'ECE-A', email: 'karan.m@college.edu' },
  { id: 'user10', name: 'Pooja Desai', section: 'IT-B', email: 'pooja.d@college.edu' },
];

// Dummy Posts
export const DUMMY_POSTS = [
  {
    id: 'post1',
    userId: 'user1',
    content: "Can't believe how tough the Data Structures assignment was this week. Prof. Sharma really went all out with those tree traversal questions. Anyone else struggling?",
    timestamp: new Date(Date.now() - 3600000 * 2),
    likes: 24,
    dislikes: 3,
    reposts: 5,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 13),
  },
  {
    id: 'post2',
    userId: 'user3',
    content: "Hot take: The canteen food has actually improved this semester. Those new paneer wraps are fire 🔥 Don't @ me",
    timestamp: new Date(Date.now() - 3600000 * 5),
    likes: 67,
    dislikes: 12,
    reposts: 15,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 10),
  },
  {
    id: 'post3',
    userId: 'user4',
    content: "I have a crush on someone from my study group but I'm too scared to say anything. They're so focused on academics and I don't want to ruin the group dynamic. What would you guys do?",
    timestamp: new Date(Date.now() - 3600000 * 1),
    likes: 42,
    dislikes: 1,
    reposts: 8,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 12),
  },
  {
    id: 'post4',
    userId: 'user7',
    content: "Unpopular opinion: Group projects should be banned. I always end up doing 90% of the work while some members just show up for the presentation and take credit. Anyone else feel this pain?",
    timestamp: new Date(Date.now() - 3600000 * 8),
    likes: 89,
    dislikes: 5,
    reposts: 23,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 7),
  },
  {
    id: 'post5',
    userId: 'user2',
    content: "Just pulled an all-nighter at the library for tomorrow's exam. Shoutout to the security guard who brought me chai at 3 AM without even asking. Real MVP 🙌",
    timestamp: new Date(Date.now() - 3600000 * 0.5),
    likes: 156,
    dislikes: 2,
    reposts: 34,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 14),
  },
  {
    id: 'post6',
    userId: 'user9',
    content: "Does anyone else feel like they're just pretending to be an adult? I'm in my final year and I still feel like I'm faking it every single day. When does the 'I know what I'm doing' feeling kick in?",
    timestamp: new Date(Date.now() - 3600000 * 12),
    likes: 203,
    dislikes: 3,
    reposts: 47,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 5),
  },
  {
    id: 'post7',
    userId: 'user5',
    content: "PSA: The wifi in Block C actually works if you sit near the window on the 3rd floor. Been gatekeeping this spot for 2 months but the semester's almost over so here you go",
    timestamp: new Date(Date.now() - 3600000 * 3),
    likes: 178,
    dislikes: 1,
    reposts: 56,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 11),
  },
  {
    id: 'post8',
    userId: 'user10',
    content: "My roommate sleeps at 8 PM and wakes up at 4 AM. I sleep at 4 AM and wake up at 11 AM. We've literally perfected the art of never seeing each other despite sharing a room 😂",
    timestamp: new Date(Date.now() - 3600000 * 6),
    likes: 134,
    dislikes: 4,
    reposts: 28,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 9),
  },
  {
    id: 'post9',
    userId: 'user8',
    content: "Can we talk about how the placement season pressure is already starting? I haven't even finished my current semester and I'm already anxious about jobs. Parents keep sending LinkedIn profiles of 'Sharma ji ka beta' 😫",
    timestamp: new Date(Date.now() - 3600000 * 15),
    likes: 245,
    dislikes: 8,
    reposts: 63,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 3),
  },
  {
    id: 'post10',
    userId: 'user6',
    content: "Confession: I've been using ChatGPT for all my lab reports this semester. Am I learning anything? No. Are my grades better? Absolutely yes. The system is broken and I'm just playing the game 🤷‍♂️",
    timestamp: new Date(Date.now() - 3600000 * 10),
    likes: 312,
    dislikes: 45,
    reposts: 89,
    comments: [],
    deletionDate: new Date(Date.now() + 86400000 * 2),
  },
];

// Dummy Comments
export const DUMMY_COMMENTS = [
  {
    id: 'comment1',
    postId: 'post1',
    userId: 'user2',
    content: "Same here! The tree balancing question made no sense to me",
    timestamp: new Date(Date.now() - 3600000),
    likes: 8,
    replies: [],
  },
  {
    id: 'comment2',
    postId: 'post1',
    userId: 'user5',
    content: "Pro tip: Check out GeeksForGeeks, their explanation is much better than our textbook",
    timestamp: new Date(Date.now() - 1800000),
    likes: 15,
    replies: [],
  },
  {
    id: 'comment3',
    postId: 'post3',
    userId: 'user8',
    content: "Life's too short! Just casually mention getting coffee sometime, it's low pressure",
    timestamp: new Date(Date.now() - 3600000 * 0.5),
    likes: 23,
    replies: [],
  },
  {
    id: 'comment4',
    postId: 'post4',
    userId: 'user1',
    content: "This is why I always choose my group members carefully. Past experiences have scarred me 😅",
    timestamp: new Date(Date.now() - 3600000 * 4),
    likes: 12,
    replies: [],
  },
  {
    id: 'comment5',
    postId: 'post5',
    userId: 'user9',
    content: "Library guard deserves a medal! 🏅",
    timestamp: new Date(Date.now() - 3600000 * 0.3),
    likes: 67,
    replies: [],
  },
  {
    id: 'comment6',
    postId: 'post6',
    userId: 'user3',
    content: "Final year here and I still feel the same way. Imposter syndrome is real!",
    timestamp: new Date(Date.now() - 3600000 * 6),
    likes: 34,
    replies: [],
  },
  {
    id: 'comment7',
    postId: 'post7',
    userId: 'user6',
    content: "Not all heroes wear capes. Some just share wifi spots 🙏",
    timestamp: new Date(Date.now() - 3600000 * 2),
    likes: 45,
    replies: [],
  },
  {
    id: 'comment8',
    postId: 'post9',
    userId: 'user2',
    content: "The Sharma ji ka beta comparison is universal. We need a support group 😂",
    timestamp: new Date(Date.now() - 3600000 * 8),
    likes: 56,
    replies: [],
  },
  {
    id: 'comment9',
    postId: 'post10',
    userId: 'user4',
    content: "Honestly, everyone's doing it. The education system needs to evolve",
    timestamp: new Date(Date.now() - 3600000 * 5),
    likes: 78,
    replies: [],
  },
  {
    id: 'comment10',
    postId: 'post10',
    userId: 'user7',
    content: "At least you're honest about it! Most people pretend they're not using AI tools",
    timestamp: new Date(Date.now() - 3600000 * 3),
    likes: 42,
    replies: [],
  },
];

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
  DUMMY_USERS,
  DUMMY_POSTS,
  DUMMY_COMMENTS,
  TRENDING_TOPICS,
  SECTION_OPTIONS,
  ADMIN_ACTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
};