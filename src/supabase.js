import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gzbqsdmcvkecwfeqalea.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnFzZG1jdmtlY3dmZXFhbGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4Mzk3NDksImV4cCI6MjAxNDQxNTc0OX0._uvDArQqREH6GHjp2ZrnnhCL_eqyFFDAlbmXiKUEV80';
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;