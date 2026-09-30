import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fcofgeuvjpdmkknsmqfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjb2ZnZXV2anBkbWtrbnNtcWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NzU2NDksImV4cCI6MjEwNjI1MTY0OX0.JgGm1h1T5lmzaBMx8pB2Ys9miUn0xj1_Lxgfzjo7jx0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);