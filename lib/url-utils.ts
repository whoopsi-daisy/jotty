export function getHashFromUrl(): string {
  if (typeof window === 'undefined') return ''
  return window.location.hash.slice(1)
}

export function setHashInUrl(hash: string | null) {
  if (typeof window === 'undefined') return
  if (hash) {
    window.location.hash = hash
  } else {
    // Remove the hash without causing a page jump
    history.pushState('', document.title, window.location.pathname + window.location.search)
  }
} 