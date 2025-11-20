const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPatch(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
  return res.json()
}

// High-level helpers
export const getWorkspaces = () => apiGet('/api/workspaces')
export const createWorkspace = (name) => apiPost('/api/workspaces', { name })

export const getPages = (workspaceId) => apiGet(`/api/pages${workspaceId ? `?workspace_id=${workspaceId}` : ''}`)
export const createPage = (workspace_id, title = 'Untitled') => apiPost('/api/pages', { workspace_id, title })
export const getPage = (pageId) => apiGet(`/api/pages/${pageId}`)
export const updatePageTitle = (pageId, title) => apiPatch(`/api/pages/${pageId}`, { title })

export const getBlocks = (pageId) => apiGet(`/api/blocks?page_id=${pageId}`)
export const createBlock = (payload) => apiPost('/api/blocks', payload)
export const updateBlock = (blockId, payload) => apiPatch(`/api/blocks/${blockId}`, payload)
export const deleteBlock = (blockId) => apiDelete(`/api/blocks/${blockId}`)
