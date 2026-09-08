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

CREATE POLICY "Users can view health records of their own pets." ON health_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_records.pet_id
            AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage health records of their own pets." ON health_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_records.pet_id
            AND pets.owner_id = auth.uid()
        )
    );
