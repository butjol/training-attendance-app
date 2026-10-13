# Training Attendance App

An educational demo for managing two small training groups, their participants, and session attendance. It is built to demonstrate a simple React app connected to Supabase. Use fictional data only.

## Features

- View the predefined Monday / Wednesday and Tuesday / Thursday groups.
- View participants in a selected group and create, edit, or delete participants.
- Enforce a maximum of six participants per group in the app and with a database trigger.
- Select a session date and view, create, update, or remove each participant's attendance status: Present, Absent, or Not recorded.
- Validate required participant names and show loading, success, and error messages.

Groups are predefined and read-only. The interface does not provide group editing or reassignment of existing participants.

## Technology

- React 19 and React DOM
- Vite 8 for local development and builds
- Supabase JavaScript client (`@supabase/supabase-js`) for PostgreSQL data access
- CSS for styling
- ESLint for code checks

## Database

The Supabase database has three tables:

- `groups`: predefined groups, with a unique name.
- `participants`: required name, optional phone, and required `group_id` referencing `groups.id`. A trigger limits each group to six participants.
- `attendance`: participant reference, session date, and required present/absent value. A unique constraint on (`participant_id`, `session_date`) allows at most one record per participant per date. Deleting a participant also deletes their attendance records.

The app displays a participant as **Not recorded** when no attendance row exists for that date. The first migration seeds the two group rows; the migrations do not seed participant or attendance examples.

## Run locally

1. Clone the repository and enter its folder:

   ```sh
   git clone https://github.com/butjol/training-attendance-app
   cd training-attendance-app
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create `.env.local` in the project root with your own Supabase project URL and anon key:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Do not put service-role keys or other privileged credentials in this file or frontend code. Never publish real credentials or keys.

4. In a new Supabase project's SQL Editor, run the files in numeric order, once each:

   1. `supabase/migrations/001_initial_schema.sql`
   2. `supabase/migrations/002_demo_crud_policies.sql`
   3. `supabase/migrations/003_fix_group_capacity_trigger.sql`

   Migration `001` creates the tables, trigger, read policies, and two groups. Migration `002` grants anonymous CRUD access to participants and attendance. Migration `003` changes the capacity trigger to `SECURITY DEFINER` so it can lock a group row while anon access to groups stays read-only. The migrations contain no participant or attendance demo data; add fictional examples through the app or Supabase SQL Editor.

5. Start the development server:

   ```sh
   npm run dev
   ```

   Open the local URL printed by Vite.

## Security limitations

This is a public, no-login demo. After migration `002`, anyone with the Supabase API URL and anon key can create, edit, or delete participant and attendance records. Groups remain read-only for the anon role. The anon key is intended for client-side use, but the database permissions make this demo writable by anonymous API clients.

Use fictional data only. Do not enter real names, phone numbers, or other personal information. This permission model is not production-ready and should not be used as a security model for a real training business.

The capacity trigger uses `SECURITY DEFINER`. Before production use, review that its function owner is trusted and configure a secure `search_path`.

## Checks

The project build (`npm run build`) and ESLint check (`npm run lint`) have been run successfully. These checks do not test connectivity to Supabase or live database CRUD behavior.

The following functionality has also been manually verified: participant create, read, update, and delete; attendance create, read, update, and delete; the six-participant group limit; required-name validation; and rejection of names containing only whitespace.

## Project structure

```text
src/                    React app, styles, and Supabase client
supabase/migrations/    Database schema, policies, and trigger migrations
docs/                   Project idea, MVP requirements, and data model
```

Project notes:

- [Project idea](docs/idea.md)
- [MVP specification](docs/mvp.md)
- [Data model](docs/data-model.md)

## Future improvements

- Replace public anonymous writes with secure authentication and role-based access control before using real data.
- Add automated tests for participant capacity and attendance behavior.
- Deploy the demo with environment variables configured in the hosting platform and fictional data only.
