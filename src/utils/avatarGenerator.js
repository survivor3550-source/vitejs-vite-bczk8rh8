// Avatar generation utility using DiceBear API
// Provides consistent, unique avatars for anonymous users

// Collection of DiceBear avatar styles
const AVATAR_STYLES = [
  'avataaars',
  'bottts',
  'identicon',
  'micah',
  'personas',
  'adventurer',
  'adventurer-neutral',
  'big-ears',
  'big-smile',
  'croodles',
  'fun-emoji',
  'lorelei',
  'miniavs',
  'notionists',
  'open-peeps',
  'pixel-art',
  'pixel-art-neutral',
  'thumbs',
];

// Color palettes for avatars
const COLOR_PALETTES = [
  'FF6B6B', // Coral Red
  '4ECDC4', // Turquoise
  '45B7D1', // Sky Blue
  '96CEB4', // Sage Green
  'FFEAA7', // Pastel Yellow
  'DDA0DD', // Plum
  '98D8C8', // Mint
  'F7DC6F', // Golden
  'BB8FCE', // Lavender
  '85C1E9', // Light Blue
  'F8C471', // Sandy
  '82E0AA', // Emerald
  'F1948A', // Salmon
  '85929E', // Slate
  'AED6F1', // Baby Blue
  'D7BDE2', // Lilac
  'A3E4D7', // Seafoam
  'FAD7A0', // Peach
  'D5DBDB', // Silver
  'ABEBC6', // Light Green
];

// Background colors for avatars
const BACKGROUND_COLORS = [
  'b6e3f4', // Light Blue
  'c0aede', // Purple
  'd1d4f9', // Lavender
  'ffd5dc', // Pink
  'ffdfbf', // Peach
  'c1e1c1', // Mint Green
  'f0e68c', // Khaki
  'dda0dd', // Plum
  'b0e0e6', // Powder Blue
  'fafad2', // Light Goldenrod
  'e6e6fa', // Lavender
  'ffe4e1', // Misty Rose
  'f0fff0', // Honeydew
  'f5f5dc', // Beige
  'fff0f5', // Lavender Blush
];

// Seed phrases for generating unique avatars
const SEED_PHRASES = [
  'conferia',
  'anonymous',
  'student',
  'campus',
  'confession',
  'community',
  'college',
  'secret',
  'whisper',
  'shadow',
  'mystery',
  'hidden',
  'unknown',
  'private',
  'secure',
];

// Get a deterministic random avatar URL
export const getRandomAvatar = (userId, style = null) => {
  if (!userId) {
    // Fallback to a default avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4`;
  }

  // Create a consistent seed from userId
  const seed = createSeed(userId);
  
  // Select style based on userId hash if not specified
  const selectedStyle = style || AVATAR_STYLES[hashString(userId) % AVATAR_STYLES.length];
  
  // Select background color
  const bgColor = BACKGROUND_COLORS[hashString(userId + 'bg') % BACKGROUND_COLORS.length];
  
  // Build avatar URL
  const params = new URLSearchParams({
    seed: seed,
    backgroundColor: bgColor,
  });

  // Add style-specific options
  switch (selectedStyle) {
    case 'avataaars':
      params.append('top', 'shortHair,longHair');
      params.append('accessories', 'prescription01,prescription02,round,sunglasses');
      params.append('facialHair', 'beardMedium,beardLight');
      params.append('clothes', 'hoodie,blazerAndShirt,graphicShirt');
      break;
    case 'bottts':
      params.append('colors', COLOR_PALETTES.slice(0, 5).join(','));
      break;
    case 'personas':
      params.append('backgroundColor', bgColor);
      break;
    case 'micah':
      params.append('baseColor', COLOR_PALETTES[hashString(userId) % COLOR_PALETTES.length]);
      params.append('hairColor', COLOR_PALETTES[(hashString(userId) + 1) % COLOR_PALETTES.length]);
      break;
    case 'pixel-art':
    case 'pixel-art-neutral':
      params.append('size', '128');
      break;
  }

  return `https://api.dicebear.com/7.x/${selectedStyle}/svg?${params.toString()}`;
};

