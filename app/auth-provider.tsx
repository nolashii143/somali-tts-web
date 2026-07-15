"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient, formatAuthError, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!configured) return "Supabase is not configured.";
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return error ? formatAuthError(error) : null;
      } catch (error) {
        return formatAuthError(error);
      }
    },
    [configured],
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (!configured) return "Supabase is not configured.";
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              title: "Somali TTS User",
              bio: "Building with Somali TTS.",
            },
          },
        });
        return error ? formatAuthError(error) : null;
      } catch (error) {
        return formatAuthError(error);
      }
    },
    [configured],
  );

  const signOut = useCallback(async () => {
    if (!configured) return;
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch {
      setUser(null);
    }
  }, [configured]);

  const value = useMemo(
    () => ({ user, loading, configured, signIn, signUp, signOut }),
    [user, loading, configured, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
