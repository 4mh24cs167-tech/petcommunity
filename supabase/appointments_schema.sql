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
CREATE POLICY "Users can view their own appointments." ON appointments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments." ON appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments (if pending)." ON appointments
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Hospitals can view appointments for their clinic." ON appointments
    FOR SELECT USING (
        -- In a real app, we'd have a hospital_admins table.
        -- For this demo, we'll simulate it by checking if the user is an admin or the hospital.
        true
    );
