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
    import IcoNotebook from "../../img/IcoNotebook.svelte"
    import CloseIcon from "../../source/source-highlight/CloseIcon.svelte"
    import Closer from "../../widgets/Closer.svelte";
    import WhiteButton from "../../widgets/WhiteButton.svelte";
    import TabsSection from "../../addItems/TabsSection.svelte"
    import FileInput from "../../addItems/FileInput.svelte"
    import { send, receive } from "../../../routes/_crossfade.js";
    import { tick } from "svelte";
    import NoteEditor from "../../widgets/NoteEditor.svelte";
    import { getToken } from "../../../getToken"
    import { refreshNotes, refreshPublication, refreshSourceNotes, tags, defaultNotebook, notebooks } from "../../../stores";
    //import { tags$ } from "../../../../state/tags.ts";

    import { stores } from "@sapper/app";
    import striptags from "striptags";

    const { page } = stores();
    export let note = { body: [], source: { name: "" } };
    export let source;
    export let pages = true;
    let itemState = "new"
    $: console.log(pages)
    let selectedFlags = [];
    let selectedNotebooks = [];
    let pageNumber;
    let error = false;
    $: if (error && striptags(text) !== "") {
      error = false;
    }
    let noteBookMenu;
    let colour;
    let useDefault = true;
    let notebooksList;
    $: notebooksList = $notebooks ? $notebooks.items : [];
    $: if($notebooks) {
      notebooksList.unshift({name: ''})
    }
    
    const colours = ["colour1", "colour2", "colour3", "colour4"];
    let flags = []
    $: if($tags.items) {
      flags = $tags.items.filter(tag => tag.type === 'flag').map(tag => tag.name)
      flags.unshift('')
    }

    function menu(state) {
      if (state) itemState = state;
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
    export let ntbkClose;
    let newToggle;
    let noteColour = "colour1";
    let open = false;

    function click() {
      open = !open;
      noteColour = noteColour = "colour1";
    }

    async function createNotebook() {
      console.log('$$$$$$$$', $notebooks, notebooksList)
    }

    function change(e) {
      const index = selectedNotebooks.findIndex(x => x.name === e.target.value)
      if (index === -1) {
        let filterResults = notebooksList.filter(notebook => notebook.name === e.target.value)
        selectedNotebooks = selectedNotebooks.concat(filterResults[0])
      }
    }

    async function close() {
      if (atNotebook) {
        ntbkClose("cancel");
      } else {
        open = false;
        await tick();
       // newToggle.querySelector("button").focus();
      }
    }

    let text;
    $: flagsArr = $tags.items.filter(
      (item) =>
        item.type === "flag" && (!item.name || !item.name.startsWith("colour"))
    );

    function reset() {
      note = { body: [], source: { name: "" } };
      selectedFlags = [];
      selectedNotebooks = [];
      text = "";

    }
  
    async function submit(event) {
      event.preventDefault();
     // click();
      // Get all tags, filter through them to match name of adding tags, add ids as prop
      if (striptags(text) === "") {
        error = true;
      } else {
        close();

        try {
        const payload = Object.assign({}, note);
        payload.sourceId = source.shortId;
        let colourId = $tags.getIds([noteColour]);
        selectedFlags = selectedFlags.map(flag => flag.name)
        // NOTE from Marie: not sure why the getIds function does not work here. 
        let flagId = $tags.items.filter(tag => selectedFlags.indexOf(tag.name) > -1).map(tag => tag.id)
        payload._tags = [colourId].concat(flagId);
        payload.notebooks = selectedNotebooks;
        if ($defaultNotebook && useDefault) {
          payload.notebooks = payload.notebooks.concat($defaultNotebook)
        }
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
  
        let url = `/api/notes`;
        reset()
        await window.fetch(url, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "csrf-token": getToken(),
          },
        });
        click();
        reset();
        $refreshSourceNotes = Date.now();
      } catch (err) {
        console.error(err);
      }
      }
      

    }

    $: atNotebook =
      $page.path && $page.path.startsWith("/notebooks/") ? true : false;
  </script>
  
  <style>
    .error-message {
      color: red;
    }

    .NewBox {
      display: block;
      background-color: var(--workspace-color);
      color: #fff;
      left: 20px;
      width: 100%;
      top: 50px;
      z-index: 3;
      border-radius: 30px;
      padding: 30px 40px 30px 40px;
    }

    form {
      width: 100%;
    }
    .page-input {
      width: 80px;
      border-radius: 5px;
    }
    /* ------ Colours ------ */
    .colours {
      float: left;
      margin: 6px 40px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(4, 15px);
      grid-column-gap: 20px;
    }
    .colours input {
      width: 15px;
      height: 15px;
      -webkit-appearance: none;
      border-radius: 50%;
      position: relative;
      padding: 0;
      cursor: pointer;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
    }
    .colours input:checked::after {
      content: "";
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    input.colour1 {
      background: #fea95b;
    }
    input.colour1::after {
      background: #d86801;
    }
    input.colour2 {
      background: #ff8ebe;
    }
    input.colour2::after {
      background: #c0004e;
    }
    input.colour3 {
      background: #6fe1fa;
    }
    input.colour3::after {
      background: #0693b2;
    }
    input.colour4 {
      background: #9fe793;
    }
    input.colour4::after {
      background: #589b4c;
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
    .newNote .Editor :global(#sapper button.ql-active) {
      background: var(--main-background-color);
    }
    .Editor :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
      stroke: var(--workspace-color);
    }
    .Editor :global(.ql-snow.ql-toolbar button.ql-active .ql-fill),
    .Editor :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill) {
      fill: var(--workspace-color);
    }
    .Editor
      :global(.ql-snow.ql-toolbar
        button:not(.ql-active):hover
        .ql-stroke.ql-fill),
    .Editor :global(.ql-snow .ql-fill),
    .Editor :global(.ql-snow .ql-stroke.ql-fill),
    .Editor :global(.ql-snow.ql-toolbar button:not(.ql-active):hover .ql-fill) {
      fill: var(--main-background-color);
    }
    .Editor :global(.ql-snow.ql-toolbar button:not(.ql-active):hover .ql-stroke),
    .Editor :global(.ql-snow .ql-stroke) {
      stroke: var(--main-background-color);
    }
    .Editor :global(.Editor.hasFocus.svelte-27mrhh .ql-editor) {
      background-color: transparent;
    }
    .Editor :global(#sapper .ql-snow.ql-toolbar button) {
      margin-right: 10px !important;
    }
    .Editor :global(.Editor) {
      background: var(--main-background-color);
      overflow: hidden;
      min-height: 30vh;
      display: grid;
      border-radius: 10px 10px 0 0;
      margin-top: 20px;
    }
    .Editor.error :global(.Editor) {
      border: 2px solid red;
      border-bottom: 0;
    }
    .Editor.colour1 :global(.Editor) {
      border: 2px solid #fea95b;
      border-bottom: 0;
    }
    .Editor.colour2 :global(.Editor) {
      border: 2px solid #ff8ebe;
      border-bottom: 0;
    }
    .Editor.colour3 :global(.Editor) {
      border: 2px solid #6fe1fa;
      border-bottom: 0;
    }
    .Editor.colour4 :global(.Editor) {
      border: 2px solid #9fe793;
      border-bottom: 0;
    }
    .Editor :global(.Editor p),
    .Editor :global(.Editor span) {
      background: transparent !important;
    }
    /* ------ Flags ------ */
    .flags {
      float: left;
      margin: 0;
      position: relative;
      list-style: none;
      width: 100%;
      margin-bottom: 20px;
      border-radius: 0 0 10px 10px;
      padding: 5px 0 0 5px;
    }
    .flags::after {
      content: "";
      position: absolute;
      width: calc(100% - 4px);
      height: 2px;
      display: block;
      top: -2px;
      left: 2px;
    }
    .flags li {
      float: left;
      position: relative;
      margin: 0 5px 5px 0;
    }
    .flags p {
      margin: 0;
      font-size: 0.65rem;
      color: #888888;
      background: #eeeeee;
      border-radius: 20px;
      padding: 5px 10px;
      line-height: 10px;
      text-transform: capitalize;
    }
    .flags :global(svg) {
      height: 10px;
      float: left;
      margin-right: 3px;
    }
    .flags input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      cursor: pointer;
      opacity: 0;
    }
    .flags.error {
      border: 2px solid red;
      border-top: none;
      background: #fffcfa;
    }
    .flags.colour1 {
      border: 2px solid #fea95b;
      border-top: none;
      background: #fffcfa;
    }
    .flags.colour1::after {
      background: #fcf3ed;
    }
    .flags.colour2 {
      border: 2px solid #ff8ebe;
      border-top: none;
      background: #fffafd;
    }
    .flags.colour2::after {
      background: #f9eaf0;
    }
    .flags.colour3 {
      border: 2px solid #6fe1fa;
      border-top: none;
      background: #fafeff;
    }
    .flags.colour3::after {
      background: #dff2f5;
    }
    .flags.colour4 {
      border: 2px solid #9fe793;
      border-top: none;
      background: #f8fcf8;
    }
    .flags.colour4::after {
      background: #eaf5e6;
    }
    .flags.colour1 input:checked ~ p {
      color: #d86801;
      border: none;
      background: #ffebda;
    }
    .flags.colour2 input:checked ~ p {
      color: #c0004e;
      border: none;
      background: #ffe4f0;
    }
    .flags.colour3 input:checked ~ p {
      color: #0693b2;
      border: none;
      background: #e2f7fa;
    }
    .flags.colour4 input:checked ~ p {
      color: #589b4c;
      border: none;
      background: #e6f8e4;
    }
    /* ------ Footer btns ------ */
    :global(.Button) {
      float: right;
    }
    .newNote :global(button.Closer) {
      width: 125px;
      height: 34px;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .newNote :global(.Closer::after) {
      content: "Cancel";
      color: var(--main-background-color);
    }
    :global(.Closer:hover::after) {
      text-decoration: underline;
    }
    :global(.Closer svg) {
      display: none;
    }
    @media (max-width: 720px) {
      .NewBox {
        left: 0;
        top: 0;
        border-radius: 0;
        width: 100%;
        height: 100%;
        position: fixed;
        position: fixed;
        align-items: center;
        display: flex;
      }
      :global(button.Closer),
      :global(button.Submit) {
        width: 50%;
        padding: 15px 0 !important;
        margin: 0 !important;
        font-size: 0.9rem;
        border-radius: 20px !important;
      }
      .flags p {
        padding: 10px;
      }
      .colours {
        margin: 0 0 15px 0;
        width: 100%;
      }

    }
    button.Item {
        text-decoration: none;
        background-color: #f9fbfc;
        position: relative;
        border: 3px dashed #dde8ed;
        border-radius: 15px;
        padding: 30px;
        text-align: center;
        display: grid;
        gap: 20px;
        align-content: center;
        cursor: pointer;
        text-align: center;
        height: 100%;
        box-shadow: 2px 2px 10px 0 rgb(0 0 0 / 3%);
    }
    button.Item span {
        background: var(--action);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        position: relative;
        margin: 0 auto;
    }
    button.Item span::before,
    button.Item span::after {
        content: "";
        position: absolute;
        width: 40%;
        height: 3px;
        background: #f9fbfc;
        border-radius: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    button.Item span::after {
        transform: translate(-50%, -50%) rotate(90deg);
    }
    button.Item p {
        margin: 0;
        padding: 0;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--action);
    }
    .dropdown  {
      padding: 10px;
      display: inline;
    }

    .Flag {
      margin-right: 0.25rem;
      color: black;
      width: fit-content;
      margin-top: 0.5rem;
      background: var(--toolbar-background, #ddd);
      box-sizing: border-box;
      border-radius: 5px;
      padding: 0.25rem 0.25rem;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      display: grid;
      grid-template-columns: 24px 1fr 24px;
    }

    .options {
      display: grid;
      grid-template-columns: 150px 350px 150px;
    }
    
  </style>
  
  {#if open}
    <div class="NewBox newNote">

      <TabsSection {menu} {itemState} />

      <form
        id="newform"
        class="newForm"
        action="/api/create-publication"
        on:submit={submit}>

        <div class="options">
        <ul class="colours">
          {#each colours as colour}
            <li>
              <input
                name="noteColour"
                type="radio"
                class={colour}
                bind:group={noteColour}
                value={colour} />
            </li>
          {/each}
        </ul>

        <div>
          <label>
            <div class="LabelText">
              <slot />
            </div>
            <!-- <ArrowDropDown /> -->
            <span>Select Notebooks: </span>
            <select name="notebooks" on:change={change} id="select-defaultNotebook" value=''>
              {#each notebooksList as notebook}
                <option value={notebook.name}>{notebook.name}</option>
              {/each}
            </select>
          </label>

        </div>
      {#if pages && itemState === "new"}
        <div>
          Pages: <input class="page-input" type="text" bind:value={pageNumber} />

        </div>
      {/if}
        
      </div>
        <br/>
        {#if itemState === "new"}
        <div class="Editor {error ? "error" : noteColour}">
          <NoteEditor bind:richtext={text} />
        </div>
        <ul class="flags {error ? "error" : noteColour}">
          {#each flagsArr as flag}
            <li>
              <input type="checkbox" bind:group={selectedFlags} value={flag} />
              <p class={flag.name}>
                <svelte:component this={assignIco(flag.name)} />
                {flag.name}
              </p>
            </li>
          {/each}
        </ul>

        {#if error}
        <div class="error-message">note cannot be empty</div>
        {/if}

        <WhiteButton click={submit}>Create</WhiteButton>

        <Closer click={close} dark={true} />
        {/if}
        <div class="dropdown">

          {#if $defaultNotebook && $defaultNotebook.name && useDefault}
          <div class="Flag Item">
            <IcoNotebook />
            <span class={$defaultNotebook.name}>{$defaultNotebook.name}</span>
            <CloseIcon
              click={() => {
                useDefault = false;
              }} />
          </div>
      {/if}
      <div>
          {#each selectedNotebooks as notebook}
            <div class="Flag Item">
              <IcoNotebook />
              <span class={notebook.name}>{notebook.name}</span>
              <CloseIcon
                click={() => {
                  const index = selectedNotebooks.indexOf(notebook);
                  if (index !== -1) {
                    selectedNotebooks = selectedNotebooks.filter((old) => {
                      return old !== notebook;
                    });
                  }
                }} />
            </div>
          {/each}
          {#if itemState !== "new"}
          <p>
            Import notes from a docx document. <br/>
            Notes should be separated with ***** <br/>
            For notes with highlights, The highlight should be preceded with "HIGHLIGHT:"
            and associated note (optional) with "NOTE:"
          </p>
          <FileInput notesImport=true close={close} ntbkClose={ntbkClose} {noteColour} {source} />
      
          {/if}
        </div>
          </div>

      </form>

    </div>

{:else}
    <button
    class="Item"
    on:click={click}>
    <span />
    <p>Create a note</p>
    </button>
    {/if}

  