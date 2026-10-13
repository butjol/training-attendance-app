# Training Attendance App - MVP Specification

## 1. MVP Goal

Build a simple web application that helps an independent fitness trainer manage two training groups, participants and attendance.

The application will use React, Vite, CSS and Supabase. Its database contains three tables: `groups`, `participants` and `attendance`. Trainer authentication is managed separately through Supabase Auth.

The first MVP version supports one user role: Trainer.

## 2. Functional Requirements

### FR-01: Trainer Authentication

**Priority: Must have**

The trainer can securely sign in and sign out using Supabase Auth.

**Acceptance Criteria**
- The trainer can sign in using email and password.
- Invalid login credentials display an error message.
- Unauthenticated users cannot access protected application data.
- The trainer can sign out.

### FR-02: Training Groups

**Priority: Must have**

The trainer can view the two predefined training groups:

- Monday / Wednesday
- Tuesday / Thursday

Groups are predefined and are not managed as editable records in the MVP.

**Acceptance Criteria**
- Both predefined groups are available in the application.
- The trainer can view each group and the participants assigned to it.
- Each group can contain no more than six participants.
- Group capacity is enforced when creating or editing participant assignments.

### FR-03: Participant Management

**Priority: Must have**

The trainer can create and manage participant records, assigning each participant to exactly one training group.

**Acceptance Criteria**
- The trainer can create a participant with a required name, optional phone number and one group assignment.
- The trainer can view the participant list and each participant's group.
- The trainer can edit participant details and change the group assignment.
- The trainer can delete a participant after confirmation.
- Each participant belongs to exactly one group at all times.
- A group assignment cannot be created or changed if it would exceed that group's capacity of six.
- Participant and group assignment data is stored in Supabase.

### FR-04: Attendance Management

**Priority: Must have**

The trainer can create and manage attendance records for individual participants and dates.

**Acceptance Criteria**
- The trainer can create an attendance record for a participant and session date, marking the participant Present or Absent.
- The trainer can view attendance records by participant and date.
- The trainer can edit an existing attendance record, including its date and attendance status.
- The trainer can delete an attendance record.
- A participant can have no more than one attendance record for the same date.
- Attendance data is stored in Supabase.

## 3. Out of Scope

The following features are excluded from the MVP:

- Membership management.
- Payment tracking or online payment processing.
- Replacement sessions in other groups.
- Automatic SMS, email or other notifications.
- Participant accounts and self-service.
- Automatic calculation of remaining sessions.
- Advanced reporting and analytics.
- External calendar integrations.
- Creating, editing or deleting training groups; the two groups are predefined.

## 4. Non-Functional Requirements

### Usability
- The interface should be simple and intuitive.
- The application should work on desktop and mobile screens.
- Forms should display clear validation and error messages.

### Security
- Authentication will use Supabase Auth.
- Database access will be protected using Row Level Security (RLS).
- Sensitive service-role keys must never be exposed in frontend code.
- Real participant data must not be used in public documentation or screenshots.

### Data Management
- Application data will be stored in Supabase using the `groups`, `participants` and `attendance` tables.
- Required create, read, update and delete operations will be implemented for participants and attendance records.
- The application should handle loading, success and error states.

## 5. MVP Completion Criteria

The MVP is considered complete when:

- The trainer can securely sign in and sign out using Supabase Auth.
- Unauthenticated users cannot access protected application data.
- The trainer can view the two predefined groups: Monday / Wednesday and Tuesday / Thursday.
- The trainer can create, view, edit and delete participants.
- Every participant is assigned to exactly one group.
- Neither group can exceed six participants, including when a participant is created or reassigned.
- The trainer can create, view, edit and delete attendance records by participant and date.
- The application prevents duplicate attendance records for the same participant and date.
- Participant and attendance data persists in Supabase after page refresh.
- The application uses only the three MVP data tables: `groups`, `participants` and `attendance`; trainer credentials are managed by Supabase Auth.
