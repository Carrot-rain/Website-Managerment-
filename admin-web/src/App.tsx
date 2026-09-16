import { Route, Routes } from 'react-router-dom'

import AdminLayout from './layouts/AdminLayout'
import Overview from './pages/Overview'
import Sites from './pages/Sites'

import RendererDemo from "./renderer/demo/RendererDemo";
import PageEditor from "./editor/PageEditor";


function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/sites" element={<Sites />} />
      </Route>
      <Route path="/renderer-demo" element={<RendererDemo />}/>
      <Route path="/editor-demo" element={<PageEditor />}/>
    </Routes>
  );
}


export default App