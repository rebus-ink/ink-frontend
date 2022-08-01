<script>
  import Loader from "../../widgets/Loader.svelte";
  import Flags from "./Flags.svelte";
  import Colours from "./Colours.svelte";
  import ListNotebooks from "./ListNotebooks.svelte";
  import ListSources from "./ListSources.svelte";
  import History from "../../widgets/History.svelte";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import { refreshNotes, refreshNotebook, refreshNote, page, tags, note } from "../../../stores";
  import { goto } from "@sapper/app";
  import Highlight from "../Highlight.svelte";
  import NoteEditor from "../../widgets/NoteEditor.svelte";
  import { getToken } from "../../../getToken";
  import Button from "../../widgets/Button.svelte";
  import DeletionModal from "../../widgets/DeletionModal.svelte";
  import striptags from "striptags";

  export let dialog = false;

  let colour,
    highlight,
    comment,
    replaceSource = "",
    selectedFlags = "",
    addNotebook = [],
    text = "",
    removeNotebook = [],
    error = false,
    activeModal = false,
    inNotebook = false,
    pageNumber;

  $: noteTest = $note;
  $: if ($page && $page.query && $page.query.notebook) {
    inNotebook = true;      
  }
  /////////////////// Set colours
  let assignColour = () => {
    colour =
      noteTest.tags
        .filter((tag) => tag.type === "colour")
        .map((tag) => tag.name)
        .toString() || "noColour";
  };

  $: if (error && !highlight && striptags(text)!=="") {
    error = false;
  }

  $: if (!colour && noteTest.tags) assignColour();
  $: if ($page.params.id) if (noteTest.tags) assignColour();

  /////////////////// Set flags
  let assignFlags = () => {
    selectedFlags = [];
    selectedFlags = noteTest.tags
      .filter((tag) => tag.type === "flag")
      .map((tag) => tag.name);
  };

  /////////////////// Set notes
  $: if (noteTest && noteTest.body && noteTest.body.find) {
    highlight = noteTest.body.find(
      (item) => item.motivation === "highlighting"
    );
    comment = noteTest.body.find(
      (item) => item.motivation === "commenting"
    ) || {
      motivation: "commenting",
      content: "",
    };
  }

  function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }
  function updateHighlight(id, colour) {
    document
      .querySelectorAll(`[data-annotation-id="${id}"]`)
      .forEach((node) => {
        node.classList.forEach((token) => {
          if (token.startsWith("Colour")) {
            node.classList.remove(token);
          }
        });
        node.classList.add(colour);
      });
  }

  async function save() {

    try {
      if (!highlight && striptags(text)==="") {
        error = true;
        console.log('error')
      } else {
        const payload = Object.assign({}, noteTest);
        if (payload.source) {
          payload.sourceId = payload.source.shortId;
        }
      payload.tags = [];
      payload._tags = $tags.getIds([colour].concat(selectedFlags));

      if (payload.body.find((body) => body.motivation === "commenting")) {
        const body = payload.body.find(
          (body) => body.motivation === "commenting"
        );
        body.content = text;
        clean(body);
      } else {
        payload.body = payload.body.concat({
          motivation: "commenting",
          content: text,
        });
      }
      if (pageNumber) payload.json = Object.assign({}, payload.json, {pages:pageNumber});

      if (typeof replaceSource === "object")
        payload.sourceId = replaceSource.shortId;
      else if (replaceSource === "remove") {
        payload.sourceId = null;
      }

      if (addNotebook.length)
        payload.notebooks = payload.notebooks.concat(addNotebook);

      if (removeNotebook.length) {
        let iterations = [];
        for (let i = 0; i < removeNotebook.length; i++) {
          payload.notebooks.find((Item, index) => {
            if (Item.shortId === removeNotebook[i].shortId) {
              iterations.push(index);
              iterations.sort((a, b) => b - a);
            }
          });
          for (let h = 0; h < iterations.length; h++) {
            payload.notebooks.splice(iterations[h], 1);
          }
        }
      }

      let id = noteTest.shortId;
      noteTest = "";
      replaceSource = "";
      addNotebook = [];
      removeNotebook = [];
      pageNumber = '';
      await fetch(`/api/note/${id}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        }
      });

      if (inNotebook) {
        if ($page.query.page) goto($page.path);
        $refreshNotebook = { id: $page.params.id, time: Date.now() };
        $refreshNote = { id: noteTest.shortId, time: Date.now() };
      }

      updateHighlight(
        noteTest.id,
        colour.replace("colour", "Colour").replace(" ", "")
      );
      if (inNotebook) {
        goto(`notebooks/${$page.params.id}`);
      } else {
        window.history.back();
      }
      }

    } catch (err) {
      console.error(err);
    }
  }

  async function remove() {

    try {
      await fetch(`/api/note/${noteTest.shortId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
      });
    } catch (err) {
      console.error(err);
    }
    $refreshNotes = Date.now()

    if (inNotebook) {
      goto(`notebooks/${$page.params.id}`);
    } else {
      goto(`notes/all/all/`);
    }
  }

</script>

<style>
  .Item {
    background: #ffffff;
    border-radius: 30px;
    padding: 20px 30px 30px;
    width: calc(100% - 20px);
    margin: 20px 0;
    grid-template-rows: repeat(5, max-content);
    grid-gap: 20px;
    display: grid;
    height: max-content;
    min-height: calc(100vh - 40px);
    -webkit-box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.05);
    box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.05);
  }
  section {
    display: table;
    margin: 0;
  }
  .Top {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    position: relative;
    margin-bottom: 10px;
  }
  .Top::after {
    content: "";
    height: 1px;
    width: calc(100% + 60px);
    position: absolute;
    left: -30px;
    bottom: -10px;
    background: #dddddd;
  }
  .CardBottom {
    text-align: right;
    background: transparent;
    color: #f05657;
  }

  :global(#sapper .Item .ql-toolbar.ql-snow),
  :global(#sapper .Item .ql-container.ql-snow) {
    border: none;
  }
  @media (max-width: 720px) {
    .Item {
      padding: 20px;
      width: calc(100% - 40px);
      margin-left: 20px;
    }
    .Top::after {
      width: calc(100% + 40px);
      left: -20px;
    }
  }
  .dialog {
    position: absolute;
    top: 2rem;
    right: 2.5rem;
  }

  /* -------------- Highlight -------------- */
  .SourceHilight {
    display: grid;
    grid-gap: 10px;
    position: relative;
    width: calc(100% - 16px);
    margin-left: 15px;
  }
  .SourceHilight::before {
    content: "";
    width: 6px;
    height: 100%;
    background: #999999;
    float: left;
    position: absolute;
    top: 0;
    left: -15px;
  }
  .SourceHilight.colour1::before {
    background: #fea95b;
  }
  .SourceHilight.colour2::before {
    background: #ff8ebe;
  }
  .SourceHilight.colour3::before {
    background: #57cfea;
  }
  .SourceHilight.colour4::before {
    background: #81d173;
  }
  .SourceHilight .info {
    display: grid;
    grid-gap: 8px;
  }
  a {
    outline: none;
  }
  .Highlight {
    font-size: 0.75rem;
    line-height: 0.9rem;
    color: #333333;
  }
  .Highlight[href] {
    text-decoration: none;
  }
  .Highlight[href]:hover {
    text-decoration: underline;
  }

  /* ------ Editor ------ */
  .Editor {
    display: block;
    grid-column: 1/-1;
    color: #333;
  }
  :global(.ql-toolbar) {
    padding: 0 !important;
  }
  :global(.ql-toolbar *),
  :global(.ql-toolbar.ql-snow .ql-formats),
  :global(.ql-toolbar) {
    border: none !important;
    margin: 0;
  }
  .Editor :global(button.ql-active) {
    background: var(--workspace-color) !important;
  }
  .Editor :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
    stroke: var(--main-background-color);
  }
  .Editor :global(.ql-snow.ql-toolbar button.ql-active .ql-fill),
  .Editor :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill) {
    fill: var(--main-background-color);
  }
  .Editor
    :global(.ql-snow.ql-toolbar
      button:not(.ql-active):hover
      .ql-stroke.ql-fill),
  .Editor :global(.ql-snow .ql-fill),
  .Editor :global(.ql-snow .ql-stroke.ql-fill),
  .Editor :global(.ql-snow.ql-toolbar button:not(.ql-active):hover .ql-fill) {
    fill: var(--workspace-color);
  }
  .Editor :global(.ql-snow.ql-toolbar button:not(.ql-active):hover .ql-stroke),
  .Editor :global(.ql-snow .ql-stroke) {
    stroke: var(--workspace-color);
  }
  .Editor :global(.Editor.hasFocus .ql-editor) {
    background-color: transparent;
  }
  .Editor :global(#sapper .ql-snow.ql-toolbar button) {
    margin-right: 10px !important;
  }
  .Editor :global(.Editor) {
    background: var(--main-background-color);
    display: grid;
    min-height: 40vh;
    border-radius: 10px 10px 0 0;
    margin-top: 20px;
    overflow: hidden;
  }
  .Editor :global(.Editor) {
    border: 2px solid #999999 !important;
    border-bottom: 0;
  }
  .Editor.colour1 :global(.Editor) {
    border: 2px solid #fea95b !important;
    border-bottom: 0;
  }
  .Editor.colour2 :global(.Editor) {
    border: 2px solid #ff8ebe !important;
    border-bottom: 0;
  }
  .Editor.colour3 :global(.Editor) {
    border: 2px solid #6fe1fa !important;
    border-bottom: 0;
  }
  .Editor.colour4 :global(.Editor) {
    border: 2px solid #9fe793 !important;
    border-bottom: 0;
  }
  .Editor.error :global(.Editor) {
    border: 2px solid red !important;
    border-bottom: 0;
  }
  .Editor :global(.Editor p),
  .Editor :global(.Editor span) {
    background: transparent !important;
  }
  .deletion {
    color: #f05657;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    display: grid;
    grid-template-rows: max-content max-content;
    gap: 5px;
    text-align: center;
  }
  .deletion :global(svg) {
    margin: 0 auto;
  }
  .error-message {
    color: red;
  }
  .page-input {
    width: 80px;
  }
