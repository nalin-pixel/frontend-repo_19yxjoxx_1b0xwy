import { useEffect, useState } from 'react'
import { getPage, updatePageTitle, getBlocks, createBlock, updateBlock, deleteBlock } from '../lib/api'
import { PlusCircle, CheckSquare, Type, Trash2 } from 'lucide-react'

export default function Editor({ page }) {
  const [title, setTitle] = useState(page?.title || 'Untitled')
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    if (!page) return
    setTitle(page.title)
    ;(async () => {
      const items = await getBlocks(page._id)
      setBlocks(items)
    })()
  }, [page])

  const saveTitle = async () => {
    if (!page) return
    await updatePageTitle(page._id, title)
  }

  const addBlock = async (type) => {
    if (!page) return
    const payload = {
      page_id: page._id,
      type,
      content: '',
      checked: false,
      position: blocks.length,
    }
    const created = await createBlock(payload)
    setBlocks((prev) => [...prev, { ...payload, _id: created._id }])
  }

  const handleChangeBlock = async (id, updates) => {
    setBlocks((prev) => prev.map(b => b._id === id ? { ...b, ...updates } : b))
    await updateBlock(id, updates)
  }

  const handleDeleteBlock = async (id) => {
    setBlocks((prev) => prev.filter(b => b._id !== id))
    await deleteBlock(id)
  }

  if (!page) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center text-slate-400">
        Select or create a page
      </div>
    )
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-900/40 text-slate-100 px-10 py-8">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
        placeholder="Untitled"
        className="w-full bg-transparent text-3xl font-semibold outline-none mb-6 placeholder:text-slate-500"
      />

      <div className="space-y-3">
        {blocks.map((b) => (
          <div key={b._id} className="group flex items-start gap-3">
            {b.type === 'todo' ? (
              <input type="checkbox" checked={!!b.checked} onChange={(e) => handleChangeBlock(b._id, { checked: e.target.checked })} className="mt-1" />
            ) : (
              <span className="mt-1 text-slate-500"><Type className="w-4 h-4" /></span>
            )}

            {b.type === 'todo' ? (
              <input
                value={b.content}
                onChange={(e) => handleChangeBlock(b._id, { content: e.target.value })}
                className="flex-1 bg-transparent outline-none border-b border-transparent focus:border-slate-700 pb-1"
                placeholder="To-do"
              />
            ) : (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleChangeBlock(b._id, { content: e.target.innerText })}
                className="flex-1 min-h-[24px] outline-none border-b border-transparent focus:border-slate-700 pb-1"
              >
                {b.content}
              </div>
            )}

            <button onClick={() => handleDeleteBlock(b._id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 text-slate-400">
        <button onClick={() => addBlock('text')} className="hover:text-slate-200 flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Text</button>
        <button onClick={() => addBlock('todo')} className="hover:text-slate-200 flex items-center gap-2"><CheckSquare className="w-5 h-5" /> To-do</button>
      </div>
    </div>
  )
}
