import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

function App() {
  const [activePage, setActivePage] = useState(null)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar onSelectPage={setActivePage} />
      <Editor page={activePage} />
    </div>
  )
}

export default App
