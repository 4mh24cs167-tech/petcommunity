-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create breeds table
CREATE TABLE breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  species TEXT NOT NULL,
  description TEXT,
  characteristics JSONB
);

-- Create pets table
CREATE TABLE pets (
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
CREATE TABLE hospitals (
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
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TABLE cross_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  target_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  status request_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create community_posts table
CREATE TABLE community_posts (
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
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Breeds are viewable by everyone." ON breeds FOR SELECT USING (true);
CREATE POLICY "Pets are viewable by everyone." ON pets FOR SELECT USING (true);
CREATE POLICY "Users can manage own pets." ON pets FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Hospitals are viewable by everyone." ON hospitals FOR SELECT USING (true);
CREATE POLICY "Users can manage own cross requests." ON cross_requests FOR ALL USING (
  auth.uid() IN (
    SELECT profiles.id FROM profiles
    JOIN pets ON pets.owner_id = profiles.id
    WHERE pets.id = requester_pet_id OR pets.id = target_pet_id
  )
);
CREATE POLICY "Posts are viewable by everyone." ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can manage own posts." ON community_posts FOR ALL USING (auth.uid() = user_id);
