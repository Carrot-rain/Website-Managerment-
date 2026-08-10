import { Route, Routes } from 'react-router-dom'

import AdminLayout from './layouts/AdminLayout'
import Overview from './pages/Overview'
import Sites from './pages/Sites'


function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/sites" element={<Sites />} />
      </Route>
    </Routes>
  )
}


export default App