# Training Attendance App – MVP Specification

## 1. MVP Goal

Build a simple web application that helps an independent fitness trainer manage training groups, participants and attendance.

The application will use React, Vite, CSS and Supabase.

The first MVP version supports one user role: Trainer.

## 2. Functional Requirements

### FR-01: Trainer Authentication

**Priority: Must have**

The trainer can securely sign in and sign out.

**Acceptance Criteria**
- The trainer can sign in using email and password.
- Invalid login credentials display an error message.
- Unauthenticated users cannot access protected application data.
- The trainer can sign out.

### FR-02: Participant Management

**Priority: Must have**

The trainer can manage participant records.

**Acceptance Criteria**
- The trainer can add a participant with a name and phone number.
- The trainer can view the participant list.
- The trainer can edit participant details.
- The trainer can delete a participant after confirmation.
- A participant's name is required.
- Participant data is stored in Supabase.

### FR-03: Training Group Management

**Priority: Must have**

The trainer can manage two recurring training groups:

- Monday / Wednesday
- Tuesday / Thursday

Each group has a maximum capacity of six participants.

**Acceptance Criteria**
- The trainer can view both groups.
- The trainer can assign participants to a group.
- The trainer can remove participants from a group.
- A group cannot contain more than six participants.
- The application displays the participants assigned to each group.
- Group assignments are stored in Supabase.

### FR-04: Attendance Tracking

**Priority: Must have**

The trainer can record attendance for training sessions.

**Acceptance Criteria**
- The trainer can select a training group and session date.
- The application displays participants assigned to the selected group.
- The trainer can mark each participant as Present or Absent.
- The trainer can save attendance records.
- The trainer can view and correct previously saved attendance records.
- Attendance records are stored in Supabase.

### FR-05: Membership Management

**Priority: Should have**

The trainer can register a participant's membership.

Available membership types:

| Membership | Duration | Price |
|---|---|---|
| Standard | 4 weeks | €110 |
| Extended | 8 weeks | €200 |

**Acceptance Criteria**
- The trainer can select a participant and membership type.
- The trainer can enter the membership start date, corresponding to the first training session.
- The application calculates the end date based on membership duration.
- The trainer can view and update membership details.
- Membership data is stored in Supabase.

Automatic calculation of remaining training sessions is excluded from the MVP.

### FR-06: Payment Tracking

**Priority: Should have**

The trainer can record payments associated with memberships.

**Acceptance Criteria**
- The trainer can record a payment amount and date.
- The trainer can associate a payment with a participant's membership.
- The trainer can view recorded payments.
- The trainer can correct or delete an incorrect payment record.
- Payment data is stored in Supabase.

## 3. Out of Scope

The following features are excluded from the first MVP:

- Participant accounts and self-service.
- Automatic SMS or email notifications.
- Online payment processing.
- Replacement sessions in other groups.
- Automatic calculation of remaining sessions.
- Advanced reporting and analytics.
- External calendar integrations.

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
- Application data will be stored in Supabase.
- Required CRUD operations will be implemented for core entities.
- The application should handle loading, success and error states.

## 5. MVP Completion Criteria

The MVP is considered complete when:

- The trainer can securely sign in.
- Participants can be created, viewed, edited and deleted.
- Participants can be assigned to the two training groups.
- Group capacity is limited to six participants.
- Attendance can be recorded, viewed and corrected.
- Data persists in Supabase after page refresh.
- Protected data cannot be accessed without authentication.
- The application is deployed and accessible through a public URL.

Membership and payment functionality will be implemented after the core features, if time permits.