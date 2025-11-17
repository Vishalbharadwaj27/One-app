import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function makeStubClient(): SupabaseClient {
  // Minimal stub that throws when used so app doesn't crash at import-time.
  // It's better for callers to handle missing client gracefully.
  const handler = new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error('Supabase client is not initialized because VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing/invalid.');
        };
      },
    }
  );
  return handler as unknown as SupabaseClient;
}

let _supabase: SupabaseClient | undefined;

if (!rawUrl || !anonKey) {
  // Don't throw during module import — show clear guidance in console instead.
  // This avoids breaking the dev server while guiding the developer to fix .env.
  // Vite loads `.env` files automatically when prefixed with `VITE_`.
  // Example .env:
  // VITE_SUPABASE_URL=https://xyzcompany.supabase.co
  // VITE_SUPABASE_ANON_KEY=eyJhbGci...
  // Provide helpful runtime message and export a stub client so app keeps running.
  // If you prefer a hard fail, change this to `throw new Error(...)`.
  // eslint-disable-next-line no-console
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined. Supabase client will not be initialized.');
  _supabase = makeStubClient();
} else if (!isValidHttpUrl(rawUrl)) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] VITE_SUPABASE_URL is present but is not a valid HTTP/HTTPS URL:', rawUrl);
  _supabase = makeStubClient();
} else {
  // All good: initialize client and log success.
  _supabase = createClient(rawUrl, anonKey);
  // eslint-disable-next-line no-console
  console.info('[supabase] Supabase client initialized.');
}

export const supabase = _supabase as SupabaseClient;
