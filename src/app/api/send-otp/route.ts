import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ error: 'Email and userId are required' }, { status: 400 });
    }

    // 1. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    // 2. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Store OTP in database
    const { error: dbError } = await supabaseAdmin
      .from('user_otps')
      .insert({
        user_id: userId,
        otp_code: otpCode,
        expires_at: expiresAt,
      });

    if (dbError) {
      console.error('Database error storing OTP:', dbError);
      return NextResponse.json({ error: 'Failed to store verification code' }, { status: 500 });
    }

    // 4. Send Email via Brevo API
    console.log(`\n=========================================\n🐶 DEV MODE: Your OTP Code is: ${otpCode}\n=========================================\n`);
    
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Pet Community', email: 'no-reply@petcommunity.app' }, // Ensure this domain is verified in Brevo
        to: [{ email: email }],
        subject: 'Your Verification Code',
        htmlContent: `
          <div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0d9488;">Welcome to Pet Community! 🐾</h2>
            <p style="font-size: 16px; color: #666;">Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="font-size: 14px; color: #999;">This code expires in 15 minutes.</p>
          </div>
        `,
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('Brevo API error (Email not sent):', errorData);
      // Don't fail the request in development if Brevo is not configured correctly
      console.log('Skipping email send failure because OTP was logged to console.');
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully (Check server console if email failed)' });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
