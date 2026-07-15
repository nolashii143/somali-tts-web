export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  createdAt: string;
  durationMs?: number;
}

export interface FavoriteItem {
  id: string;
  text: string;
  label: string;
  createdAt: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  saveHistory: boolean;
  showExamples: boolean;
}

export interface AppStats {
  totalGenerations: number;
  totalFavorites: number;
  lastGeneratedAt: string | null;
}
