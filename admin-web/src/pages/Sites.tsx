import { useEffect, useState } from "react"

interface Site {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
  updated_at: string
}


function Sites() {
  const [sites,setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSites() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/sites"
        )

        if (!response.ok)
          throw new Error(
            `HTTP error: ${response.status}`
          )

        const data: Site[] = await response.json()

        setSites(data)
      } catch (error) {
        console.error(error)

        setError('Failed to load sites.')
      } finally {
        setLoading(false)
      }
    }

    loadSites()
  }, [])
  
  return (
    <div className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Sites</h1>
          <p>Manage static website instances.</p>
        </div>

        <button className="primary-button">
          Add Site
        </button>
      </header>

      <section className="status-card">
        {loading && (
          <p>Loading sites...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading && !error && sites.length === 0 && (
          <p>No sites yet.</p>
        )}

        {!loading && !error && sites.length > 0 && (
          <table className="sites-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {sites.map((site) => (
                <tr key={site.id}>
                  <td>{site.name}</td>
                  <td>{site.slug}</td>
                  <td>{site.status}</td>
                  <td>
                    {new Date(
                      site.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}


export default Sites



