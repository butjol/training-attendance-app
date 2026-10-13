-- Initial schema for the Training Attendance App public read-only DEMO.
-- This database is publicly readable through the Supabase anon role. It must
-- contain fictional demo data only and must never contain real personal data.

CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    group_id UUID NOT NULL REFERENCES public.groups (id)
);

CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.participants (id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    present BOOLEAN NOT NULL,
    CONSTRAINT attendance_participant_session_date_key UNIQUE (participant_id, session_date)
);

-- Seed the two predefined groups. The name uniqueness constraint makes this
-- safe to re-run if the migration is applied to a database with these rows.
INSERT INTO public.groups (name)
VALUES
    ('Monday / Wednesday'),
    ('Tuesday / Thursday')
ON CONFLICT (name) DO NOTHING;

-- Serialize participant inserts and group changes for each destination group.
-- Locking the group row before counting prevents concurrent transactions from
-- both observing an available sixth place and exceeding the capacity.
CREATE FUNCTION public.enforce_group_participant_capacity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    participant_count INTEGER;
BEGIN
    PERFORM 1
    FROM public.groups
    WHERE id = NEW.group_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Training group % does not exist', NEW.group_id
            USING ERRCODE = 'foreign_key_violation';
    END IF;

    SELECT COUNT(*)
    INTO participant_count
    FROM public.participants
    WHERE group_id = NEW.group_id
      AND (TG_OP = 'INSERT' OR id <> NEW.id);

    IF participant_count >= 6 THEN
        RAISE EXCEPTION 'Training group % cannot contain more than six participants', NEW.group_id
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER participants_enforce_group_capacity
BEFORE INSERT OR UPDATE OF group_id ON public.participants
FOR EACH ROW
EXECUTE FUNCTION public.enforce_group_participant_capacity();

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Public read-only DEMO: anonymous visitors may SELECT fictional demo data.
-- No anon INSERT, UPDATE, or DELETE policies are created on any table.
CREATE POLICY "Anonymous users can read groups"
ON public.groups
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anonymous users can read participants"
ON public.participants
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anonymous users can read attendance"
ON public.attendance
FOR SELECT
TO anon
USING (true);
