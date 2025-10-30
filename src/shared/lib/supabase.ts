/**
 * Supabase Configuration
 * Initialize and configure Supabase client
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing. Check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
