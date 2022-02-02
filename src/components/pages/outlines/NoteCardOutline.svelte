<script>
  import FlagFurtherRead from "../../img/FlagFurtherRead.svelte";
  import FlagIdea from "../../img/FlagIdea.svelte";
  import FlagImportant from "../../img/FlagImportant.svelte";
  import FlagImpTerm from "../../img/FlagImpTerm.svelte";
  import FlagQuestion from "../../img/FlagQuestion.svelte";
  import FlagReference from "../../img/FlagReference.svelte";
  import FlagRevisit from "../../img/FlagRevisit.svelte";
  import FlagToDo from "../../img/FlagToDo.svelte";
  import FlagUrgent from "../../img/FlagUrgent.svelte";
  import NavSource from "../../img/NavSource.svelte";
  import { page, refreshOutline, outlineNotesList } from "../../../stores";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import { getToken } from "../../../getToken";
  import NoteEditor from "../../widgets/NoteEditor.svelte";
  export let item;
  export let editing = false;
  export let requesting = false;
  import SmallLoader from "../../widgets/SmallLoader.svelte"
  let pageNumber;
  $: note = item;
  let noteEditions;
  $: if (editing === item.shortId && !noteEditions) {
    noteEditions = item.body.map(item => item.content);
    noteEditions = item.body.sort((a,b) => {
      return a.motivation !== 'highlighting'
    });
    if (noteEditions.length === 1 && noteEditions[0].motivation === 'highlighting') {
      noteEditions.push({content: '', motivation: 'commenting'})
    }
  }


  function assignIco(icon) {
    switch (icon) {
      case "further reading":
        return FlagFurtherRead;
      case "idea":
        return FlagIdea;
      case "important":
        return FlagImportant;
      case "important term":
        return FlagImpTerm;
      case "question":
        return FlagQuestion;
      case "reference":
        return FlagReference;
      case "revisit":
        return FlagRevisit;
      case "to do":
        return FlagToDo;
      case "urgent":
        return FlagUrgent;
    }
  }

  let noted, highlighed;
  $: colour = note.tags.find((colour) => colour.type === "colour") || "";

  $: if (note && note.body && note.body[0]) {
    noted = note.body.find((item) => item.motivation === "commenting");
    highlighed = note.body.find((item) => item.motivation === "highlighting");
  }

  $: params = $page.query;
  $: noteColour =
    params.styleColour &&
    ((!Array.isArray(params["styleColour"]) &&
      params["styleColour"] === colour.name) ||
      (Array.isArray(params["styleColour"]) &&
        params["styleColour"].find((item) => item === colour.name)))
      ? "NoColour"
      : colour.name;

  let Cancel = () => {
    editing = false;
  };

  let UpdateOutlineNote = (note) => {
    let list = $outlineNotesList;
    list = list.map(item => {
      if (item.shortId === note.shortId) {
        return Object.assign({}, item, note, {display: 'pending'});
      } else {
        return item;
      }
    })
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
        $refreshOutline = { id: $page.params.outlineId, time: Date.now() };
      }, 3000)

    }
    
  }

  let Save = async () => {
    requesting = true;
    // const payload = Object.assign({}, { body: item.body });
    // payload.body = noteEditions.map((editedNote, i) => {

    //   payload.body[i].content = editedNote.content;
    //   return Object.assign(payload.body[i], { content: editedNote.content })
    // })

    // payload["shortId"] = item.shortId;

    // update the local list of outline notes
    if (pageNumber) {
      item.json = Object.assign({}, item.json, {pages: pageNumber})
      note.json = Object.assign({}, note.json, {pages: pageNumber})
    }
    UpdateOutlineNote(note)

    try {
      fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}/notes`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(item),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          },
        }
      ).then(async (res) => {
        await handleResponse(res.status, note)
      });
     // $refreshOutline = { id: $page.params.outlineId, time: Date.now() };
      requesting = false;
      editing = false;
    } catch (err) {
      console.error(err);
    }
  };

  let Delete = async () => {
    requesting = true;
    try {
      await fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}/notes`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ shortId: item.shortId }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          },
        }
      );
      $refreshOutline = { id: $page.params.outlineId, time: Date.now() };
      requesting = false;
      editing = false;
    } catch (err) {
      console.error(err);
    }
  };
</script>

