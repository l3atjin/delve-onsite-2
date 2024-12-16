import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('list_tables_with_rls');
    if (error) throw new Error(error.message);

    const results = data.map((table: { tablename: any; rls_enabled: any; }) => ({
      name: table.tablename,
      rlsEnabled: table.rls_enabled
    }));

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in RLS check:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
