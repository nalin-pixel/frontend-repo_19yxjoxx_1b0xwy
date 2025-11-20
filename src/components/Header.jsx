import { useState } from 'react'

export default function Header({ onCreateWorkspace, onCreatePage, currentWorkspace, currentPage }) {
  const [wsName, setWsName] = useState('')
  const [pageTitle, setPageTitle] = useState('')

  return (
    <div className="flex items-center justify-between h-14 border-b border-slate-800/60 px-4 bg-slate-900/70 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-2 text-slate-200">
        <span className="font-semibold">Notion Clone</span>
        <span className="text-slate-500">/</span>
        <span className="text-slate-400">{currentWorkspace?.name || 'No workspace'}</span>
        {currentPage && (
          <>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">{currentPage.title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            value={wsName}
            onChange={(e) => setWsName(e.target.value)}
            placeholder="New workspace name"
            className="bg-slate-800/70 border border-slate-700 text-slate-200 text-sm rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            onClick={() => { if (wsName.trim()) { onCreateWorkspace(wsName.trim()); setWsName('') }}}
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1"
          >
            Add Workspace
          </button>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <input
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="New page title"
            className="bg-slate-800/70 border border-slate-700 text-slate-200 text-sm rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <button
            onClick={() => { if (pageTitle.trim()) { onCreatePage(pageTitle.trim()); setPageTitle('') }}}
            className="text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded px-3 py-1"
          >
            Add Page
          </button>
        </div>
      </div>
    </div>
  )
}
