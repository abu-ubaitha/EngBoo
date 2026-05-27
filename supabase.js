
const supabaseUrl =
"https://isgigweowcrlzcqaaywv.supabase.co";

const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZ2lnd2Vvd2NybHpjcWFheXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDM2MjMsImV4cCI6MjA5NTIxOTYyM30.KCcPw5EW2_w62LDqUreoPr5akiEFFTKkKuHyDW9sL-0";

const supabaseClient =
supabase.createClient(
  supabaseUrl,
  supabaseKey
);