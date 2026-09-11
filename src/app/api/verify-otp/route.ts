import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { userId, otpCode } = await req.json();

    if (!userId || !otpCode) {
      return NextResponse.json({ error: 'User ID and OTP code are required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Find the OTP record
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from('user_otps')
      .select('*')
      .eq('user_id', userId)
      .eq('otp_code', otpCode)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (fetchError || !otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // 2. Mark OTP as used
    const { error: updateError } = await supabaseAdmin
      .from('user_otps')
      .update({ is_used: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error marking OTP as used:', updateError);
    }

    // 3. Update user profile to verified status
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ verification_status: 'verified' })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile status:', profileError);
      return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
