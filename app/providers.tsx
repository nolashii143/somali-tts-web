"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/app/auth-provider";
import { clearAllAudio } from "@/lib/audio-store";
import {
  addFavorite,
  addHistoryItem,
  clearHistory,
  clearUserLocalData,
  createId,
  DEFAULT_STATS,
  getFavorites,
  getHistory,
  getSettings,
  getStats,
  recordGeneration,
  removeFavorite,
  removeHistoryItem,
  saveSettings,
  syncFavoriteCount,
} from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { dbToProfile, profileToDb } from "@/lib/supabase/profile";
import type {
  AppSettings,
  AppStats,
  FavoriteItem,
  HistoryItem,
  UserProfile,
} from "@/lib/types";

interface AppContextValue {
  profile: UserProfile;
  history: HistoryItem[];
  favorites: FavoriteItem[];
  settings: AppSettings;
  stats: AppStats;
  ready: boolean;
  updateProfile: (profile: UserProfile) => Promise<string | null>;
  updateSettings: (settings: AppSettings) => void;
  logGeneration: (text: string, durationMs: number) => HistoryItem | null;
  deleteHistory: (id: string) => void;
  wipeHistory: () => Promise<void>;
  toggleFavorite: (text: string, label?: string) => void;
  deleteFavorite: (id: string) => void;
  resetApp: () => Promise<void>;
  isFavorite: (text: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const FALLBACK_PROFILE: UserProfile = {
  name: "Guest",
  email: "",
  title: "Somali TTS User",
  bio: "",
  createdAt: new Date().toISOString(),
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [profile, setProfile] = useState<UserProfile>(FALLBACK_PROFILE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings(userId));
  const [stats, setStats] = useState<AppStats>(getStats(userId));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(FALLBACK_PROFILE);
        setHistory(getHistory());
        setFavorites(getFavorites());
        setSettings(getSettings());
        setStats(getStats());
        setReady(true);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setProfile(dbToProfile(data));
      } else {
        setProfile({
          id: user.id,
          name: user.user_metadata?.name ?? "Somali TTS User",
          email: user.email ?? "",
          title: user.user_metadata?.title ?? "Somali TTS User",
          bio: user.user_metadata?.bio ?? "",
          createdAt: user.created_at ?? new Date().toISOString(),
        });
      }

      setHistory(getHistory(user.id));
      setFavorites(getFavorites(user.id));
      setSettings(getSettings(user.id));
      setStats(getStats(user.id));
      setReady(true);
    }

    setReady(false);
    void loadProfile();
  }, [user]);

  const updateProfile = useCallback(
    async (next: UserProfile) => {
      if (!user) {
        setProfile(next);
        return null;
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .upsert(profileToDb({ ...next, id: user.id }, user.id));

      if (error) return error.message;

      setProfile({ ...next, id: user.id, email: user.email ?? next.email });
      return null;
    },
    [user],
  );

  const updateSettings = useCallback(
    (next: AppSettings) => {
      saveSettings(next, userId);
      setSettings(next);
    },
    [userId],
  );

  const logGeneration = useCallback(
    (text: string, durationMs: number) => {
      if (!settings.saveHistory) return null;

      const item: HistoryItem = {
        id: createId(),
        text,
        createdAt: new Date().toISOString(),
        durationMs,
      };

      setHistory(addHistoryItem(item, userId));
      setStats(recordGeneration(userId));
      return item;
    },
    [settings.saveHistory, userId],
  );

  const deleteHistory = useCallback(
    (id: string) => {
      setHistory(removeHistoryItem(id, userId));
    },
    [userId],
  );

  const wipeHistory = useCallback(async () => {
    clearHistory(userId);
    await clearAllAudio();
    setHistory([]);
  }, [userId]);

  const toggleFavorite = useCallback(
    (text: string, label?: string) => {
      const existing = getFavorites(userId).find((item) => item.text === text);
      if (existing) {
        setFavorites(removeFavorite(existing.id, userId));
        setStats(syncFavoriteCount(userId));
        return;
      }

      const item: FavoriteItem = {
        id: createId(),
        text,
        label: label ?? text.slice(0, 48),
        createdAt: new Date().toISOString(),
      };

      setFavorites(addFavorite(item, userId));
      setStats(syncFavoriteCount(userId));
    },
    [userId],
  );

  const deleteFavorite = useCallback(
    (id: string) => {
      setFavorites(removeFavorite(id, userId));
      setStats(syncFavoriteCount(userId));
    },
    [userId],
  );

  const resetApp = useCallback(async () => {
    clearUserLocalData(userId);
    await clearAllAudio();
    setHistory([]);
    setFavorites([]);
    setSettings(getSettings(userId));
    setStats(DEFAULT_STATS);
  }, [userId]);

  const isFavorite = useCallback(
    (text: string) => favorites.some((item) => item.text === text),
    [favorites],
  );

  const value = useMemo(
    () => ({
      profile,
      history,
      favorites,
      settings,
      stats,
      ready,
      updateProfile,
      updateSettings,
      logGeneration,
      deleteHistory,
      wipeHistory,
      toggleFavorite,
      deleteFavorite,
      resetApp,
      isFavorite,
    }),
    [
      profile,
      history,
      favorites,
      settings,
      stats,
      ready,
      updateProfile,
      updateSettings,
      logGeneration,
      deleteHistory,
      wipeHistory,
      toggleFavorite,
      deleteFavorite,
      resetApp,
      isFavorite,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
