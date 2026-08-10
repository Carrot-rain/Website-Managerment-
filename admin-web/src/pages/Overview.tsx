import { useEffect, useState } from 'react'


interface HelloResponse {
  message: string
}


function Overview() {
  const [message, setMessage] = useState('正在连接后端...')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch('http://localhost:8000/api/hello')

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data: HelloResponse = await response.json()

        setMessage(data.message)
        setConnected(true)
      } catch (error) {
        console.error(error)

        setMessage('无法连接后端')
        setConnected(false)
      }
    }

    checkBackend()
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Overview</h1>
          <p>Website Manager system overview.</p>
        </div>
      </header>

      <section className="status-card">
        <div className="status-card-header">
          <h2>Backend Status</h2>

          <span
            className={
              connected
                ? 'status-badge status-online'
                : 'status-badge status-offline'
            }
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <p>{message}</p>
      </section>
    </div>
  )
}


export default Overview