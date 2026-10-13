-- WARNING: This is a public, no-login educational DEMO. Anyone with API access
-- using the anon role can modify or delete demo participant and attendance
-- records. Use fictional data only. This is not suitable for real personal
-- data and is not a production security model.

-- Keep groups publicly readable and read-only. The existing groups SELECT
-- policy from 001 remains in place; no anon write policies are added for groups.

-- Replace the original read-only policies for these tables so this migration
-- can be applied once after 001 without leaving conflicting policies behind.
DROP POLICY IF EXISTS "Anonymous users can read participants" ON public.participants;
DROP POLICY IF EXISTS "Anonymous users can read attendance" ON public.attendance;

DROP POLICY IF EXISTS "Anonymous users can insert participants" ON public.participants;
DROP POLICY IF EXISTS "Anonymous users can update participants" ON public.participants;
DROP POLICY IF EXISTS "Anonymous users can delete participants" ON public.participants;
DROP POLICY IF EXISTS "Anonymous users can insert attendance" ON public.attendance;
DROP POLICY IF EXISTS "Anonymous users can update attendance" ON public.attendance;
DROP POLICY IF EXISTS "Anonymous users can delete attendance" ON public.attendance;

CREATE POLICY "Anonymous users can read participants"
ON public.participants
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anonymous users can insert participants"
ON public.participants
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anonymous users can update participants"
ON public.participants
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anonymous users can delete participants"
ON public.participants
FOR DELETE
TO anon
USING (true);

CREATE POLICY "Anonymous users can read attendance"
ON public.attendance
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anonymous users can insert attendance"
ON public.attendance
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anonymous users can update attendance"
ON public.attendance
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anonymous users can delete attendance"
ON public.attendance
FOR DELETE
TO anon
USING (true);

-- PostgreSQL privileges are required in addition to RLS policies. These grants
-- provide the anon role only the requested CRUD operations on these two tables.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.participants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.attendance TO anon;
