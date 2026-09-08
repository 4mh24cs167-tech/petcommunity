import { createBrowserClient } from '@supabase/ssr'

const mockResponse = {
  data: null,
  error: { message: 'Supabase not configured. Please update .env.local' },
};

const mockChain = {
  select: () => mockChain,
  eq: () => mockChain,
  neq: () => mockChain,
  order: () => mockChain,
  in: () => mockChain,
  single: async () => mockResponse,
  limit: () => mockChain,
};

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://')) && url !== 'your_supabase_url';

  if (!isValidUrl || !key || key === 'your_supabase_anon_key') {
    console.warn('Supabase credentials are missing or invalid. The app is running in UI-only mode.');

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ data: null, error: null }),
      },
      from: () => ({
        select: () => mockChain,
        insert: async () => mockResponse,
        update: () => mockChain,
        upsert: async () => mockResponse,
        delete: () => mockChain,
      }),
    } as any;
  }

  return createBrowserClient(url, key);
}
