export function getHashFromUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.slice(1);
}

export function setHashInUrl(hash: string | null) {
  if (typeof window === "undefined") return;

  // Don't set empty hash, just remove it
  if (!hash || hash.trim() === "") {
    // Use replaceState to avoid adding to browser history
    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search
    );
  } else {
    // Use replaceState to avoid adding to browser history
    window.history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search + "#" + hash
    );
  }
}
