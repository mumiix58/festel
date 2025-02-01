/*
  # Initial Content Schema Setup

  1. New Tables
    - `content`
      - `id` (uuid, primary key)
      - `page` (text)
      - `content` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `settings`
      - `id` (uuid, primary key) 
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `activities`
      - `id` (uuid, primary key)
      - `type` (text)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  description text NOT NULL,
  user_id uuid REFERENCES auth.users,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Content policies
CREATE POLICY "Content is readable by everyone" 
  ON content
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Content is editable by authenticated users" 
  ON content
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Settings policies
CREATE POLICY "Settings are readable by everyone" 
  ON settings
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Settings are editable by authenticated users" 
  ON settings
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Activities policies
CREATE POLICY "Activities are readable by authenticated users" 
  ON activities
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Activities are insertable by authenticated users" 
  ON activities
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();