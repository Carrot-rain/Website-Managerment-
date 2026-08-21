import { useEffect, useState } from "react"
import type { FormEvent } from "react"

interface Site {
  id: string
  name: string
  slug: string
  status: string
  created_at: string
  updated_at: string
}

interface SiteUpdate {
  name?: string
  slug?: string
  status?: string
}

function Sites() {

  // =========================
  // Sites 数据相关状态
  // =========================
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // =========================
  // 创建 Site 表单相关状态
  // =========================
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [editStatus, setEditStatus] = useState("")

  const [creating, setCreating] = useState(false)
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null)
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null)


  // =========================
  // 页面加载时读取 Sites
  // =========================
  useEffect(() => {
    async function loadSites() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/sites"
        )

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          )
        }

        const data: Site[] = await response.json()

        setSites(data)
      } catch (error) {
        console.error(error)

        setError("Failed to load sites.")
      } finally {
        setLoading(false)
      }
    }

    loadSites()
  }, [])

  // =========================
  // 创建 Site
  // =========================
  async function handleCreateSite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setCreating(true)
    setError("")

    try {
      const response = await fetch(
        "http://localhost:8000/api/sites",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            slug: slug,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null)

        throw new Error(
          errorData?.detail ??
            `HTTP error: ${response.status}`
        )
      }

      const newSite: Site = await response.json()

      setSites((currentSites) => [
        newSite,
        ...currentSites,
      ])

      setName("")
      setSlug("")

      setShowCreateForm(false)
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to create site.")
      }
    } finally {
      setCreating(false)
    }
  }

  // =========================
  // 删除 Site
  // =========================
  async function handleDeleteSite(siteId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this site?"
    )

    if(!confirmed) {
      return
    }

    setDeletingSiteId(siteId)
    setError("")

    try{
      const response = await fetch(
        `http://localhost:8000/api/sites/${siteId}`,
        {
          method: "DELETE"
        }
      )

      if(!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null)
        
          throw new Error(
            errorData?.detail ??
              `HTTP error: ${response.status}`
          )
      }

      setSites((currentSites) => 
        currentSites.filter(
          (site) => site.id !== siteId
        )
      )

    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Failed to delete site.") 
      } 
      
    } finally {
      setDeletingSiteId(null)
    }
  }

  // =========================
  // 更新 Site
  // =========================
  async function handleUpdateSite(siteId: string) {

    const updates: SiteUpdate = {
      name: editName,
      slug: editSlug,
      status: editStatus,
    }

    try{
      const response = await fetch(
        `http://localhost:8000/api/sites/${siteId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify(updates),
        }
      )

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null)
        
          throw new Error(
            errorData?.detail ??
              `HTTP error: ${response.status}`
          )
      }

      const updatedSite: Site = await response.json()

      setSites((currentSites) => currentSites.map(
          (site) => site.id === updatedSite.id ? updatedSite : site
        )
      )

    } catch (error) {
      console.error(error)

    } finally {
      setDeletingSiteId(null)
    }

  }

  // =========================
  // 更新 Site
  // =========================
  function startEditSite(site: Site) {

    setEditingSiteId(site.id)
    setEditName(site.name)
    setEditSlug(site.slug)
    setEditStatus(site.status)

  }

  
  function cancelEdit() {

    setEditingSiteId(null)
    setEditName("")
    setEditSlug("")
    setEditStatus("")

  }


  // =========================
  // 页面内容
  // =========================
  return (
    <div className="page">

      <header className="page-header page-header-row">
        <div>
          <h1>Sites</h1>
          <p>Manage your websites.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          Add Site
        </button>
      </header>


      {showCreateForm && (
        <form
          className="site-form"
          onSubmit={handleCreateSite}
        >
          <input
            value={name}
            placeholder="Site name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            value={slug}
            placeholder="Slug"
            onChange={(e) => setSlug(e.target.value)}
          />

          <button
            className="primary-button"
            disabled={creating}
          >
            {creating ? "Creating..." : "Create"}
          </button>

        </form>
      )}


      {loading ? (

        <p>Loading...</p>

      ) : (

        <div className="site-list">

          {sites.map((site) => (

            <div
              className="site-card"
              key={site.id}
            >

              {editingSiteId === site.id ? (

                <div className="edit-form">

                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <input
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                  />

                  <input
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  />


                  <button
                    onClick={() => handleUpdateSite(site.id)}
                  >
                    Save
                  </button>


                  <button
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>

                </div>


              ) : (

                <>
                  <h2>{site.name}</h2>

                  <p>{site.slug}</p>

                  <p>
                    Status: {site.status}
                  </p>


                  <button
                    onClick={() => startEditSite(site)}
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    disabled={deletingSiteId === site.id}
                  >
                    {
                      deletingSiteId === site.id
                        ? "Deleting..."
                        : "Delete"
                    }
                  </button>

                </>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default Sites