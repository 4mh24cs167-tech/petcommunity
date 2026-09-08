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

CREATE POLICY "Users can view their own notifications." ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their own notifications as read." ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
