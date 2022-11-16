
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient('https://itbnozqiheazburehgvv.supabase.co', process.env.ANON)

module.exports = supabase;
