
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadGroups() {
      const { data, error } = await supabase
        .from('groups')
        .select('id, name')

      if (error) {
        setError(error.message)
      } else {
        setGroups(data)
      }

      setLoading(false)
    }

    loadGroups()
  }, [])

  return (
    <main>
      <h1>Training Attendance App</h1>
      <h2>Training Groups</h2>

      {loading && <p>Loading groups...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
