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

CREATE POLICY "Marketplace items are viewable by everyone." ON marketplace_items
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own items." ON marketplace_items
    FOR ALL USING (auth.uid() = seller_id);
