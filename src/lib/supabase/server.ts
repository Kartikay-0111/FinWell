import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

export const createClient = () => {
  return createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key: string) => Cookies.get(key),
          setItem: (key: string, value: string, options?: CookieOptions) => {
            Cookies.set(key, value, options)
          },
          removeItem: (key: string) => Cookies.remove(key),
        },
      },
    }
  )
}
