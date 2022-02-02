<script>
  //https://github.com/isaacHagoel/svelte-dnd-action
  import NoNotes from "../../img/NoNotes.svelte";
  import NoteCardOutline from "./NoteCardOutline.svelte";
  import NewHeaderCard from "./NewHeaderCard.svelte";
  import NewNoteCard from "./NewNoteCard.svelte";
  import OutlineHeader from "./OutlineHeader.svelte";
  import Loader from "../../widgets/Loader.svelte";
  import KeyboardTuto from "./KeyboardTuto.svelte";
  import { getToken } from "../../../getToken";
  import { flip } from "svelte/animate";
  import {
    dndzone,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from "svelte-dnd-action";
  import { fade } from "svelte/transition"; // fade in works, but fade-out is a known issue
  import { cubicIn } from "svelte/easing";
  import { pageItem, page, outline, 
    refreshOutline, outlineNotesList } from "../../../stores";
  export let items;
  export let requesting;
  export let outlineInfo;
  export let filters;
  export let keyboardNote;
  export let disabled;
  $: params = $page.query;
  let editing = false;
  const flipDurationMs = 300;
  let dropTargetStyle;

  function handleSort(e) {
    items = e.detail.items;
    dropTargetStyle = {
      background: "rgba(241, 245, 248, 1)",
    };
  }

  function handleDrop(e) {
    handleSort(e, 'test');
    arrangement(e);
  }

  function randomString() {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 8; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
   }
   return result.join('');
  }

  // OUTLINE STUFF
  
  function addNoteToOutline (note) {
    let list = $outlineNotesList;
    if (note.previous) {
      list = list.map(item => {
        if (item.shortId === note.previous) {
          item.next = note.shortId;
        }
        return item;
      })
    }
    if (note.next) {
      list = list.map(item => {
        if (item.shortId === note.next) {
          item.previous = note.shortId;
        }
        return item;
      })
    }
    list.push(note)
    $outlineNotesList = list;
  }

  function moveNoteInOutline (note) {
      let list = $outlineNotesList;
      note.id = note.shortId; // why?
      // adjusting notes that were 'previous' or 'next' before
      const oldNote = list.find(item => {
        return item.shortId === note.shortId;
      })
      if (oldNote.previous) {
        list = list.map(item => {
          if (item.shortId === oldNote.previous) {
            item.next = oldNote.next;
          }
          return item;
        })
      }
      if (oldNote.next) {
        list = list.map(item => {
          if (item.shortId === oldNote.next) {
            item.previous = oldNote.previous;
          }
          return item;
        })
      }

      // replacing the note with the new one
      list = list.map(item => {
        if (item.shortId === note.shortId) {
           return note;
        } else {
          return item;
        }
      })

      // adjusting the new 'next' and 'previous'
      if (note.previous) {
        list = list.map(item => {
          if (item.shortId === note.previous) {
            item.next = note.shortId;
          }
          return item;
        })
      }
      if (note.next) {
        list = list.map(item => {
          if (item.shortId === note.next) {
            item.previous = note.shortId;
          }
          return item;
        })
      }
      
      $outlineNotesList = list;
  }

  async function handleResponse(status, note) {
    let list = $outlineNotesList;
    if (status === 201 || status === 200) {
      list = list.map(item => {
        if (item.shortId === note.shortId) {
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

  // END OUTLINE STUFF

  async function addNote(note, request) {
    if (request === 'POST') {
      note.oldId = note.shortId === '12345' ? null : note.shortId
      const index = $outline.readerId.indexOf('/readers/');
      const readerShortId = $outline.readerId.substring(index + 9);
      note.shortId = `${readerShortId}-${randomString()}`
      note.id = note.shortId; // not sure why necessary?
      note.display = 'pending';
      note.contextId = $outline.shortId;
      addNoteToOutline(note)

    } else {
      note.display = 'pending'
      moveNoteInOutline(note)

    }
    requesting = true;
    try {
       window.fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}/notes`,
        {
          method: request,
          credentials: "include",
          body: JSON.stringify(note),
          headers: {
            "Content-Type": "application/json",
            "csrf-token": getToken(),
          },
        }
      ).then(async (res) => {
        await handleResponse(res.status, note)
      })
      requesting = false;
    } catch (err) {
      console.error(err);
    }
  }

  function arrangement(e) {
    disabled = true;
    let id = e.detail.info.id;
    let index;
    for (let i = 0; i < items.length; i++) {
      if (id === items[i].id) index = i;
    }
    const request = items[index]["contextId"] ? "PATCH" : "POST";

    let note = {
      shortId: items[index].shortId,
      fresh: items[index].fresh,
      body: items[index].body,
      json: items[index].json,
      tags: items[index].tags,
      contextId: items[index].contextId,
      source: items[index].source
    };
    if (note.fresh) {
      note["body"] = items[index].body;
      note["json"] = items[index].json;
    }

    if (request === "PATCH") {
      note["next"] = null;
      note["previous"] = null;
    }

    if (index === 0) {
      if (items.length > 1) note["next"] = items[index + 1].shortId;
    } else {
      note["previous"] = items[index - 1].shortId;
      if (items.length > index + 1) note["next"] = items[index + 1].shortId;
    }

    if (request === "PATCH" && !note.next && !note.previous) return;
    addNote(note, request);
  }

  let assignComp = (item) => {
    if (item.json && item.json.type === "header") return NewHeaderCard;
    else if (item.json && item.json.type === "note") return NewNoteCard;
    else return NoteCardOutline;
  };

  let noteFocus, note;
  let keyDown = (e) => {
    if (editing) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      noteFocus = e.target.id;
      for (let i = 0; i < items.length; i++) {
        if (items[i].shortId === noteFocus) {
          note = i;
          break;
        }
      }

      if (e.key === "ArrowUp" && note === 0) return;
      if (e.key === "ArrowDown" && !items[note + 1]) return;

      let x = e.key === "ArrowUp" ? -1 : 1;
      let current = items[note];
      let newPos = items[note + x];
      items[note + x] = current;
      items[note] = newPos;

      setTimeout(() => {
        document.getElementById(noteFocus).focus();
      }, 50);
    } else if (e.key === "ArrowLeft" && note >= 0 && noteFocus) {
      let index;
      for (let i = 0; i < items.length; i++) {
        if (items[i].shortId === noteFocus) {
          index = i;
          break;
        }
      }
      note = false;
      noteFocus = false;
      arrangement({ detail: { info: { id: items[index].id } } });
    }
  };

  let tuto, timer;
  let Tuto = (e) => {
    if (editing) return;
    if (e.key === "Tab") {
      tuto = true;
      clearTimeout(timer);

      timer = setTimeout(() => {
        tuto = false;
      }, 2500);
    }
  };

  $: if (keyboardNote) {
    noteFocus = keyboardNote.shortId;
    items.unshift(keyboardNote);
    items = items;
    keyboardNote = false;
    setTimeout(() => {
      note = 0;
      document.getElementsByClassName("ItemsList")[0].firstElementChild.focus();
    }, 50);
  }

  let startDrag = () => {
    disabled = false;
  };
  let stopDrag = () => {
    disabled = true;
  };
</script>

<style>
  .Workarea {
    padding: 30px;
    display: grid;
    gap: 30px;
    position: relative;
    grid-template-rows: max-content max-content;
  }
  * {
    box-sizing: border-box;
  }
  ul.ItemsList {
    min-height: calc(90vh - 100px);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 70%;
    padding: 5%;
    border-radius: 30px;
    transform: translateX(40px);
    list-style-type: none;
    counter-reset: items;
    grid-template-rows: inherit;
  }
  li.Item {
    position: relative;
    margin-bottom: 20px;
  }
  li.Hide {
    display: none;
  }
  li.header:not(.Hide) + li {
    counter-reset: items;
  }
  li:not(.header)::before {
    color: var(--workspace-color);
    font-size: 0.9rem;
    font-weight: 500;
    counter-increment: items;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(calc(-100% - 7px));
  }
  ul.ItemsList.alpha li:not(.header)::before {
    content: counter(items, upper-alpha) ". ";
  }
  ul.ItemsList.roman li:not(.header)::before {
    content: counter(items, upper-roman) ". ";
  }
  ul.ItemsList.decimal li:not(.header)::before {
    content: counter(items, decimal) ". ";
  }
  ul.ItemsList.bPoint li:not(.header)::before {
    content: counter(items, disc);
    font-size: 2rem;
    line-height: 1.5rem;
  }
  .custom-shadow-item {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    visibility: visible;
    opacity: 0.5;
    margin: 0;
  }
  :global(.custom-shadow-item:first-child) {
    background: blue;
  }
  .hi {
    animation: fadeIn 900ms ease;
  }
  .bye {
    animation: fadeOut 900ms ease;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .EmptyOutline {
    position: absolute;
    left: calc(50% + 40px);
    top: 50%;
    display: grid;
    gap: 20px;
    transform: translate(-50%, -50%);
  }
  .EmptyOutline div {
    display: grid;
    text-align: center;
  }
  .EmptyOutline p {
    font-size: 0.9rem;
    color: var(--action);
    font-weight: 600;
    margin: 0;
    opacity: 0.5;
  }
  li.Item.header {
    transform: translateX(-20px);
    width: calc(100% + 20px);
  }
  .noteFocus {
    transform: translateX(40px);
    box-shadow: 2px 2px 10px 0 rgba(184, 209, 236, 0.1);
  }
  div.DragZone {
    position: absolute;
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
  li.Item.header div.DragZone {
    top: 1px;
  }
</style>

<div class="Workarea">
  <OutlineHeader {outlineInfo} notebook={$pageItem.notebook} />
  {#if requesting || items === 'loading'}
    <ul class="ItemsList">
      <Loader />
    </ul>
  {:else}
    {#if tuto}
      <KeyboardTuto bind:tuto from="outline" />
    {/if}
    <ul
      on:keydown={Tuto}
      class={`ItemsList ${filters.list ? filters.list : ''}`}
      use:dndzone={{ items, flipDurationMs, dragDisabled: disabled, dropFromOthersDisabled: disabled, dropTargetStyle }}
      on:consider={handleSort}
      on:finalize={handleDrop}>
      {#each items as item (item.shortId)}
        <li
          on:keydown={keyDown}
          id={item.shortId}
          tabindex="0"
          class="Item {item.json ? item.json.type : ''}"
          class:noteFocus={noteFocus === item.shortId}
          class:Hide={(item.json && filters.type.some((type) => type === item.json.type)) || (!item.json && item.tags.some((item) => filters.colour.includes(item.name) || filters.flags.includes(item.name)))}
          animate:flip={{ duration: flipDurationMs }}>
          {#if (item.json && !filters.type.some((type) => type === item.json.type)) || (!item.json && !item.tags.some((item) => filters.colour.includes(item.name) || filters.flags.includes(item.name)))}
            <svelte:component
              this={assignComp(item)}
              {item}
              bind:editing
              bind:requesting />
            {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME] && !editing}
              <div
                in:fade={{ duration: 200, easing: cubicIn }}
                class="custom-shadow-item {item.isByeBye ? 'bye' : item.isHi ? 'hi' : ''}">
                <svelte:component this={assignComp(item)} {item} />
              </div>
            {/if}
          {/if}
          {#if !editing}
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
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
  {#if !items.length}
    <div class="EmptyOutline">
      <NoNotes />
      <div>
        <p>Your outline is empty</p>
        <p>Drop some notes</p>
      </div>
    </div>
  {/if}
</div>
