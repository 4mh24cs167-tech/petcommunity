-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create breeds table
CREATE TABLE IF NOT EXISTS breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  species TEXT NOT NULL,
  description TEXT,
  characteristics JSONB
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  breed_id UUID REFERENCES breeds(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  health_records JSONB,
  photos TEXT[],
  is_available_for_cross BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinates POINT,
  specialties TEXT[],
  rating FLOAT CHECK (rating >= 0 AND rating <= 5),
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create cross_requests table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected');
    END IF;
END
$$;
CREATE TABLE IF NOT EXISTS cross_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  target_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  status request_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Breeds are viewable by everyone." ON breeds;
CREATE POLICY "Breeds are viewable by everyone." ON breeds FOR SELECT USING (true);
DROP POLICY IF EXISTS "Pets are viewable by everyone." ON pets;
CREATE POLICY "Pets are viewable by everyone." ON pets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own pets." ON pets;
CREATE POLICY "Users can manage own pets." ON pets FOR ALL USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Hospitals are viewable by everyone." ON hospitals;
CREATE POLICY "Hospitals are viewable by everyone." ON hospitals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own cross requests." ON cross_requests;
CREATE POLICY "Users can manage own cross requests." ON cross_requests FOR ALL USING (
  auth.uid() IN (
    SELECT profiles.id FROM profiles
    JOIN pets ON pets.owner_id = profiles.id
    WHERE pets.id = requester_pet_id OR pets.id = target_pet_id
  )
);
DROP POLICY IF EXISTS "Posts are viewable by everyone." ON community_posts;
CREATE POLICY "Posts are viewable by everyone." ON community_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own posts." ON community_posts;
CREATE POLICY "Users can manage own posts." ON community_posts FOR ALL USING (auth.uid() = user_id);
-- Appointment Booking System Schema

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own appointments." ON appointments;
CREATE POLICY "Users can view their own appointments." ON appointments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own appointments." ON appointments;
CREATE POLICY "Users can create their own appointments." ON appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own appointments (if pending)." ON appointments;
CREATE POLICY "Users can update their own appointments (if pending)." ON appointments
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Hospitals can view appointments for their clinic." ON appointments;
CREATE POLICY "Hospitals can view appointments for their clinic." ON appointments
    FOR SELECT USING (
        -- In a real app, we'd have a hospital_admins table.
        -- For this demo, we'll simulate it by checking if the user is an admin or the hospital.
        true
    );
-- Secure Interaction: Chat System Schema

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    conversation_type TEXT CHECK (conversation_type IN ('breeding', 'playdate', 'general')),
    status TEXT DEFAULT 'active' -- 'active', 'archived', 'blocked'
);

CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conv_members_user ON conversation_members(user_id);
-- Detailed Health Records for Pets

CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    record_type TEXT NOT NULL, -- 'vaccination', 'checkup', 'surgery', 'medication'
    date DATE NOT NULL,
    provider TEXT,
    notes TEXT,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_pet ON health_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_date ON health_records(date);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view health records of their own pets." ON health_records;
CREATE POLICY "Users can view health records of their own pets." ON health_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_records.pet_id
            AND pets.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can manage health records of their own pets." ON health_records;
CREATE POLICY "Users can manage health records of their own pets." ON health_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_records.pet_id
            AND pets.owner_id = auth.uid()
        )
    );
-- Pet Marketplace

CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    pet_id UUID REFERENCES pets(id) ON DELETE SET NULL, -- Optional: if selling a pet (rare) or pet accessories
    item_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT, -- 'food', 'toys', 'healthcare', 'accessories'
    image_url TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_items(status);

ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Marketplace items are viewable by everyone." ON marketplace_items;
CREATE POLICY "Marketplace items are viewable by everyone." ON marketplace_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own items." ON marketplace_items;
CREATE POLICY "Users can manage their own items." ON marketplace_items
    FOR ALL USING (auth.uid() = seller_id);
-- Notification System

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'match_request', 'appointment_reminder', 'system', 'community_mention'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link TEXT, -- Path to navigate to (e.g., /chat/id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications." ON notifications;
CREATE POLICY "Users can view their own notifications." ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark their own notifications as read." ON notifications;
CREATE POLICY "Users can mark their own notifications as read." ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
-- Inner Circle Premium Subscription

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    plan_type TEXT DEFAULT 'premium', -- 'basic', 'premium', 'lifetime'
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscription." ON subscriptions;
CREATE POLICY "Users can view their own subscription." ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  answer TEXT,
  is_answered BOOLEAN DEFAULT false,
  answered_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Questions are viewable by everyone." ON questions;
CREATE POLICY "Questions are viewable by everyone." ON questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can ask questions." ON questions;
CREATE POLICY "Users can ask questions." ON questions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own questions." ON questions;
CREATE POLICY "Users can update own questions." ON questions FOR UPDATE USING (auth.uid() = id);
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
-- Seed Breeds
INSERT INTO breeds (name, species, description, characteristics) VALUES
('Golden Retriever', 'Dog', 'Friendly, tolerant, and intelligent.', '{"energy": "high", "temperament": "gentle", "size": "large"}'),
('Siamese', 'Cat', 'Active, affectionate, and vocal.', '{"energy": "medium", "temperament": "social", "size": "small"}'),
('Beagle', 'Dog', 'Curious, merry, and energetic.', '{"energy": "high", "temperament": "playful", "size": "medium"}'),
('Maine Coon', 'Cat', 'Gentle giants, fluffy and intelligent.', '{"energy": "medium", "temperament": "calm", "size": "large"}'),
('German Shepherd', 'Dog', 'Confident, courageous, and smart.', '{"energy": "high", "temperament": "loyal", "size": "large"}'),
('Persian', 'Cat', 'Quiet, sweet, and fluffy.', '{"energy": "low", "temperament": "docile", "size": "medium"}') ON CONFLICT (name) DO NOTHING;

-- Seed Hospitals
INSERT INTO hospitals (name, address, specialties, rating, contact_info) VALUES
('City Pet Hospital', '123 Main St, Downtown', '{"Surgery", "General Care", "Emergency"}', 4.8, '{"phone": "555-0101", "email": "info@citypet.com"}'),
('Happy Paws Clinic', '456 Oak Ave, Suburbia', '{"Vaccinations", "Pediatrics", "Dental"}', 4.5, '{"phone": "555-0202", "email": "contact@happypaws.com"}'),
('VetCare Specialist Center', '789 Pine Rd, Northside', '{"Cardiology", "Orthopedics", "Neurology"}', 4.9, '{"phone": "555-0303", "email": "care@vetcare.com"}'),
('Green Valley Animal Hospital', '101 Maple Dr, Eastside', '{"Exotics", "Avian", "Reptiles"}', 4.2, '{"phone": "555-0404", "email": "hello@greenvalley.com"}');
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_document_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS weight REAL;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS spay_neuter_status BOOLEAN;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS temperament_tags TEXT[];
ALTER TABLE pets ADD COLUMN IF NOT EXISTS stud_fee REAL;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS pedigree_url TEXT;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS genetic_screening JSONB;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pet_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges TEXT[];

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_telehealth BOOLEAN DEFAULT false;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';

CREATE TABLE IF NOT EXISTS user_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_otps_user_id ON user_otps(user_id);
ALTER TABLE user_otps ADD COLUMN IF NOT EXISTS is_used BOOLEAN DEFAULT FALSE;
