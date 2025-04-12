-- Drop the existing friends table if it exists
DROP TABLE IF EXISTS friends;

-- Create the saved_creators table
CREATE TABLE saved_creators (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, creator_id)
);

-- Add comment to the table
COMMENT ON TABLE saved_creators IS 'Stores the creators that members have saved to their profile';

-- Create indexes for better query performance
CREATE INDEX saved_creators_member_id_idx ON saved_creators(member_id);
CREATE INDEX saved_creators_creator_id_idx ON saved_creators(creator_id);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_creators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Allow members to view their saved creators
CREATE POLICY "Members can view their saved creators"
  ON saved_creators
  FOR SELECT
  USING (auth.uid() = member_id);

-- Allow members to add new saved creators
CREATE POLICY "Members can add new saved creators"
  ON saved_creators
  FOR INSERT
  WITH CHECK (auth.uid() = member_id);

-- Allow members to delete their saved creators
CREATE POLICY "Members can remove their saved creators"
  ON saved_creators
  FOR DELETE
  USING (auth.uid() = member_id);

-- Allow creators to see which members have saved them
CREATE POLICY "Creators can see who saved them"
  ON saved_creators
  FOR SELECT
  USING (auth.uid() = creator_id); 