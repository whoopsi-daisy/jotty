import emojis from "@/utils/emojis.json";

interface EmojiDictionary {
  [key: string]: string;
}

// Helper to remove common plural endings
function getSingular(word: string): string {
  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }
  if (word.endsWith("es")) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s")) {
    return word.slice(0, -1);
  }
  return word;
}

// Helper to get all word variations to check
function getWordVariations(word: string): string[] {
  const variations = [
    word.toLowerCase(), // Original lowercase
    getSingular(word.toLowerCase()), // Singular form
    word.toLowerCase().replace(/[^a-z]/g, ""), // Without special chars
  ];
  return variations.filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
}

export function findMatchingEmoji(text: string): string {
  const emojiDict = emojis as EmojiDictionary;

  // Split into words and get variations for each
  const words = text.split(/\s+/);
  const allWordVariations = words.map(getWordVariations).flat();

  // First try exact matches (case insensitive)
  for (const word of allWordVariations) {
    const emoji = emojiDict[word];
    if (emoji) {
      return emoji;
    }
  }

  // Then try partial matches, but only if they start at a word boundary
  for (const [key, emoji] of Object.entries(emojiDict)) {
    for (const word of allWordVariations) {
      // Only match if it's a word boundary match
      if (
        word.length >= 3 && // Minimum length to avoid too short matches
        (key === word ||
          key.startsWith(word + " ") ||
          key.endsWith(" " + word) ||
          key.includes(" " + word + " "))
      ) {
        return emoji;
      }
    }
  }

  // If no matches found, try compound words (e.g., "checklist" -> "check")
  for (const word of allWordVariations) {
    if (word.length > 5) {
      // Only for longer words
      for (const [key, emoji] of Object.entries(emojiDict)) {
        if (word.includes(key) && key.length > 3) {
          // Avoid matching too short substrings
          return emoji;
        }
      }
    }
  }

  return ""; // No match found
}
