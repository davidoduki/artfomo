export type UserRole = "admin" | "user";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  author_name?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Drop {
  id: string;
  title: string;
  artist_slug: string;
  artist_name?: string;
  price: string;
  date: string;
  sold_out: boolean;
  image: string | null;
  description: string | null;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  artist_slug: string;
  created_at: string;
}

export interface SavedArtist {
  id: string;
  user_id: string;
  artist_slug: string;
  created_at: string;
}