</style>

<div class="Item">
  {#if noteTest.shortId}
    <div class="Top">
      {#if !dialog}
        <History />
        <span />
        <div class="CardBottom">
          {#if noteTest.updated && noteTest.published}
            <!--
            <DateFormat
              updated={noteTest.updated}
              published={noteTest.published} />-->
            <span
              class="deletion"
              on:click={() => {
                activeModal = true;
              }}>
              <IcoDelete />
              Delete
            </span>
          {/if}
        </div>
      {/if}
    </div>
    <ListNotebooks {noteTest} bind:addNotebook bind:removeNotebook />

    {#if highlight}
      <div class="SourceHilight {colour}">
        <ListSources {highlight} {noteTest} bind:replaceSource />
        <div class="info">
          <a class="Highlight" href="target{noteTest.document}">
            <Highlight body={highlight} edit={true} {colour} />
          </a>
        </div>
      </div>
    {:else}
      <ListSources {highlight} {noteTest} bind:replaceSource />
    {/if}
    <section>
      <Colours bind:colour />

      {#if comment.content}
        <div class="Editor {error ? "error" : colour}">
          <NoteEditor html={comment.content} bind:richtext={text} />
        </div>
      {:else}
        <div class="Editor {error ? "error" : colour}">
          <NoteEditor html="" bind:richtext={text} />
        </div>
      {/if}
      <Flags {colour} {error} {assignFlags} {noteTest} bind:selectedFlags />
      {#if error}
      <br/>
      <div class="error-message">note cannot be empty</div>
      {/if}
      {#if noteTest && noteTest.json}
      pages: <input type="text" class="page-input" bind:value={noteTest.json.pages} placeholder="page(s)" />
      {:else}
      pages: <input type="text" class="page-input" bind:value={pageNumber} placeholder="page(s)" />
      {/if}
    </section>
    <span class:dialog>
      <Button click={save}>Save</Button>
    </span>
  {:else}
    <Loader />
  {/if}
</div>
{#if activeModal}
  <DeletionModal {remove} bind:activeModal type="note" items={[noteTest]} />
{/if}
