-- Create a table for chat relationships between users
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  initiator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  initiator_name TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  
  CONSTRAINT different_users CHECK (initiator_id <> participant_id)
);

-- Add indexes for quick lookups
CREATE INDEX IF NOT EXISTS chats_initiator_id_idx ON chats(initiator_id);
CREATE INDEX IF NOT EXISTS chats_participant_id_idx ON chats(participant_id);

-- Create RLS policies
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see chats they're part of
CREATE POLICY "Users can view their own chats" 
ON chats FOR SELECT 
TO authenticated 
USING (auth.uid() = initiator_id OR auth.uid() = participant_id);

-- Policy to allow users to create chats they're part of
CREATE POLICY "Users can create chats they're part of" 
ON chats FOR INSERT 
TO authenticated 
USING (auth.uid() = initiator_id);

-- Policy to allow users to update chats they're part of
CREATE POLICY "Users can update their own chats" 
ON chats FOR UPDATE 
TO authenticated 
USING (auth.uid() = initiator_id OR auth.uid() = participant_id); 