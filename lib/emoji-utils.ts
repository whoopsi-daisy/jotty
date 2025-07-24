import emojis from '@/utils/emojis.json'

export function findMatchingEmoji(text: string): string {
  const words = text.toLowerCase().split(/\s+/)
  
  for (const word of words) {
    // Check exact matches first
    if (emojis[word as keyof typeof emojis]) {
      return emojis[word as keyof typeof emojis]
    }
    
    // Check partial matches
    for (const [key, emoji] of Object.entries(emojis)) {
      if (key.includes(word) || word.includes(key)) {
        return emoji
      }
    }
  }
  
  // Default emoji for items without matches
  return '📝'
} 