-- ============================================================================
-- Poke芒 Admin Portal — IAM Schema Migration
-- Run this ONCE in your Supabase SQL Editor to set up the user_roles table.
-- ============================================================================

-- 1. Create the user_roles table (dedicated IAM table — NOT stored on members)
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES members(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer'
    CHECK (role IN ('customer', 'admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index for fast lookups by user_id (every page load calls getUserRole)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- 3. Enable Row Level Security (your server code uses SECRET_KEY, bypasses RLS)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Grant admin role to your user
-- Replace <YOUR_USER_ID> with your actual members.id (find it in the members table)
-- INSERT INTO user_roles (user_id, role) VALUES (<YOUR_USER_ID>, 'admin')
--   ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = NOW();
