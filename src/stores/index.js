
import { writable } from 'svelte/store';
export { page, params } from './page'
export { publication, contents, refreshPublication, addingStacks, 
  availableStacks, workingStacks, removingStacks, 
  publicationNotes, notesSearch, chapter, chapterId, storedPub, 
  placedNotes, chapterNotes } from './publication'
export { error } from './error'
export { nodes, intersecting, positions, annotations } from './utilities/nodes'

export { library, refreshDate, searchStore } from './library'
export { insource, refreshInSource } from './insource'
export { innote, refreshInNote } from './innote'
export { inntbk, refreshInNtbk } from './inntbk'
export { notes, refreshNotes, searchNotes, sourceNotes, 
  refreshSourceNotes } from './notes'
export { notebooks, refreshNotebooks, searchNotebooks, addedNotebooks, defaultNotebook } from './notebooks'
export { collections, workspaces, tags, refreshCollections, addingWorkspace, addedCollections, addedWorkspaces } from './collections'
export { note, refreshNote } from './note'
export { notebook, refreshNotebook } from './notebook'
export { pageItem, refreshPageItem } from "./pageitem";
export { pages, refreshPages, searchPages } from "./pages";
export { outline, refreshOutline, outlineNotesList, orderedOutlineNotes } from "./outline";
export { outlines, refreshOutlines, searchOutlines } from "./outlines";
export { searchedNotes, refreshSearchNotes, searchAddNotes } from './notebook/notes'
export { searchedSources, refreshSearchSources, searchAddSources } from './notebook/sources'
export { noteAddSources, sourceSearched } from './note/sources'
export { noteAddNotebooks, notebookSearched } from './note/notebooks'
export { pageNotes, refreshPageNotes, searchPageNotes } from './page/notes'
export { profileNotebooks } from './profile/notebooks'
export { profileNotes } from './profile/notes'
export { profileSources } from './profile/sources'
export { refreshReader, reader } from './profile/reader'
export { searchResults, search, isEmpty, sourcesEmpty, notesEmpty, notebooksEmpty } from './search'

export const selectedItems = writable(new Set());

export function addSelected(item) {
  selectedItems.update(set => {
    return set.add(item);
  });
}
export function removeSelected(item) {
  selectedItems.update(set => {
    set.delete(item);
    return set;
  });
}
export function clearSelected() {
  selectedItems.set(new Set());
}
