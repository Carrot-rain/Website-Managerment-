function Sites() {
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

      <section className="empty-state">
        <h2>No sites yet</h2>

        <p>
          Your managed websites will appear here.
        </p>
      </section>
    </div>
  )
}


export default Sites