<script>
  import KeyboardTuto from "./KeyboardTuto.svelte";
  import FilterNote from "./FilterNote.svelte";
  import NavNotes from "../../img/NavNotes.svelte";
  import NoNotes from "../../img/NoNotes.svelte";
  import SortSelect from "../../library/SortSelect.svelte";
  import IcoCloseColumn from "../../img/IcoCloseColumn.svelte";
  import NoteCardPage from "./NoteCardPage.svelte";
  import Loader from "../../widgets/Loader.svelte";
  import PageNotesSearcher from "./PageNotesSearcher.svelte";
  import { flip } from "svelte/animate";
  import { getToken } from "../../../getToken";
  import { dndzone, TRIGGERS } from "svelte-dnd-action";
  import { outline, refreshOutline, page, selectedItems, clearSelected, outlineNotesList, note } from "../../../stores";
  import {
    pageNotes,
  } from "../../../stores/page/notes.js";
  //export let items;
  export let requesting;
  export let keyboardNote;
  export let disabled;

  $: notebookNotes = $pageNotes;
  $: items = notebookNotes.items;

  const flipDurationMs = 300;
  let shouldIgnoreDndEvents = false;
  let dropFromOthersDisabled = true;

  let selecting = true;
  let selection = function() {
    //selectAll = false;
    if (!selecting) selecting = true;
  };

  function randomString() {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 8; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
   }
   return result.join('');
  }


  function addMultipleNotesToEndOfOutline (notes) {
  let list = $outlineNotesList;
  notes = notes.map(note => {
    note.previous = null;
    note.next = null;
    return note;
  })
  if (list.length) list[0].previous = null;

  let lastId = undefined;
  list = list.map(item => {
    if (!item.next) {
     // item.next = notes[0].shortId;
      lastId = item.shortId;
    }
    return item;
  })

  let orderedNotes = notes.map((item, i) => {
    item.previous = lastId
    lastId = item.shortId;
    item.next = notes[i+1] ? notes[i+1].shortId : undefined;
    return item;
  })

  list = list.map(item => {
    if (!item.next) {
      item.next = orderedNotes[0].shortId;
      //lastId = item.shortId;
    }
    return item;
  })

  list  = list.concat(orderedNotes);
  $outlineNotesList = list;
  return orderedNotes

}

async function handleResponse(status, notes) {
    let list = $outlineNotesList;
    if (status === 201 || status === 200) {
      list = list.map(item => {
        if (notes.find(notesItem => {
          return notesItem.shortId === item.shortId
        })) {
          item.display = 'ok'
        }
        return item;
      })
      $outlineNotesList = list;
    } else {
      list = list.map(item => {
        if (item.shortId === note.shortId) {
          item.display = 'error'
        }
        return item;
      })
      $outlineNotesList = list;
      setTimeout(() => {
        $refreshOutline = { id: $outline.id, time: Date.now() };
      }, 3000)

    }
  }

  async function addNoteToEnd() {
    let notes = Array.from($selectedItems);
    let editedNotes = notes.map((note, i) => {
      // format the note
      note.original = note.shortId;
      note.oldId = note.shortId;
      const index = $outline.readerId.indexOf('/readers/');
      const readerShortId = $outline.readerId.substring(index + 9);
      note.shortId = `${readerShortId}-${randomString()}`
      note.id = note.shortId;
      note.display = 'pending';
      note.contextId = $outline.id;
      note.fresh= false;

      return note;
    })

    let orderedNotes = addMultipleNotesToEndOfOutline(editedNotes)
    clearSelected()
    try {
       await window.fetch(
        `/api/outlines/${$page.params.outlineId}/notes`,
        {
          method: 'POST',
          credentials: "include",
          body: JSON.stringify(orderedNotes),
          headers: {
            "Content-Type": "application/json",
            "csrf-token": getToken(),
          },
        }
      ).then(async (res) => {
          await handleResponse(res.status, orderedNotes)
      })
    } catch (err) {
      console.error(err);
    }

  }


  function handleDndConsider(e) {
    const { trigger, id } = e.detail.info;

    if (trigger === TRIGGERS.DRAG_STARTED) {
      const idx = items.findIndex((item) => item.id === id);
      const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;

      e.detail.items.splice(idx, 0, { ...items[idx], id: newId });
      items = e.detail.items;
      shouldIgnoreDndEvents = true;
    } else if (!shouldIgnoreDndEvents) {
      items = e.detail.items;
    } else {
      items = [...items];
    }
  }

  function handleDndFinalize(e) {
    if (!shouldIgnoreDndEvents) {
      items = e.detail.items;
    } else {
      items = [...items];
      shouldIgnoreDndEvents = false;
    }
  }

  $: query = Object.assign({}, $page.query) || "";

  let filterOn = false;
  let clicked = false;
  $: if ((query.colour || query.flag) && !clicked) filterOn = true;

  let filter = () => {
    filterOn = !filterOn;
    clicked = true;
  };

  let closeColumn = false;
  let handleClick = () => {
    closeColumn = !closeColumn;
  };

  let keyDown = (e) => {
    if (e.key === "ArrowLeft") {
      let note;
      for (let i = 0; i < items.length; i++) {
        if (items[i].shortId === e.target.id) {
          note = i;
          break;
        }
      }
      keyboardNote = items[note];
      from = "outline";
    }
  };
  let startDrag = () => {
    if (requesting) return;
    disabled = false;
  };
  let stopDrag = () => {
    disabled = true;
  };

  let tuto,
    timer,
    from = "notes";
  let Tuto = (e) => {
    if (e.key === "Tab") {
      tuto = true;
      clearTimeout(timer);

      timer = setTimeout(() => {
        tuto = false;
      }, 2500);
    }
  };
