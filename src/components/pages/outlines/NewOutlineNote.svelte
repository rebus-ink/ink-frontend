<script>
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import NoteEditor from "../../widgets/NoteEditor.svelte";
  import { outline, outlineNotesList, page, refreshOutline } from "../../../stores";
  import { getToken } from "../../../getToken";

  export let type;
  export let addNewNote;
  export let disabled;
  const flipDurationMs = 300;
  const dropFromOthersDisabled = true;
  let isDragging = false;

  let handleSort = (e) => {
    items = e.detail.items;
    isDragging = true;
    disabled = false;
  };

  let handleDrop = (e) => {
    // if dropped outside of the outline, note will not disappear
    if (e.detail.info.trigger === "droppedIntoAnother") {
      addNewNote = items.length ? true : false;
    }
    items = e.detail.items;
    isDragging = false;
  };

  let Cancel = () => {
    addNewNote = false;
  };

  $: text = "";
  $: items = [
    {
      body: [
        {
          motivation: "commenting",
          language: null,
          content: text,
        },
      ],
      id: "12345",
      shortId: "12345",
      fresh: true,
      json: {
        type: type,
      },
    },
  ];

  let onKeyPress = (e) => {
    if (e.charCode === 13) {
      addNoteToEnd({
        body: [
          {
            motivation: "commenting",
            content: text
          }
        ],
        json: {
          type: type
        }
      })
      addNewNote = false;

    }
  }

  function randomString() {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 8; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
   }
   return result.join('');
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

  function addNoteToEndOfOutline(note) {
    let list = $outlineNotesList;

    let lastItem = list.find(item => {
      return !item.next;
    })
    note.previous = lastItem.shortId;

    // add the note
    list.push(note)

    // edit the lastItem to have a next
    list = list.map(item => {
      if (item.shortId === lastItem.shortId) {
        item.next = note.shortId;
      }
      return item;
    })

    $outlineNotesList = list;
    return note;
  }

  export async function addNoteToEnd(note) {
    
    // format the note
    const index = $outline.readerId.indexOf('/readers/');
    const readerShortId = $outline.readerId.substring(index + 9);
    note.shortId = `${readerShortId}-${randomString()}`
    note.id = note.shortId;
    note.display = 'pending';
    note.contextId = $outline.shortId;
    note.fresh= true;

    note = addNoteToEndOfOutline(note)

    try {
       window.fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}/notes`,
        {
          method: 'POST',
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
    } catch (err) {
      console.error(err);
    }
  }

</script>

<style>
  .NewNoteForm * {
    box-sizing: border-box;
  }
  .NewNoteForm {
    background: var(--all-workspace);
    z-index: 5;
    margin: 0 auto;
    display: grid;
    gap: 10px;
    grid-template-columns: 350px 20px;
    padding: 15px;
    position: absolute;
    left: 0;
    top: 0;
    align-items: end;
    border-radius: 20px;
    border-top-left-radius: 5px;
    transition: all 0.2s ease-out;
    transform: translateX(52px);
  }
  .NewHeader ~ :global(.ql-toolbar.ql-snow),
  .NewHeader ~ :global(.Editor.ql-container.ql-snow) {
    display: none;
  }
  /* ------ Editor ------ */
  .NewNoteForm :global(.ql-toolbar) {
    padding: 0 !important;
    text-align: left;
  }
  .NewNoteForm :global(.ql-toolbar *),
  .NewNoteForm :global(.ql-toolbar.ql-snow .ql-formats),
  .NewNoteForm :global(.ql-toolbar) {
    border: none !important;
    margin: 0;
  }
  .NewNoteForm :global(#sapper button.ql-active) {
    background: var(--main-background-color);
  }
  .NewNoteForm :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
    stroke: var(--workspace-color);
  }
  .NewNoteForm :global(.ql-snow.ql-toolbar button.ql-active .ql-fill),
  .NewNoteForm
    :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill) {
    fill: var(--workspace-color);
  }
  .NewNoteForm
    :global(.ql-snow.ql-toolbar
      button:not(.ql-active):hover
      .ql-stroke.ql-fill),
  .NewNoteForm :global(.ql-snow .ql-fill),
  .NewNoteForm :global(.ql-snow .ql-stroke.ql-fill),
  .NewNoteForm
    :global(.ql-snow.ql-toolbar button:not(.ql-active):hover .ql-fill) {
    fill: var(--main-background-color);
  }
  .NewNoteForm
    :global(.ql-snow.ql-toolbar button:not(.ql-active):hover .ql-stroke),
  .NewNoteForm :global(.ql-snow .ql-stroke) {
    stroke: var(--main-background-color);
  }
  .NewNoteForm :global(.Editor.hasFocus.svelte-27mrhh .ql-editor) {
    background-color: transparent;
  }
  .NewNoteForm :global(#sapper .ql-snow.ql-toolbar button) {
    margin-right: 10px !important;
  }
  .NewNoteForm :global(.Editor) {
    background: var(--main-background-color);
    overflow: hidden;
    overflow-y: scroll;
    height: 150px;
    max-height: 230px;
    display: grid;
    border-radius: 10px;
    margin-top: 10px;
  }
  .NewNoteForm :global(.Editor p),
  .NewNoteForm :global(.Editor span) {
    background: transparent !important;
  }
  /* ------ Drag & Drop ------ */
  .DragEle {
    height: calc(100% - 20px);
    display: grid;
    align-items: center;
    position: relative;
    order: 2;
  }
  .DragEle.unDraggable ~ .NewNote {
    display: none;
  }
  .DragEle div.DragZone {
    display: grid;
    gap: 4px;
    width: max-content;
    margin: 0 auto;
    grid-template-columns: repeat(2, 5px);
  }
  .DragEle div.DragZone span {
    background: #ffffff;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-bottom: 4px;
  }
  .NewNote {
    border-radius: 10px;
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    display: grid;
    align-items: center;
    gap: 15px;
    align-items: center;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
  }
  .NewNote .Card {
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    float: right;
    text-align: left;
  }
  .NewNote:active .Card,
  .NewNote .Card:active {
    background: #ffffff !important;
    overflow: hidden;
    width: 300px;
    opacity: 1;
    border-radius: 10px;
  }
  .NewNote .Card :global(*) {
    margin: 0;
    padding: 10px;
    color: #333333;
  }
  .NewNote:active .Card.header,
  .NewNote .Card.header:active {
    max-height: 60px;
  }
  .NewNote .Card.header :global(*) {
    font-size: 180%;
    font-weight: 400;
  }
  .NewNote:active .Card.note,
  .NewNote .Card.note:active {
    max-height: 200px;
  }
  .NewNote .Card.note :global(*) {
    font-size: 0.75rem;
    font-weight: 500;
  }
  .NewHeader {
    width: 100%;
    border-radius: 15px;
    height: 60px;
    border: none;
    margin-bottom: 10px;
    color: var(--workspace-color);
    font-size: 180%;
    padding: 0 20px;
  }
  .NewNoteForm.isDragging,
  .NewNote:active ~ :global(*:not(.DragEle)),
  .Hidding {
    display: none;
  }
  .NewNote:active ~ .DragEle {
    position: relative;
    right: 0;
    top: 0;
  }
  .DragEle:active ~ .Content {
    opacity: 0.1;
  }
  .CancelBtn {
    border: 1px solid var(--main-background-color);
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    /* Never assume that the default padding is always going to be zero, either
     use a reset stylesheet or always reset it in your styles */
    padding: 0;
    cursor: pointer;
    transform: rotate(45deg);
    background: none;
    transition: all 0.25s ease-out;
  }
  .CancelBtn:hover {
    background: var(--main-background-color);
  }
  .CancelBtn::before,
  .CancelBtn::after {
    content: "";
    width: 50%;
    height: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    transition: all 0.25s ease-out;
    background: var(--main-background-color);
  }
  .CancelBtn::after {
    height: 50%;
    width: 2px;
  }
  .CancelBtn:hover::before,
  .CancelBtn:hover::after {
    background: var(--workspace-color);
  }
  .Counter {
    color: #ffffff;
    font-size: 0.9rem;
    opacity: 0.6;
    margin: 20px 0 0;
    float: left;
    font-style: italic;
    width: 100%;
    text-align: left;
  }
</style>

<main class="NewNoteForm" class:isDragging>
  <div class="DragEle">
    <section
      class="NewNote {text ? '' : 'Hidding'}"
      use:dndzone={{ items, flipDurationMs, dropFromOthersDisabled }}
      on:consider={handleSort}
      on:finalize={handleDrop}>
      {#each items as item (item.id)}
        <div class="Card {type}" animate:flip={{ duration: flipDurationMs }}>
          {#if type === 'header'}
            <h4>{text}</h4>
          {:else}
            {@html text}
          {/if}
        </div>
      {/each}
    </section>
    <div class="DragZone">
      {#each { length: 6 } as i}
        <span />
      {/each}
    </div>
  </div>
  <div class="Content">
    {#if type === 'header'}
      <input type="text" maxlength="100" on:keypress={onKeyPress} class="NewHeader" bind:value={text} />
      <p class="Counter">
        {text ? 100 - text.length : 100} character{text && text.length === 99 ? '' : 's'}
        left
      </p>
    {:else}
      <NoteEditor bind:richtext={text} {addNoteToEnd} />
    {/if}
  </div>
  <button class="CancelBtn" on:click={Cancel} />
</main>
