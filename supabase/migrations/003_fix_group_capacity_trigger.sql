-- The capacity trigger must lock a row in public.groups while anon users have
-- read-only access to that table. SECURITY DEFINER lets the function perform
-- that lock using its owner's privileges without granting anon group writes.
--
-- Before production use, verify that this function has a trusted owner and
-- review a secure search_path configuration for SECURITY DEFINER execution.
ALTER FUNCTION public.enforce_group_participant_capacity() SECURITY DEFINER;
