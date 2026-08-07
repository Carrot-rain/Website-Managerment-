import { useEffect, useState } from 'react'

interface HelloResponse {
  message: string
}

function App() {
  const [message, setMessage] = useState('正在请求后端...')

  useEffect(() => {
    async function loadMessage() {
      try {
        const response = await fetch('http://localhost:8000/api/hello')

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data: HelloResponse = await response.json()

        setMessage(data.message)
      } catch (error) {
        console.error(error)
        setMessage('请求后端失败')
      }
    }

    loadMessage()
  }, [])

  return (
    <main>
      <h1>Website Manager</h1>
      <p>{message}</p>
    </main>
  )
}

export default App