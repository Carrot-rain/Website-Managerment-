import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'


function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}


export default AdminLayout