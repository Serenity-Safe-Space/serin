// Anonymous nickname generation utility for wellness app
// Generates positive, calming nicknames suitable for mental health context

const WELLNESS_ADJECTIVES = [
  'Calm', 'Zen', 'Peaceful', 'Serene', 'Gentle', 'Kind', 'Wise', 'Bright',
  'Soft', 'Warm', 'Cool', 'Clear', 'Pure', 'Light', 'Sweet', 'Fresh',
  'Quiet', 'Still', 'Steady', 'Brave', 'Strong', 'Free', 'Open', 'True',
  'Deep', 'Mindful', 'Caring', 'Loving', 'Hopeful', 'Joyful', 'Radiant', 'Vibrant'
];

const WELLNESS_NOUNS = [
  'Soul', 'Spirit', 'Heart', 'Mind', 'Dreamer', 'Seeker', 'Guide', 'Healer',
  'Wanderer', 'Explorer', 'Guardian', 'Keeper', 'Watcher', 'Listener', 'Helper',
  'Friend', 'Companion', 'Traveler', 'Journey', 'Path', 'River', 'Ocean',
  'Mountain', 'Tree', 'Star', 'Moon', 'Sun', 'Cloud', 'Breeze', 'Wave',
  'Flame', 'Light', 'Dawn', 'Dusk', 'Rainbow', 'Bloom', 'Petal', 'Leaf'
];

const ANIMALS = [
  'Panda', 'Owl', 'Dove', 'Swan', 'Deer', 'Fox', 'Wolf', 'Bear',
  'Cat', 'Rabbit', 'Turtle', 'Butterfly', 'Bee', 'Bird', 'Fish',
  'Whale', 'Dolphin', 'Seal', 'Otter', 'Koala', 'Sloth', 'Penguin'
];

// Basic profanity filter - expand as needed
const INAPPROPRIATE_WORDS = [
  'hate', 'angry', 'mad', 'bad', 'evil', 'dark', 'death', 'kill',
  'hurt', 'pain', 'sad', 'cry', 'fear', 'scary', 'monster', 'demon'
];

/**
 * Generates a random wellness-themed nickname
 * Format: [Adjective][Noun/Animal][2-digit number]
 * Examples: CalmSoul42, ZenPanda88, PeacefulRiver15
 */
export function generateNickname(): string {
  const adjective = WELLNESS_ADJECTIVES[Math.floor(Math.random() * WELLNESS_ADJECTIVES.length)];
  
  // Mix nouns and animals for variety
  const allNouns = [...WELLNESS_NOUNS, ...ANIMALS];
  const noun = allNouns[Math.floor(Math.random() * allNouns.length)];
  
  // Generate 2-digit number (10-99)
  const number = Math.floor(Math.random() * 90) + 10;
  
  return `${adjective}${noun}${number}`;
}

/**
 * Generates multiple nickname suggestions
 */
export function generateNicknameSuggestions(count: number = 5): string[] {
  const suggestions = new Set<string>();
  
  // Generate unique suggestions
  while (suggestions.size < count) {
    suggestions.add(generateNickname());
  }
  
  return Array.from(suggestions);
}

/**
 * Validates a nickname for appropriateness and format
 */
export function validateNickname(nickname: string): { 
  isValid: boolean; 
  error?: string 
} {
  // Check length
  if (nickname.length < 3) {
    return { isValid: false, error: 'Nickname must be at least 3 characters long' };
  }
  
  if (nickname.length > 20) {
    return { isValid: false, error: 'Nickname must be 20 characters or less' };
  }
  
  // Check for alphanumeric characters only
  if (!/^[a-zA-Z0-9]+$/.test(nickname)) {
    return { isValid: false, error: 'Nickname can only contain letters and numbers' };
  }
  
  // Check for inappropriate words
  const lowerNickname = nickname.toLowerCase();
  for (const word of INAPPROPRIATE_WORDS) {
    if (lowerNickname.includes(word)) {
      return { isValid: false, error: 'Please choose a more positive nickname' };
    }
  }
  
  return { isValid: true };
}

/**
 * Checks if a nickname follows the generated format
 * (This is optional - users can also create custom nicknames)
 */
export function isGeneratedFormat(nickname: string): boolean {
  // Check if it matches the pattern: [Word][Word][Number]
  const pattern = /^[A-Z][a-z]+[A-Z][a-z]+\d{2}$/;
  return pattern.test(nickname);
}

/**
 * Creates a display version of the nickname with proper spacing
 * Example: "CalmSoul42" -> "Calm Soul 42"
 */
export function formatNicknameForDisplay(nickname: string): string {
  if (!isGeneratedFormat(nickname)) {
    return nickname; // Return as-is for custom nicknames
  }
  
  // Split on capital letters and numbers
  return nickname.replace(/([A-Z])/g, ' $1').replace(/(\d)/g, ' $1').trim();
}