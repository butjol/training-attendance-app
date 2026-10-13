import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [participants, setParticipants] = useState([])
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [groupsError, setGroupsError] = useState(null)
  const [participantsError, setParticipantsError] = useState(null)

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

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Training attendance</p>
        <h1>Choose a training group</h1>
        <p className="intro">Select a group to see its participants.</p>
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

          {participantsLoading && <p className="status" role="status">Loading participants…</p>}
          {participantsError && <p className="error" role="alert">Couldn’t load participants: {participantsError}</p>}

          {!participantsLoading && !participantsError && participants.length === 0 && (
            <p className="empty-message">There are no participants in this group yet.</p>
          )}

          {!participantsLoading && !participantsError && participants.length > 0 && (
            <ul className="participant-list">
              {participants.map((participant) => (
                <li key={participant.id}>{participant.name}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}

export default App