</script>

<style>
  .NotesColumn,
  .ClosedNotesColumn *,
  .NotesColumn * {
    margin: 0;
    font-size: 0.75rem;
  }
  .ClosedNotesColumn {
    border-radius: 15px;
    padding: 10px 25px;
    border: 1px solid #dde8ed;
    overflow-y: scroll;
    cursor: pointer;
    margin: 0;
    right: 20px;
    top: 20px;
    position: fixed;
    background: #f1f5f8;
    transition: all 0.25s ease-out;
  }
  .NotesColumn {
    z-index: 1;
    background: #f1f5f8;
    position: sticky;
    width: 350px;
    right: 0;
    top: 0;
    height: 100vh;
    border-radius: 50px 0 0 0;
    padding: 30px 30px 0 30px;
    display: grid;
    grid-template-rows: repeat(4, max-content) 1fr;
    transition: all 0.25s ease-out;
    gap: 20px;
  }
  .NotesColumn.closeColumn {
    padding: 30px 0 0 0;
    width: 0;
    opacity: 0;
  }
  .Notes {
    display: grid;
    gap: 10px;
    overflow-y: scroll;
  }
  .Notes .Note {
    position: relative;
  }
  .Notes .Note:last-child {
    padding-bottom: 10px;
  }
  .Header {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 10px;
  }
  .ClosedNotesColumn .Header {
    grid-template-columns: max-content;
  }
  .Header h2 {
    display: grid;
    font-weight: 500;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 5px;
  }
  .Header h2 {
    color: var(--workspace-color);
    font-size: 1rem;
  }
  .Header h2 :global(svg) {
    width: auto;
    height: 13px;
  }
  .Header .Right span {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #dde8ed;
    display: grid;
    text-align: center;
    align-items: center;
    cursor: pointer;
  }
  .Header .Right span:hover {
    background: #c0d7e1;
  }
  .Header .Right span :global(svg) {
    margin: 0 auto;
  }
  .ListStyle {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    gap: 10px;
  }
  .Sorting {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 10px;
  }
  .ListStyle .Sorting p {
    font-weight: 500;
    float: left;
  }
  .ListStyle .Sorting :global(select) {
    padding: 0 28px 0 0;
    background: transparent;
  }
  .Filter {
    background: transparent;
    border: 2px solid var(--action);
    border-radius: 7px;
    color: var(--action);
    padding: 2px 15px;
    position: relative;
    float: right;
    display: grid;
    cursor: pointer;
  }
  .Filter:not(.active):hover {
    background: var(--main-background-color);
  }
  .Filter p {
    font-size: var(--item-font-size);
    float: left;
    font-weight: 700;
  }
  .active p,
  .active > :global(svg) {
    color: #ffffff;
  }
  .active {
    background: var(--action);
  }
  .Filters {
    background: #dde8ed;
    width: calc(100% + 60px);
    transform: translateX(-30px);
    padding: 0 30px;
    border-radius: 15px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.25s ease-out;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--base);
    margin: 0;
    position: relative;
    z-index: 1;
  }
  .Filters.active {
    padding: 30px;
    max-height: inherit;
    overflow: inherit;
  }
  .EmptyOutline {
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    gap: 20px;
    transform: translate(-50%, -50%);
  }
  .EmptyOutline p {
    text-align: center;
    font-size: 0.9rem;
    color: var(--action);
    font-weight: 600;
    margin: 0;
    opacity: 0.5;
  }
  .FiltersOn {
    background: #f05657;
    border-radius: 50%;
    color: #fff;
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
    font-weight: 600;
    position: absolute;
    top: -9px;
    text-align: center;
    right: -9px;
    display: grid;
    align-items: center;
  }
  div.DragZone {
    position:absolute;
    top: 15px;
    right: 15px;
    display: grid;
    gap: 3px;
    width: max-content;
    cursor: grab;
    opacity: 0.5;
    grid-template-columns: repeat(2, 5px);
  }
  div.DragZone span {
    background: var(--workspace-color);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-bottom: 1px;
  }
  .NotesColumnContext {
    /* This is a hack to force the note column into a new stacking context.
       By forcing a new stacking context we get proper z-index layering back. */
    transform: translate(0, 0);
  }
  .button {
    
  }

