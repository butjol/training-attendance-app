# Training Attendance App - DEMO Project Idea

## 1. Problem

Small-group fitness trainers need a clear way to track who participates in each group and who attended each session. Maintaining these records manually can make it harder to keep participant lists and attendance history accurate.

## 2. Target User

The DEMO is intended to show how an independent fitness trainer could manage two small training groups of up to six participants each.

It is a demonstration only: it has no login, registration, user accounts or Supabase Auth. All participant information must be fictional.

## 3. Current Process

A trainer may use spreadsheets, calendars, messages or handwritten notes to track group membership and attendance. Keeping the information in multiple places can make it harder to review current group rosters and past attendance.

## 4. Proposed Solution

Training Attendance App DEMO is a small web application that allows the user to:

- View two predefined groups: Monday / Wednesday and Tuesday / Thursday.
- Create, view, edit and delete fictional participant records.
- Assign each participant to exactly one group, with a maximum of six participants per group.
- Create, view, edit and delete attendance records by participant and date.

The database contains only three tables: `groups`, `participants` and `attendance`.

## 5. Value Proposition

The DEMO illustrates a focused way to manage group rosters and attendance in one place, with clear capacity limits and attendance history.

## 6. Main User Scenario

1. The user opens the demo; no sign-in or account is required.
2. The user views the two predefined training groups and their participants.
3. The user creates or edits fictional participant records, assigning each participant to one group.
4. The user records attendance for a participant and date.
5. The user reviews or corrects attendance history.

## 7. DEMO Scope and Data Safety

The DEMO includes participant CRUD and attendance CRUD for fictional data only. Memberships, payments, notifications and replacement sessions are out of scope. Group records are predefined and read-only.

Public anonymous write access to Supabase is not permitted. A safe demo data-access approach must be selected before implementing database CRUD. It must prevent anonymous users from writing to Supabase and must not expose privileged credentials in frontend code. Until the approach is selected, database CRUD should not be implemented.
