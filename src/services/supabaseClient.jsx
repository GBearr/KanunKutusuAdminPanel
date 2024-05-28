import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://erpixhtctrulbuojqzjf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVycGl4aHRjdHJ1bGJ1b2pxempmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTU5MjY2NywiZXhwIjoyMDMxMTY4NjY3fQ.Msy_RdX2gVuG_YEnI4YBTZbwyLBdxLU1NN5fflHWQFk"
);

export default supabase;
