
const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient('https://itbnozqiheazburehgvv.supabase.co', process.env.ANON)

module.exports = supabase;