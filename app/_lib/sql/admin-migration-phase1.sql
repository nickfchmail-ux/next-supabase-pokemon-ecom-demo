-- ============================================================================
-- Poke芒 Admin Portal — Production Migration (Phase 1)
-- Run this ONCE in Supabase SQL Editor. The app auto-detects the column.
-- ============================================================================

-- 1. Add role column to members (idempotent — safe to re-run)
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer'
CHECK (role IN ('customer', 'admin', 'superadmin'));

-- 2. Create stored procedure for auto-migration (called by ensureRoleColumn())
CREATE OR REPLACE FUNCTION alter_members_add_role()
RETURNS void AS $$
BEGIN
  ALTER TABLE public.members
    ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer'
    CHECK (role IN ('customer', 'admin', 'superadmin'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create admin audit logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id bigint REFERENCES public.members(id),
    action_type text NOT NULL,
    target_id text,
    changes jsonb,
    created_at timestamptz DEFAULT now()
);

-- 4. Index for fast audit lookups by admin
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);

-- 5. Enable RLS on audit logs (server uses SECRET_KEY, bypasses RLS)
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Grant yourself admin (⚠️ REPLACE with your Google email ⚠️)
-- UPDATE public.members SET role = 'admin' WHERE email = 'your-email@gmail.com';
