import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!);

export async function GET() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
      throw new Error(error.message);
    }

    // console.log(JSON.stringify(users, null, 2));
    // console.log("user id is", users[0].id);

    const results = await Promise.all(
      users.map(async (user) => {
        const { data, error: factorError } = await supabase.auth.admin.mfa.listFactors({ userId: user.id });

        if (factorError) {
          throw new Error(factorError.message);
        }

        // data.factors should be an array of MFA factors
        // console.log("factors for user", user.id, data);

        return {
          id: user.id,
          mfaEnabled: data.factors && data.factors.length > 0
        };
      })
    );

    // log each user’s mfa status
    // for (const user of results) {
    //   await supabase.from('logs').insert([{
    //     action_type: 'Check',
    //     entity: 'User',
    //     details: { user_id: user.id, mfa_enabled: user.mfaEnabled },
    //     status: user.mfaEnabled ? 'Pass' : 'Fail'
    //   }]);
    // }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in MFA check:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
