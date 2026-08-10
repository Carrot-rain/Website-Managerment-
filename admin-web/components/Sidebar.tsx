import { NavLink } from 'react-router-dom'


function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">WM</div>

        <div>
          <div className="sidebar-title">Website Manager</div>
          <div className="sidebar-subtitle">Management Console</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-item nav-item-active' : 'nav-item'
          }
        >
          Overview
        </NavLink>

        <NavLink
          to="/sites"
          className={({ isActive }) =>
            isActive ? 'nav-item nav-item-active' : 'nav-item'
          }
        >
          Sites
        </NavLink>
      </nav>
    </aside>
  )
}


export default Sidebar