
import {page} from './page'
import { derived, writable } from 'svelte/store';
import {collections} from './collections'
import {fetch} from './fetch.js'

export const refreshPublication = writable({id: null, time: Date.now()})

const publicationId = derived(page, ($page) => $page.params.publicationId)

const publicationWorkspace = derived(page, ($page) => $page.params.workspace)

const publicationStack = derived(page, ($page) => $page.params.collection)

export const notesSearch = writable('')


export const publicationNotes = derived([publicationId, refreshPublication, notesSearch, publicationWorkspace, publicationStack], ([$publicationId, $refreshPublication, $notesSearch, $publicationWorkspace, $publicationStack], set) => {
  if (!$refreshPublication.id || $refreshPublication.id !== $publicationId) {
    set([])
  }
  if (!process.browser || !$publicationId) return
  let url = `/api/notes/${$publicationId}`
  const query = new URLSearchParams({orderBy: 'updated'})
  if ($notesSearch) {
    query.append("search", $notesSearch)
  }
  if ($publicationWorkspace && $publicationWorkspace !== 'all') {
    query.append("workspace", $publicationWorkspace)
  }
  if ($publicationStack && $publicationStack !== 'all') {
    query.append("stack", $publicationStack)
  }
  

  url = `${url}?${query.toString()}`
  return fetch(url)
    .then(lib => {
      set(lib.items)
    })
    .catch(err => {
      set([])
      console.error(err)
    })
}, [])

export const publication = derived([publicationId, refreshPublication], ([$publicationId, $refreshPublication], set) => {
  if (!$refreshPublication.id || $refreshPublication.id !== $publicationId) {
    set({type: 'loading', items: [], 
    tags: [], keywords: [], replies: []})
  }
  if (!process.browser || !$publicationId) return
  const url = `/api/publication/${$publicationId}`
  return fetch(url)
    .then(lib => {
      set(lib)
    })
    .catch(err => {
      set({type: 'failed'})
      console.error(err)
    })
})

// All of the stack objects need to be sourced from $collections for the set object to work
export const publicationStacks = derived([publication, collections], ([$publication, $collections], set) => {
  const tags = $publication.tags.filter(tag => tag.type !== 'workspace').map(tag => $collections.find(item => item.id === tag.id))
  set(new Set(tags))
}, new Set())


export const addingStacks = writable(new Set())
export const removingStacks = writable(new Set())

export const workingStacks = derived([addingStacks, publicationStacks, removingStacks], ([$addingStacks,  $publicationStacks, $removingStacks], set) => {
  const union = new Set(Array.from($addingStacks).concat(Array.from($publicationStacks)).filter(tag => !$removingStacks.has(tag)))
  set(union)
}, new Set())

export const availableStacks = derived([workingStacks, collections], ([$workingStacks, $collections], set) => {
  const available = $collections.filter(tag => !$workingStacks.has(tag))
  set(new Set(available))
}, new Set())




export const contents = derived(publication, ($publication, set) => {
  if ($publication.json && $publication.json.contents) {
    set($publication.json.contents)
    return
  }
  if (!process.browser || !$publication.links) {
    set({
      type: 404,
      heading: "",
      children: []
    })
    return
  }
  const contentsLink = $publication.links.find(link => link.rel === "contents")
  if (!contentsLink) return
  const url = contentsLink.url
  return window.fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        return {
          type: "processing",
          heading: "Processing...",
          children: []
        }
      }
    })
    .then(contents => {
      set(contents)
    })
    .catch(err => {
      set({type: 'failed'})
      console.error(err)
    })
}, {type: 'loading', children: []})

export const chapterId = writable(null)

export const chapter = derived([chapterId, publication], ([$chapterId, $publication], set) => {
  if (!process.browser) return
  if (!$chapterId) {
    set({type: "Loading", contents: "", stylesheets: []})
    return
  }
  if (!$publication.json) return
  const storageId = $publication.json.storageId
  if (!storageId) return
  return window.fetch(`/api/read/${$publication.shortId}/${storageId}/${$chapterId}`)
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        return {
          type: "processing",
          heading: "Processing...",
          contents: "",
          stylesheets: []
        }
      }
    })
    .then(contents => {
      set(contents)
    })
    .catch(err => {
      set({type: 'failed', stylesheets: [], contents: ""})
      console.error(err)
    })
}, {type: "Loading", contents: "", stylesheets: []})


export const storedPub = derived(publication, ($publication, set) => {
  if (!process.browser || !$publication.json) {
    set({
      type: 404,
      readingOrder: []
    })
    return
  }
  const storageId = $publication.json.storageId
  if (!storageId) return
  return window.fetch(`/api/read/${$publication.shortId}/${storageId}/`)
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        return {
          type: "processing",
          heading: "Processing...",
          readingOrder: []
        }
      }
    })
    .then(contents => {
      set(contents)
    })
    .catch(err => {
      set({type: 'failed'})
      console.error(err)
    })
}, {type: 'loading', readingOrder: []})