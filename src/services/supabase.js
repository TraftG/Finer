import { createClient } from '@supabase/supabase-js';


const supabaseUrl='https://eocwsrgvuangzrtjgysw.supabase.co'
const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY3dzcmd2dWFuZ3pydGpneXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NDA1MTAsImV4cCI6MjA1MjIxNjUxMH0.soHdm-1otdB5JBnLXcVukQXBNtjULErrOly9_xL4hiY'
        
export const supabase = createClient(supabaseUrl, supabaseKey);
