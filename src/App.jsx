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
  const [participantName, setParticipantName] = useState('')
  const [participantPhone, setParticipantPhone] = useState('')
  const [savingParticipant, setSavingParticipant] = useState(false)
  const [participantSaveMessage, setParticipantSaveMessage] = useState(null)
  const [editingParticipantId, setEditingParticipantId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editingPhone, setEditingPhone] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editMessage, setEditMessage] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletingParticipant, setDeletingParticipant] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(null)
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [groupsError, setGroupsError] = useState(null)
  const [participantsError, setParticipantsError] = useState(null)
  const [attendanceError, setAttendanceError] = useState(null)
  const [savingAttendance, setSavingAttendance] = useState({})
  const [attendanceSaveMessages, setAttendanceSaveMessages] = useState({})

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
        .select('id, name, phone')
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

  async function handleAddParticipant(event) {
    event.preventDefault()
    if (savingParticipant || !selectedGroup || participants.length >= 6) return

    setSavingParticipant(true)
    setParticipantSaveMessage(null)

    const { error } = await supabase.from('participants').insert({
      name: participantName.trim(),
      phone: participantPhone.trim() || null,
      group_id: selectedGroup.id,
    })

    if (error) {
      setParticipantSaveMessage({ type: 'error', text: `Couldn’t add participant: ${error.message}` })
      setSavingParticipant(false)
      return
    }

    setParticipantName('')
    setParticipantPhone('')
    setParticipantSaveMessage({ type: 'success', text: 'Participant added successfully.' })
    setSavingParticipant(false)

    const { data, error: refreshError } = await supabase
      .from('participants')
      .select('id, name, phone')
      .eq('group_id', selectedGroup.id)

    if (refreshError) {
      setParticipantsError(refreshError.message)
    } else {
      setParticipants(data ?? [])
    }
  }

  function startEditing(participant) {
    setEditingParticipantId(participant.id)
    setEditingName(participant.name)
    setEditingPhone(participant.phone ?? '')
    setEditMessage(null)
  }

  function cancelEditing() {
    setEditingParticipantId(null)
    setEditingName('')
    setEditingPhone('')
    setEditMessage(null)
  }

  async function handleUpdateParticipant(event, participantId) {
    event.preventDefault()
    if (savingEdit || !editingName.trim()) return

    setSavingEdit(true)
    setEditMessage(null)

    const { error } = await supabase
      .from('participants')
      .update({ name: editingName.trim(), phone: editingPhone.trim() || null })
      .eq('id', participantId)

    if (error) {
      setEditMessage({ type: 'error', text: `Couldn’t update participant: ${error.message}` })
      setSavingEdit(false)
      return
    }

    const { data, error: refreshError } = await supabase
      .from('participants')
      .select('id, name, phone')
      .eq('group_id', selectedGroup.id)

    if (refreshError) {
      setParticipantsError(refreshError.message)
      setEditMessage({ type: 'error', text: `Participant updated, but the list could not refresh: ${refreshError.message}` })
    } else {
      setParticipants(data ?? [])
      setEditMessage({ type: 'success', text: 'Participant updated successfully.' })
    }

    setEditingParticipantId(null)
    setEditingName('')
    setEditingPhone('')
    setSavingEdit(false)
  }

  async function handleDeleteParticipant() {
    if (!deleteTarget || deletingParticipant) return

    setDeletingParticipant(true)
    setDeleteMessage(null)

    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', deleteTarget.id)

    if (error) {
      setDeleteMessage({ type: 'error', text: `Couldn’t delete participant: ${error.message}` })
      setDeletingParticipant(false)
      setDeleteTarget(null)
      return
    }

    const deletedName = deleteTarget.name
    setDeleteTarget(null)
    setDeletingParticipant(false)

    const { data, error: refreshError } = await supabase
      .from('participants')
      .select('id, name, phone')
      .eq('group_id', selectedGroup.id)

    if (refreshError) {
      setParticipantsError(refreshError.message)
      setDeleteMessage({ type: 'error', text: `Participant deleted, but the list could not refresh: ${refreshError.message}` })
    } else {
      setParticipants(data ?? [])
      setAttendance((current) => current.filter((record) => record.participant_id !== deleteTarget.id))
      setDeleteMessage({ type: 'success', text: `${deletedName} was deleted, along with their attendance records.` })
    }
  }

  async function handleAttendanceChange(participantId, nextStatus) {
    if (savingAttendance[participantId]) return

    const existingRecord = attendance.find((record) => record.participant_id === participantId)
    if (
      (nextStatus === 'not-recorded' && !existingRecord) ||
      (nextStatus === 'present' && existingRecord?.present === true) ||
      (nextStatus === 'absent' && existingRecord?.present === false)
    ) return

    setSavingAttendance((current) => ({ ...current, [participantId]: true }))
    setAttendanceSaveMessages((current) => ({ ...current, [participantId]: null }))

    let error
    if (nextStatus === 'not-recorded') {
      ({ error } = await supabase
        .from('attendance')
        .delete()
        .eq('participant_id', participantId)
        .eq('session_date', sessionDate))
    } else {
      ({ error } = await supabase
        .from('attendance')
        .upsert({
          participant_id: participantId,
          session_date: sessionDate,
          present: nextStatus === 'present',
        }, { onConflict: 'participant_id,session_date' }))
    }

    if (error) {
      setAttendanceSaveMessages((current) => ({
        ...current,
        [participantId]: { type: 'error', text: `Couldn’t save attendance: ${error.message}` },
      }))
      setSavingAttendance((current) => ({ ...current, [participantId]: false }))
      return
    }

    const { data, error: refreshError } = await supabase
      .from('attendance')
      .select('participant_id, present')
      .in('participant_id', participants.map((participant) => participant.id))
      .eq('session_date', sessionDate)

    if (refreshError) {
      setAttendanceSaveMessages((current) => ({
        ...current,
        [participantId]: { type: 'error', text: `Attendance saved, but refresh failed: ${refreshError.message}` },
      }))
      setAttendanceError(refreshError.message)
    } else {
      setAttendance(data ?? [])
      setAttendanceSaveMessages((current) => ({
        ...current,
        [participantId]: { type: 'success', text: 'Attendance saved.' },
      }))
      setAttendanceError(null)
    }

    setSavingAttendance((current) => ({ ...current, [participantId]: false }))
  }

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

          <form className="participant-form" onSubmit={handleAddParticipant}>
            <h3>Add a participant</h3>
            <div className="form-fields">
              <label>
                Name
                <input
                  type="text"
                  value={participantName}
                  onChange={(event) => setParticipantName(event.target.value)}
                  required
                  maxLength={120}
                  autoComplete="name"
                  disabled={savingParticipant || participants.length >= 6}
                />
              </label>
              <label>
                Phone <span className="optional-label">(optional)</span>
                <input
                  type="tel"
                  value={participantPhone}
                  onChange={(event) => setParticipantPhone(event.target.value)}
                  autoComplete="tel"
                  disabled={savingParticipant || participants.length >= 6}
                />
              </label>
              <button
                className="submit-button"
                type="submit"
                disabled={savingParticipant || participants.length >= 6 || !participantName.trim()}
              >
                {savingParticipant ? 'Saving…' : 'Add participant'}
              </button>
            </div>
            {participants.length >= 6 && (
              <p className="status">This group has reached its limit of 6 participants.</p>
            )}
            {participantSaveMessage && (
              <p className={participantSaveMessage.type} role={participantSaveMessage.type === 'error' ? 'alert' : 'status'}>
                {participantSaveMessage.text}
              </p>
            )}
          </form>

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
                    const status = record ? (record.present ? 'present' : 'absent') : 'not-recorded'

                    return (
                      <li key={participant.id}>
                        {editingParticipantId === participant.id ? (
                          <form className="edit-participant-form" onSubmit={(event) => handleUpdateParticipant(event, participant.id)}>
                            <label>
                              Name
                              <input
                                type="text"
                                value={editingName}
                                onChange={(event) => setEditingName(event.target.value)}
                                required
                                maxLength={120}
                                autoFocus
                                disabled={savingEdit}
                              />
                            </label>
                            <label>
                              Phone <span className="optional-label">(optional)</span>
                              <input
                                type="tel"
                                value={editingPhone}
                                onChange={(event) => setEditingPhone(event.target.value)}
                                disabled={savingEdit}
                              />
                            </label>
                            <div className="edit-actions">
                              <button className="submit-button" type="submit" disabled={savingEdit || !editingName.trim()}>
                                {savingEdit ? 'Saving…' : 'Save'}
                              </button>
                              <button className="cancel-button" type="button" onClick={cancelEditing} disabled={savingEdit}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <span className="participant-name">{participant.name}</span>
                            <label className="attendance-control">
                              <span className="sr-only">Attendance for {participant.name}</span>
                              <select
                                value={status}
                                onChange={(event) => handleAttendanceChange(participant.id, event.target.value)}
                                disabled={savingAttendance[participant.id]}
                                aria-label={`Attendance for ${participant.name}`}
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="not-recorded">Not recorded</option>
                              </select>
                              {savingAttendance[participant.id] && <span className="saving-label">Saving…</span>}
                            </label>
                            <div className="participant-actions">
                              <button className="edit-button" type="button" onClick={() => startEditing(participant)}>
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                type="button"
                                onClick={() => {
                                  setDeleteMessage(null)
                                  setDeleteTarget(participant)
                                }}
                                disabled={deletingParticipant}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                        {attendanceSaveMessages[participant.id] && (
                          <span className={`attendance-feedback ${attendanceSaveMessages[participant.id].type}`} role={attendanceSaveMessages[participant.id].type === 'error' ? 'alert' : 'status'}>
                            {attendanceSaveMessages[participant.id].text}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
              {editMessage && (
                <p className={editMessage.type} role={editMessage.type === 'error' ? 'alert' : 'status'}>
                  {editMessage.text}
                </p>
              )}
              {deleteMessage && (
                <p className={deleteMessage.type} role={deleteMessage.type === 'error' ? 'alert' : 'status'}>
                  {deleteMessage.text}
                </p>
              )}
            </>
          )}
        </section>
      )}

      {deleteTarget && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="confirmation-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-message"
          >
            <h2 id="delete-dialog-title">Delete {deleteTarget.name}?</h2>
            <p id="delete-dialog-message">
              This permanently deletes this participant and all of their attendance records. This cannot be undone.
            </p>
            <div className="dialog-actions">
              <button
                className="cancel-button"
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingParticipant}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                type="button"
                onClick={handleDeleteParticipant}
                disabled={deletingParticipant}
              >
                {deletingParticipant ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
