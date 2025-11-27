export type Vibe = "delulu" | "academic" | "gremlin" | "glow" | "villain";
export type MemeIntensity = "normal" | "unhinged";

const KEYS = {
  vibe: "vibeMode",
  saved: "swipeSavedIds",
  bookmarks: "bookmarkedIds",
  meme: "memeIntensity",
} as const;

export function getVibe(): Vibe | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(KEYS.vibe) as Vibe | null) ?? null;
}

export function setVibe(vibe: Vibe) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.vibe, vibe);
}

export function getSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.saved) || "[]");
  } catch {
    return [];
  }
}

export function addSaved(id: string) {
  const next = Array.from(new Set([...getSaved(), id]));
  localStorage.setItem(KEYS.saved, JSON.stringify(next));
  return next;
}

export function removeSaved(id: string) {
  const next = getSaved().filter((x) => x !== id);
  localStorage.setItem(KEYS.saved, JSON.stringify(next));
  return next;
}

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.bookmarks) || "[]");
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string) {
  const curr = new Set(getBookmarks());
  if (curr.has(id)) curr.delete(id);
  else curr.add(id);
  const next = Array.from(curr);
  localStorage.setItem(KEYS.bookmarks, JSON.stringify(next));
  return next;
}

export function getMemeIntensity(): MemeIntensity {
  if (typeof window === "undefined") return "normal";
  return (localStorage.getItem(KEYS.meme) as MemeIntensity) ?? "normal";
}

export function setMemeIntensity(level: MemeIntensity) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.meme, level);
}


