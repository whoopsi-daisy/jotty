export function getHashFromUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.slice(1);
}

export function setHashInUrl(hash: string | null) {
  if (typeof window === "undefined") return;
  if (hash) {
    window.location.hash = hash;
  } else {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
  }
}
