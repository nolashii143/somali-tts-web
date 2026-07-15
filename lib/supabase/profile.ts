import type { UserProfile } from "@/lib/types";

export interface DbProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  created_at: string;
}

export function dbToProfile(row: DbProfile): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    title: row.title,
    bio: row.bio,
    createdAt: row.created_at,
  };
}

export function profileToDb(profile: UserProfile, userId: string) {
  return {
    id: userId,
    name: profile.name,
    email: profile.email,
    title: profile.title,
    bio: profile.bio,
  };
}
