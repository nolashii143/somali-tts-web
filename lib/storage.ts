import type {
  AppSettings,
  AppStats,
  FavoriteItem,
  HistoryItem,
  UserProfile,
} from "./types";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  saveHistory: true,
  showExamples: true,
};

const DEFAULT_STATS: AppStats = {
  totalGenerations: 0,
  totalFavorites: 0,
  lastGeneratedAt: null,
};

function prefix(userId?: string) {
  return userId ? `somali_tts_${userId}` : "somali_tts_guest";
}

function key(userId: string | undefined, suffix: string) {
  return `${prefix(userId)}_${suffix}`;
}

function readJson<T>(storageKey: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(storageKey: string, value: T): void {
  localStorage.setItem(storageKey, JSON.stringify(value));
}

export function getHistory(userId?: string): HistoryItem[] {
  return readJson(key(userId, "history"), []);
}

export function addHistoryItem(
  item: HistoryItem,
  userId?: string,
): HistoryItem[] {
  const history = [item, ...getHistory(userId)].slice(0, 50);
  writeJson(key(userId, "history"), history);
  return history;
}

export function removeHistoryItem(id: string, userId?: string): HistoryItem[] {
  const history = getHistory(userId).filter((item) => item.id !== id);
  writeJson(key(userId, "history"), history);
  return history;
}

export function clearHistory(userId?: string): void {
  writeJson(key(userId, "history"), []);
}

export function getFavorites(userId?: string): FavoriteItem[] {
  return readJson(key(userId, "favorites"), []);
}

export function addFavorite(item: FavoriteItem, userId?: string): FavoriteItem[] {
  const favorites = [
    item,
    ...getFavorites(userId).filter((f) => f.text !== item.text),
  ];
  writeJson(key(userId, "favorites"), favorites);
  return favorites;
}

export function removeFavorite(id: string, userId?: string): FavoriteItem[] {
  const favorites = getFavorites(userId).filter((item) => item.id !== id);
  writeJson(key(userId, "favorites"), favorites);
  return favorites;
}

export function getSettings(userId?: string): AppSettings {
  return readJson(key(userId, "settings"), DEFAULT_SETTINGS);
}

export function saveSettings(settings: AppSettings, userId?: string): void {
  writeJson(key(userId, "settings"), settings);
}

export function getStats(userId?: string): AppStats {
  return readJson(key(userId, "stats"), DEFAULT_STATS);
}

export function recordGeneration(userId?: string): AppStats {
  const stats: AppStats = {
    ...getStats(userId),
    totalGenerations: getStats(userId).totalGenerations + 1,
    lastGeneratedAt: new Date().toISOString(),
  };
  writeJson(key(userId, "stats"), stats);
  return stats;
}

export function syncFavoriteCount(userId?: string): AppStats {
  const stats: AppStats = {
    ...getStats(userId),
    totalFavorites: getFavorites(userId).length,
  };
  writeJson(key(userId, "stats"), stats);
  return stats;
}

export function clearUserLocalData(userId?: string): void {
  ["history", "favorites", "settings", "stats"].forEach((suffix) =>
    localStorage.removeItem(key(userId, suffix)),
  );
}

export function createId(): string {
  return crypto.randomUUID();
}

export const EXAMPLE_PHRASES = [
  "ku soo dhowaada casharkii ugu dambeeyay ee mashiin lerning.",
  "Subax wanaagsan, sidee tahay maanta?",
  "Waad ku mahadsan tahay isticmaalka Somali TTS.",
  "Af Soomaali waa luqad qurux badan.",
];

export { DEFAULT_SETTINGS, DEFAULT_STATS };
