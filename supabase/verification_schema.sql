-- Verification Schema for Trust & Safety
-- Adds verification capabilities to profiles and hospitals

-- 1. Profile Verification
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified', 'rejected'
ADD COLUMN IF NOT EXISTS id_document_url TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- 2. Hospital/Clinic Verification
ALTER TABLE hospitals
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified', 'rejected'
ADD COLUMN IF NOT EXISTS license_document_url TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- 3. Verification Audit Logs
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL, -- ID of the profile or hospital
    entity_type TEXT NOT NULL, -- 'profile' or 'hospital'
    action TEXT NOT NULL, -- 'submitted', 'approved', 'rejected'
    admin_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_hospitals_verification ON hospitals(verification_status);