</style>

<div class="NotesColumnContext">
  <section class="NotesColumn" class:closeColumn>
    <div class="Header">
      <h2>
        <NavNotes />
        Notes
      </h2>
      <div class="Right">
        <span on:click={handleClick}>
          <IcoCloseColumn />
        </span>
      </div>

    </div>
    <PageNotesSearcher />
    <div class="ListStyle">
      <div class="Sorting">
        <SortSelect {query} path={$page.path}>Sort By:</SortSelect>
      </div>
      <section class="Filter {filterOn ? 'active' : ''}" on:click={filter}>
        <p>Filter</p>
        {#if query.colour || query.flag}
          <span class="FiltersOn">{query.colour && query.flag ? 2 : 1}</span>
        {/if}
      </section>
    </div>
    <div class="Filters {filterOn ? 'active' : ''}">
      <FilterNote />

    </div>

    {#if notebookNotes.type === 'loading'}
      <Loader />
    {:else if items.length}
      <!-- bulk add to outline -->
    <!-- <div class="button">
      <Button disabled={!$selectedItems.size} click={moveNotes}>Move notes to Outline</Button>

    </div> -->

      {#if tuto}
        <KeyboardTuto bind:tuto {from} />
      {/if}
      <div
        class="Notes"
        on:keydown={Tuto}
        style={`grid-template-rows: repeat(${items.length}, max-content);`}
        use:dndzone={{ items, flipDurationMs, dropFromOthersDisabled, dragDisabled: disabled }}
        on:consider={handleDndConsider}
        tabindex="0"
        on:finalize={handleDndFinalize}>
        {#each items as item (item.id)}
          <div
            class="Note"
            id={item.shortId}
            animate:flip={{ duration: flipDurationMs }}
            on:keydown={keyDown}>
            <NoteCardPage note={item} {selection} {selecting} />
            <div
              class="DragZone"
              aria-label="drag-handle"
              on:mousedown={startDrag}
              on:touchstart={startDrag}
              on:mouseup={stopDrag}>
              {#each { length: 6 } as i}
                <span />
              {/each}
            </div>
          </div>
        {/each}
      </div>

    {:else}
      <div class="EmptyOutline">
        <NoNotes />
        <p>Your notebook is empty</p>
      </div>
    {/if}

    
  </section>
  {#if closeColumn}
    <section class="ClosedNotesColumn" on:click={handleClick}>
      <div class="Header">
        <h2>
          <NavNotes />
          Notes
        </h2>
      </div>
    </section>
  {/if}
</div>
