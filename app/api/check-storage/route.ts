import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export async function GET() {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;

    const results = buckets.map((bucket: any) => ({
      name: bucket.name,
      size: bucket.size,
      private: !bucket.public
    }))

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in RLS check:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
