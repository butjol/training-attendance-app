import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const initialSessionDate = '2026-10-12'
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [participants, setParticipants] = useState([])
  const [sessionDate, setSessionDate] = useState(initialSessionDate)
  const [attendance, setAttendance] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [groupsError, setGroupsError] = useState(null)
  const [participantsError, setParticipantsError] = useState(null)
  const [attendanceError, setAttendanceError] = useState(null)

  useEffect(() => {
    async function loadGroups() {
      const { data, error } = await supabase.from('groups').select('id, name')

      if (error) {
        setGroupsError(error.message)
      } else {
        setGroups(data ?? [])
      }

      setGroupsLoading(false)
    }

    loadGroups()
  }, [])

  useEffect(() => {
    if (!selectedGroup) return

    let isCurrent = true

    async function loadParticipants() {
      setParticipantsLoading(true)
      setParticipantsError(null)
      setParticipants([])

      const { data, error } = await supabase
        .from('participants')
        .select('id, name')
        .eq('group_id', selectedGroup.id)

      if (!isCurrent) return

      if (error) {
        setParticipantsError(error.message)
      } else {
        setParticipants(data ?? [])
      }

      setParticipantsLoading(false)
    }

    loadParticipants()

    return () => {
      isCurrent = false
    }
  }, [selectedGroup])

  useEffect(() => {
    if (!selectedGroup || participantsLoading || participantsError || !sessionDate) return

    let isCurrent = true

    async function loadAttendance() {
      setAttendanceLoading(true)
      setAttendanceError(null)
      setAttendance([])

      const participantIds = participants.map((participant) => participant.id)
      if (participantIds.length === 0) {
        setAttendanceLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('attendance')
        .select('participant_id, present')
        .in('participant_id', participantIds)
        .eq('session_date', sessionDate)

      if (!isCurrent) return

      if (error) {
        setAttendanceError(error.message)
      } else {
        setAttendance(data ?? [])
      }

      setAttendanceLoading(false)
    }

    loadAttendance()

    return () => {
      isCurrent = false
    }
  }, [selectedGroup, sessionDate, participants, participantsLoading, participantsError])

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Training attendance</p>
        <h1>Training attendance</h1>
        <p className="intro">Select a group and session date to view attendance.</p>
      </header>

      <section aria-labelledby="groups-heading" className="groups-section">
        <h2 id="groups-heading">Training groups</h2>

        {groupsLoading && <p className="status" role="status">Loading groups…</p>}
        {groupsError && <p className="error" role="alert">Couldn’t load groups: {groupsError}</p>}

        {!groupsLoading && !groupsError && groups.length === 0 && (
          <p className="status">No training groups are available.</p>
        )}

        {!groupsLoading && !groupsError && groups.length > 0 && (
          <div className="group-list" aria-label="Training groups">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`group-card${selectedGroup?.id === group.id ? ' selected' : ''}`}
                aria-pressed={selectedGroup?.id === group.id}
                onClick={() => setSelectedGroup(group)}
              >
                <span>{group.name}</span>
                <span className="group-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedGroup && (
        <section aria-labelledby="participants-heading" className="participants-section" aria-live="polite">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected group</p>
              <h2 id="participants-heading">{selectedGroup.name}</h2>
            </div>
          </div>

          <div className="session-controls">
            <label htmlFor="session-date">Session date</label>
            <input
              id="session-date"
              type="date"
              value={sessionDate}
              onChange={(event) => setSessionDate(event.target.value)}
            />
          </div>

          {participantsLoading && <p className="status" role="status">Loading participants…</p>}
          {participantsError && <p className="error" role="alert">Couldn’t load participants: {participantsError}</p>}

          {!participantsLoading && !participantsError && participants.length === 0 && (
            <p className="empty-message">There are no participants in this group yet.</p>
          )}

          {!participantsLoading && !participantsError && participants.length > 0 && (
            <>
              {attendanceLoading && <p className="status" role="status">Loading attendance…</p>}
              {attendanceError && <p className="error" role="alert">Couldn’t load attendance: {attendanceError}</p>}
              {!attendanceLoading && !attendanceError && (
                <ul className="participant-list attendance-list">
                  {participants.map((participant) => {
                    const record = attendance.find((item) => item.participant_id === participant.id)
                    const status = record ? (record.present ? 'Present' : 'Absent') : 'Not recorded'
                    const statusClass = status.toLowerCase().replace(' ', '-')

                    return (
                      <li key={participant.id}>
                        <span>{participant.name}</span>
                        <span className={`attendance-status ${statusClass}`}>{status}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      )}
    </main>
  )
}

export default App
