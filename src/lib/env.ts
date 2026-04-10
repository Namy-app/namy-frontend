import { z } from "zod";

// Define your expected environment variables
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default("http://localhost:4000/graphql"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB: z.string().min(1).optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS: z.string().min(1).optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID: z.string().min(1).optional(),
  NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER: z.string().min(1).optional(),
});

// Parse + validate
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_WEB,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID,
  NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER:
    process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER,
});
