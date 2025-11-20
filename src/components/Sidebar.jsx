import { useEffect, useState } from 'react'
import { Plus, FileText, Home } from 'lucide-react'
import { getWorkspaces, createWorkspace, getPages, createPage } from '../lib/api'

export default function Sidebar({ onSelectPage }) {
  const [workspaces, setWorkspaces] = useState([])
  const [pagesByWs, setPagesByWs] = useState({})
  const [activeWs, setActiveWs] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const ws = await getWorkspaces()
        setWorkspaces(ws)
        if (ws.length) {
          setActiveWs(ws[0]._id)
          const pages = await getPages(ws[0]._id)
          setPagesByWs({ [ws[0]._id]: pages })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleAddWorkspace = async () => {
    const name = prompt('Workspace name')
    if (!name) return
    const ws = await createWorkspace(name)
    setWorkspaces((prev) => [...prev, ws])
  }

  const ensurePages = async (wsId) => {
    if (!pagesByWs[wsId]) {
      const pages = await getPages(wsId)
      setPagesByWs((p) => ({ ...p, [wsId]: pages }))
    }
  }

  const handleAddPage = async () => {
    if (!activeWs) return
    const title = prompt('Page title') || 'Untitled'
    const page = await createPage(activeWs, title)
    setPagesByWs((p) => ({ ...p, [activeWs]: [...(p[activeWs] || []), page] }))
  }

  return (
    <div className="w-72 bg-slate-900/60 border-r border-slate-800 text-slate-100 h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-blue-400" />
        <span className="font-semibold">Workspaces</span>
        <button onClick={handleAddWorkspace} className="ml-auto text-blue-400 hover:text-blue-300"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="space-y-2 overflow-y-auto">
        {loading && <div className="text-sm text-slate-400">Loading...</div>}
        {!loading && workspaces.map(ws => (
          <div key={ws._id} className="">
            <button onClick={async () => { setActiveWs(ws._id); await ensurePages(ws._id) }} className={`w-full text-left px-2 py-1 rounded hover:bg-slate-800 ${activeWs === ws._id ? 'bg-slate-800' : ''}`}>
              {ws.name}
            </button>
            {activeWs === ws._id && (
              <div className="ml-2 mt-1 space-y-1">
                <button onClick={handleAddPage} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Plus className="w-4 h-4" /> New page</button>
                <div className="space-y-1 mt-1">
                  {(pagesByWs[ws._id] || []).map(p => (
                    <button key={p._id} onClick={() => onSelectPage(p)} className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-slate-800">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
