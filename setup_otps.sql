-- Table to store custom OTPs for user verification
CREATE TABLE IF NOT EXISTS public.user_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_used BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.user_otps ENABLE ROW LEVEL SECURITY;

-- Allow only service role (backend) to manage OTPs
-- (Users should not be able to read their own OTP codes via API)
CREATE POLICY "Service role has full access to OTPs" 
ON public.user_otps 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
