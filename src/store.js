// Simple client-side data store with localStorage persistence
// In production, replace with a real backend API

const STORE_KEY = 'nsie_store'

const defaultStore = {
  // Blog posts submitted by users (pending review)
  pendingPosts: [],
  // Approved posts (mixed with built-in)
  approvedPosts: [],
  // Products submitted by users (pending review)
  pendingProducts: [],
  // Approved products
  approvedProducts: [],
  // Comments on blog posts: { postIndex: [{ author, content, date }] }
  comments: {},
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return JSON.parse(JSON.stringify(defaultStore))
}

function save(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}

export function getStore() {
  return load()
}

export function getPendingPosts() {
  const s = load()
  return s.pendingPosts || []
}

export function getApprovedPosts() {
  const s = load()
  return s.approvedPosts || []
}

export function getAllPosts() {
  const s = load()
  return [...(s.approvedPosts || [])].reverse()
}

export function submitPost(post) {
  const s = load()
  s.pendingPosts = s.pendingPosts || []
  s.pendingPosts.push({
    id: Date.now(),
    ...post,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  })
  save(s)
}

export function approvePost(id) {
  const s = load()
  const idx = (s.pendingPosts || []).findIndex(p => p.id === id)
  if (idx === -1) return false
  const post = s.pendingPosts.splice(idx, 1)[0]
  post.status = 'approved'
  s.approvedPosts = s.approvedPosts || []
  s.approvedPosts.unshift(post)
  save(s)
  return true
}

export function rejectPost(id) {
  const s = load()
  const idx = (s.pendingPosts || []).findIndex(p => p.id === id)
  if (idx === -1) return false
  s.pendingPosts.splice(idx, 1)
  save(s)
  return true
}

export function getPendingProducts() {
  const s = load()
  return s.pendingProducts || []
}

export function getApprovedProducts() {
  const s = load()
  return s.approvedProducts || []
}

export function getAllProducts() {
  const s = load()
  return [...(s.approvedProducts || [])].reverse()
}

export function submitProduct(product) {
  const s = load()
  s.pendingProducts = s.pendingProducts || []
  s.pendingProducts.push({
    id: Date.now(),
    ...product,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  })
  save(s)
}

export function approveProduct(id) {
  const s = load()
  const idx = (s.pendingProducts || []).findIndex(p => p.id === id)
  if (idx === -1) return false
  const p = s.pendingProducts.splice(idx, 1)[0]
  p.status = 'approved'
  s.approvedProducts = s.approvedProducts || []
  s.approvedProducts.unshift(p)
  save(s)
  return true
}

export function rejectProduct(id) {
  const s = load()
  const idx = (s.pendingProducts || []).findIndex(p => p.id === id)
  if (idx === -1) return false
  s.pendingProducts.splice(idx, 1)
  save(s)
  return true
}

// Comments
export function getComments(postId) {
  const s = load()
  return (s.comments || {})[postId] || []
}

export function addComment(postId, comment) {
  const s = load()
  s.comments = s.comments || {}
  s.comments[postId] = s.comments[postId] || []
  s.comments[postId].push({
    id: Date.now(),
    ...comment,
    date: new Date().toISOString(),
  })
  save(s)
}