<style>
  .Item {
    background: #ffffff;
    border-radius: 20px;
    padding: 16px 40px 16px 16px;
    display: grid;
    gap: 10px;
    grid-template-rows: max-content;
    position: relative;
  }
  .Item.OutlineEdit {
    padding: 16px;
  }
  .Item:not(.OutlineEdit) {
    cursor: pointer;
  }
  .Item.two {
    grid-template-rows: repeat(2, max-content);
  }
  .Item * {
    margin: 0;
    font-weight: 500;
  }
  /* -------------- Highlight -------------- */
  header {
    display: grid;
    grid-template-columns: 4px 1fr;
    grid-gap: 8px;
  }
  header .info {
    display: grid;
    grid-gap: 4px;
  }
  .Page {
    font-size: 0.6rem;
    float: left;
    width: max-content;
    padding: 0 8px;
    border-radius: 5px;
    align-items: center;
    display: flex;
    color: #ffffff;
  }
  .Source {
    display: grid;
    align-items: center;
    grid-template-columns: 10px 1fr;
    grid-gap: 5px;
  }
  .Source :global(svg) {
    width: 10px;
    height: auto;
    color: var(--workspace-color);
  }
  .Source p {
    font-size: 0.7rem;
    font-weight: 400;
    color: #333333;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .highlighting {
    padding: 5px;
    margin-right: 20px;
    border-radius: 5px;
    background-color: white;
  }

  /* -------------- Note -------------- */
  .Note,
  .Highlight {
    font-size: 0.75rem;
    line-height: 0.9rem;
    margin: 0;
    color: #333333;
  }
  /* ------------ No colour ------------ */
  .Item header .column {
    background: #ffffff;
  }
  /* ------------ Colour 1 ------------ */
  .colour1 {
    background: #fcefe7;
  }

  .colour1 header .column,
  .colour1 .OutlineEdit .column,
  .colour1 .OutlineFlags li,
  .colour1 ~ .Cancel:hover,
  .colour1 ~ .Cancel::before,
  .colour1 ~ .Cancel::after,
  .colour1 ~ footer button.Save {
    background: #d86801;
  }

  .colour1 .highlighting {
    border: #d86801 solid;
  }

  /* ------------ Colour 2 ------------ */
  .colour2 {
    background: #faebf4;
  }
  .colour2 header .column,
  .colour2 .OutlineFlags li,
  .colour2 ~ .Cancel:hover,
  .colour2 ~ .Cancel::before,
  .colour2 ~ .Cancel::after,
  .colour2 ~ footer button.Save {
    background: #c0004e;
  }

  .colour2 .highlighting {
    border: #c0004e solid;
  }

  /* ------------ Colour 3 ------------ */
  .colour3 {
    background: #e2f7fb;
  }
  .colour3 header .column,
  .colour3 .OutlineFlags li,
  .colour3 ~ .Cancel:hover,
  .colour3 ~ .Cancel::before,
  .colour3 ~ .Cancel::after,
  .colour3 ~ footer button.Save {
    background: #0693b2;
  }
  .colour3 .highlighting {
    border: #0693b2 solid;
  }

  /* ------------ Colour 4 ------------ */
  .colour4 {
    background: #e7f3e3;
  }
  .colour4 header .column,
  .colour4 .OutlineFlags li,
  .colour4 ~ .Cancel:hover,
  .colour4 ~ .Cancel::before,
  .colour4 ~ .Cancel::after,
  .colour4 ~ footer button.Save {
    background: #589b4c;
  }

  .colour4 .highlighting {
    border: #589b4c solid;
  }

  /* ------------ No colour ------------ */
  .NoColour {
    background: transparent;
  }
  .NoColour header .column,
  .NoColour .OutlineFlags li {
    background: #888888;
  }
  .NoColour .highlighting {
    border: #888888 solid;
  }

  .OutlineFlags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    list-style: none;
    gap: 5px;
  }
  .OutlineFlags li {
    border-radius: 15px;
    color: #fff;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 5px;
    align-items: center;
    padding: 2px 10px;
  }
  .OutlineFlags li p {
    font-size: 0.75rem;
  }
  .Item .Note :global(*),
  .Item .Highlight :global(*) {
    font-size: 0.75rem;
    line-height: 0.9rem;
    margin: 0;
    font-weight: 400;
    color: #333 !important;
    background: transparent !important;
  }
  .Item .Note :global(strong),
  .Item .Highlight :global(strong) {
    font-weight: 700;
  }
  .Cancel {
    border: 1px solid var(--workspace-color);
    border-radius: 50%;
    position: absolute;
    top: 15px;
    right: 15px;
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
  .colour1 ~ .Cancel {
    border: 1px solid #d86801;
  }
  .colour2 ~ .Cancel {
    border: 1px solid #c0004e;
  }
  .colour3 ~ .Cancel {
    border: 1px solid #0693b2;
  }
  .colour4 ~ .Cancel {
    border: 1px solid #589b4c;
  }
  .Cancel:hover {
    background: var(--workspace-color);
  }
  .Cancel::before,
  .Cancel::after {
    content: "";
    width: 50%;
    height: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    transition: all 0.25s ease-out;
    background: var(--workspace-color);
  }
  .Cancel::after {
    height: 50%;
    width: 2px;
  }
  .Cancel:hover::before,
  .Cancel:hover::after {
    background: var(--main-background-color);
  }
  footer {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }
  button.Save {
    background: var(--action);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    height: 34px;
    font-weight: 500;
    padding: 0 25px;
    cursor: pointer;
  }
  button.Delete {
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    width: 34px;
    height: 34px;
    position: relative;
    cursor: pointer;
    padding: 0;
    transition: all 0.25s ease-out;
  }
  button.Delete:hover {
    background: rgba(239, 86, 87, 0.1);
    border: 1px solid #f05657;
  }
  button.Delete :global(svg) {
    color: #f05657;
    height: 60%;
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .OutlineEdit :global(.Editor.hasFocus) {
    background: transparent;
  }
  .OutlineEdit :global(.Editor .ql-editor) {
    padding: 12px 2px;
    background: transparent;
  }
  .OutlineEdit :global(*) {
    font-size: 0.75rem;
    line-height: 0.9rem;
  }
  .loader {
    float:left;
  }
  .pages {
    text-align: right;
    font-size: 0.7rem;
  }
  .page-input {
    width: 80px;
    float: right;
  }
  .page-input-section {
    text-align: right;
  }
</style>

{#if editing === item.shortId}
  <div class="Item OutlineEdit {noteColour}">
    {#if noteEditions}
    {#each noteEditions as edition}
    <div class={edition.motivation}>
    <NoteEditor bind:richtext={edition.content} html={edition.content} />
  </div>
    {/each}
    {/if}
    <div class="page-input-section">

    {#if note && note.json && note.json.pages}
    page(s): <input type="text" class="page-input" bind:value={note.json.pages} />
    {:else}
    pages(s): <input type="text" class="page-input" bind:value={pageNumber} />
    {/if}
  </div>

  </div>
  <button class="Cancel" on:click={Cancel} />
  <footer>
    <button class="Delete" on:click={Delete}>
      <IcoDelete />
    </button>
    <button class="Save" on:click={Save}>Save</button>
  </footer>
{:else}
  <div
    on:click={() => {
      editing = item.shortId;
    }}
    class="Item {noteColour}
    {noted && (highlighed || note.source) ? 'two' : ''}">
    {#if note.display === 'pending'}
    <div class="loader"><SmallLoader /></div>
    {/if}
    {#if note.display === 'error'}
    ERROR!!!
    {/if}
    {#if highlighed || note.source}
      <header>
        <div class="column" />
        <div class="info">
          {#if highlighed && highlighed.content && (!params['styles'] || (!Array.isArray(params['styles']) && params['styles'] !== 'highlight') || (Array.isArray(params['styles']) && !params['styles'].find((item) => item === 'highlight')))}
            <p class="Highlight {noted && noted.content ? '' : 'noNote'}">
              {@html highlighed.content}
            </p>
          {/if}
          {#if note.source && note.source.name}
            <div class="Source">
              <NavSource />
              <p>{note.source.name}</p>
            </div>
          {/if}
        </div>
      </header>
    {/if}
    {#if noted && (!params['styles'] || (!Array.isArray(params['styles']) && params['styles'] !== 'note') || (Array.isArray(params['styles']) && !params['styles'].find((item) => item === 'note')))}
      <p class="Note">
        {@html noted.content}
      </p>
    {/if}
    {#if note && note.json && note.json.pages}
    <div class="pages">p.{note.json.pages}</div>
    {/if}

    <ul class="OutlineFlags">
      {#each note.tags as flag}
        {#if flag.type === 'flag'}
          <li>
            <svelte:component this={assignIco(flag.name)} />
            <p>{flag.name}</p>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
{/if}
