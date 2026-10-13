# Training Attendance App - DEMO Specification

## 1. DEMO Goal

Build a simple demo web application for managing two training groups, participants and attendance using fictional data only.

The application will use React, Vite, CSS and Supabase. Its database contains only three tables: `groups`, `participants` and `attendance`. The DEMO has no login, registration, user accounts or Supabase Auth.

## 2. Functional Requirements

### FR-01: Training Groups

**Priority: Must have**

The demo displays two predefined training groups:

- Monday / Wednesday
- Tuesday / Thursday

Groups are predefined and are not editable in the demo.

**Acceptance Criteria**
- Both predefined groups are available in the application.
- The application displays the participants assigned to each group.
- Each group can contain no more than six participants.
- The group capacity is enforced when creating or changing participant assignments.

### FR-02: Participant Management

**Priority: Must have**

The demo supports full participant CRUD. Every participant is assigned to exactly one group.

**Acceptance Criteria**
- The user can create a participant with a required name, optional phone number and one group assignment.
- The user can view the participant list and each participant's group.
- The user can edit participant details and change the group assignment.
- The user can delete a participant after confirmation.
- Every participant belongs to exactly one group.
- Creating or changing an assignment cannot make a group exceed six participants.
- All participant data used in the demo is fictional.

### FR-03: Attendance Management

**Priority: Must have**

The demo supports full attendance CRUD for individual participants and dates.

**Acceptance Criteria**
- The user can create an attendance record for a participant and session date, marking the participant Present or Absent.
- The user can view attendance records by participant and date.
- The user can edit an existing attendance record, including its date and status.
- The user can delete an attendance record.
- A participant can have no more than one attendance record for the same date.

## 3. Out of Scope

The following features are excluded from the DEMO:

- Login, registration, user accounts and Supabase Auth.
- Memberships and membership validity tracking.
- Payment tracking or online payment processing.
- Notifications.
- Replacement sessions in other groups.
- Participant self-service.
- Analytics and external calendar integrations.
- Creating, editing or deleting training groups; the two groups are predefined.

## 4. Non-Functional Requirements

### Usability
- The interface should be simple and intuitive.
- The application should work on desktop and mobile screens.
- Forms should display clear validation and error messages.

### Security and Demo Data
- Use fictional participant names and contact details only in the demo, seed data, screenshots and documentation.
- Public anonymous write access to Supabase is not permitted.
- A safe demo data-access approach must be selected before implementing database CRUD. The choice must prevent anonymous users from writing to the database and must not expose privileged service credentials in frontend code.
- Do not implement database CRUD until this access approach is selected.

### Data Management
- The data model contains only `groups`, `participants` and `attendance`.
- CRUD operations are required for participants and attendance records; groups are predefined.
- The application should handle loading, success and error states.

## 5. DEMO Completion Criteria

The DEMO is considered complete when:

- The application has no login, registration, user accounts or Supabase Auth flow.
- The application displays the two predefined groups: Monday / Wednesday and Tuesday / Thursday.
- The trainer can create, view, edit and delete participants using fictional data only.
- Every participant is assigned to exactly one group.
- Neither group can exceed six participants, including when a participant is created or reassigned.
- The trainer can create, view, edit and delete attendance records by participant and date.
- Duplicate attendance records for the same participant and date are prevented.
- Data persists after page refresh using the selected safe data-access approach.
- The database contains only the three tables `groups`, `participants` and `attendance`.
- Public anonymous Supabase writes are disabled, and the safe database CRUD approach has been selected before database CRUD is implemented.