// Generate avatar with specific options
export const getCustomAvatar = (userId, options = {}) => {
  const {
    style = 'avataaars',
    mood = 'happy',
    accessories = null,
    hairColor = null,
    clothingColor = null,
  } = options;

  const seed = createSeed(userId);
  const params = new URLSearchParams({ seed });

  if (mood) params.append('mood', mood);
  if (accessories) params.append('accessories', accessories);
  if (hairColor) params.append('hairColor', hairColor);
  if (clothingColor) params.append('clothingColor', clothingColor);

  // Add random background
  const bgColor = BACKGROUND_COLORS[hashString(userId + 'bg') % BACKGROUND_COLORS.length];
  params.append('backgroundColor', bgColor);

  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`;
};

// Generate multiple avatar options for user to choose from
export const getAvatarOptions = (userId, count = 4) => {
  const options = [];
  
  for (let i = 0; i < count; i++) {
    const style = AVATAR_STYLES[(hashString(userId + i) % AVATAR_STYLES.length)];
    const avatar = getRandomAvatar(userId + i, style);
    options.push({
      id: `avatar-${i}`,
      url: avatar,
      style: style,
    });
  }
  
  return options;
};

// Get initials avatar as fallback
export const getInitialsAvatar = (username) => {
  if (!username) return '';
  
  const initials = username
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const bgColor = BACKGROUND_COLORS[hashString(username) % BACKGROUND_COLORS.length];
  const textColor = getContrastColor(bgColor);
  
  // Create SVG data URL for initials avatar
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#${bgColor}" rx="20"/>
      <text x="50" y="55" font-family="Arial, sans-serif" font-size="40" font-weight="bold" 
            fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Generate a deterministic color from a string
export const getColorFromString = (str) => {
  const colorIndex = hashString(str) % COLOR_PALETTES.length;
  return `#${COLOR_PALETTES[colorIndex]}`;
};

// Generate a gradient avatar background
export const getGradientAvatar = (userId) => {
  const color1 = COLOR_PALETTES[hashString(userId) % COLOR_PALETTES.length];
  const color2 = COLOR_PALETTES[hashString(userId + '2') % COLOR_PALETTES.length];
  const angle = hashString(userId + 'angle') % 360;
  
  return `linear-gradient(${angle}deg, #${color1}, #${color2})`;
};

// Get avatar with gradient background
export const getGradientAvatarUrl = (userId, username) => {
  const gradient = getGradientAvatar(userId);
  const initials = username 
    ? username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AN';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradient.split(',')[0].split('#')[1] || '7c3aed'};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradient.split(',')[1]?.split('#')[1] || 'ec4899'};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad)" rx="40"/>
      <text x="100" y="110" font-family="'Inter', Arial, sans-serif" font-size="80" font-weight="700" 
            fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.9">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Helper function to create a consistent seed from userId
const createSeed = (userId) => {
  // Use part of the userId hash to create a consistent seed
  const hash = hashString(userId);
  const seedIndex = hash % SEED_PHRASES.length;
  return `${SEED_PHRASES[seedIndex]}-${userId.substring(0, 8)}`;
};

// Simple string hash function
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Get contrast color (black or white) for text on background
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '1a1a2e' : 'ffffff';
};

// Cache for generated avatars to avoid regenerating
const avatarCache = new Map();

// Get cached avatar or generate new one
export const getCachedAvatar = (userId, style = null) => {
  const cacheKey = `${userId}-${style || 'default'}`;
  
  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey);
  }
  
  const avatar = getRandomAvatar(userId, style);
  avatarCache.set(cacheKey, avatar);
  
  // Limit cache size
  if (avatarCache.size > 1000) {
    const firstKey = avatarCache.keys().next().value;
    avatarCache.delete(firstKey);
  }
  
  return avatar;
};

// Clear avatar cache
export const clearAvatarCache = () => {
  avatarCache.clear();
};

// Preload common avatars
export const preloadAvatars = (userIds) => {
  userIds.forEach(userId => {
    const avatar = getRandomAvatar(userId);
    const img = new Image();
    img.src = avatar;
  });
};

// Export default
export default {
  getRandomAvatar,
  getCustomAvatar,
  getAvatarOptions,
  getInitialsAvatar,
  getColorFromString,
  getGradientAvatarUrl,
  getCachedAvatar,
  clearAvatarCache,
  preloadAvatars,
};