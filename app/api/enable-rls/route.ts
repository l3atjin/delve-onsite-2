import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export async function POST() {
  const { error } = await supabase.rpc('enable_rls_all_tables');

  if (error) {
    console.error('Error enabling RLS on all tables:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'RLS enabled on all tables.' }, { status: 200 });
}
