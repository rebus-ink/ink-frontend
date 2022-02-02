<script>
  import DOMPurify from "dompurify";
  import HighlightColours from "./HighlightColours.svelte";
  import HighlightFlags from "./HighlightFlags.svelte";
  import HighlightButton from "./HighlightButton.svelte";
  import HighlightTextButton from "./HighlightTextButton.svelte";
  import HighlightNoteField from "./HighlightNoteField.svelte";
  import HighlightNotebooks from "./HighlightNotebooks.svelte";
  import { getToken } from "../../../getToken";
  import { assignIco } from "../source-margin/assignIco.js";
  import IcoNotebook from "../../img/IcoNotebook.svelte";
  import IcoTag from "./IcoTag.svelte";
  import CloseIcon from "./CloseIcon.svelte";
  import { onDestroy } from "svelte";
  import { notebooks$, source$, chapter$ } from "../../../../state/state";
  import { tags$ } from "../../../../state/tags";
  import { setColour } from "./setColour.js";
  let toolbar;
  let hidden;
  let range;
  let colour;
  let selectedFlags;
  let selectedNotebooks;
  let flagMenu;
  let noteBookMenu;
  let highlight;
  let plaintext;
  let loaded = 0;
  let pageNumber;
  export let modal;
  export let note;
  export let annotation;
  export let stopEditing = () => {};
  let noted;
  function getNoted(note) {
    const body = [].concat(note.body).find((item) => {
      return item.motivation === "commenting" || item.purpose === "commenting";
    });
    let content;
    if (body) {
      content = body.content || body.value;
    }
    let result;
    if (body && content) {
      const fragment = DOMPurify.sanitize(`<div>${content}</div>`, {
        RETURN_DOM: true,
        RETURN_DOM_FRAGMENT: true,
      });
      const scratch = document.getElementById("scratch");
      scratch.append(fragment);
      result = scratch.innerText;
      scratch.innerHTML = "";
    }
    return result;
  }

  /*
  Note (from Marie): I added the 'loaded' variable to avoid having this code run after the initial 
  loading phase. The problem is that it was running when the text of the note was deleted (and the 
  text would suddenly re-appear). Same if you tried to remove the last flag. So that code is run twice 
  initially. Not sure why twice,  but that is why I am preventing it from running once loaded is equal
  to 2
  */
  $: if (annotation && !plaintext && loaded < 2) {
      plaintext = getNoted(annotation); 
      loaded++;
    // if (noted) {
    //   window
    //     .fetch("/api/markdown", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "text/html",
    //         "csrf-token": getToken(),
    //       },
    //       body: noted.content || noted.value,
    //     })
    //     .then((response) => {
    //       if (response.ok) {
    //         return response.json();
    //       } else {
    //         return { content: "" };
    //       }
    //     })
    //     .then((json) => {
    //       plaintext = json.content;
    //     });
    // }
  }

  $: if (annotation && annotation.tags && loaded < 2) {
    if (!colour) {
      colour = annotation.tags.find((tag) => tag.type === "colour");
    }
    if (
      (!selectedFlags || selectedFlags.length === 0) &&
      annotation.tags.find((tag) => tag.type === "flag")
    ) {
      selectedFlags = annotation.tags.filter((tag) => tag.type === "flag");
    }
    if (
      (!selectedNotebooks || selectedNotebooks.length === 0) &&
      annotation.notebooks &&
      annotation.notebooks.length !== 0
    ) {
      selectedNotebooks = annotation.notebooks;
    }
  }
  $: if (colour && toolbar) {
    setColour(colour, toolbar);
  } else if (toolbar) {
    toolbar.style.setProperty("--toolbar-colour", "#dddddd");
    toolbar.style.setProperty("--toolbar-text", "#999");
  }
  // function hasSelection() {
  //   return $selectionHighlight$ && $selectionHighlight$.selection.isCollapsed;
  // }
  let createdNotebooks = [];
  function createNotebook(name) {
    if (!createdNotebooks.find((item) => item.name === name.toLowerCase())) {
      createdNotebooks = createdNotebooks.concat({ name: name.toLowerCase() });
    }
  }
  let createdFlags = [];
  function createFlag(name) {
    if (!createdFlags.find((item) => item.name === name.toLowerCase())) {
      createdFlags = createdFlags.concat({ name: name.toLowerCase() });
    }
  }
  async function update() {
    const flags = [].concat(selectedFlags, createdFlags).filter((item) => item);
    const notebooks = []
      .concat(selectedNotebooks, createdNotebooks)
      .filter((item) => item);
    let body;
    //if (plaintext) {
      // use textcontent
      const content = await window
        .fetch("/api/markdown", {
          method: "POST",
          headers: {
            "Content-Type": "text/html",
            "csrf-token": getToken(),
          },
          body: plaintext,
        })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return { content: "" };
          }
        })
        .then((json) => {
          return json.content;
        });
      body = content;
    //}
    let object = {
      tags: flags.concat(colour),
      notebooks
    }

    if (pageNumber) object.json = Object.assign({}, object.json, {pages: pageNumber})

    stopEditing();
    return note.update(object, body);
  }
</script>

<style>
  .HighlightToolbar {
    padding: 0;
    margin: 0;
    background-color: white;
    padding: 0.5rem 0.65rem;
    border-radius: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--toolbar-colour, #dddddd);
    z-index: 10;
    position: relative;
  }
  .HighlightToolbar ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 1rem;
  }
  .HighlightToolbar li {
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }
  :global(#sapper
      .Chapter
      .Highlight[data-annotation-id="temporary-selection-highlight"]) {
    background-color: rgba(120, 120, 120, 0.2);
  }
  .ButtonBar {
    display: flex;
    justify-content: space-between;
  }
  /* your styles go here */
  .Flags {
    display: flex;
    flex-direction: row;
    padding-top: 0.5rem;
    flex-wrap: wrap;
  }
  .Flag {
    margin-right: 0.25rem;
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
  .Flag :global(svg) {
    color: var(--toolbar-text, #000);
    margin-right: 0.5rem;
    width: 16px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 100%;
    height: 16px;
    padding: 3px;
  }
  .ButtonBar :global(svg) {
    color: var(--toolbar-text, #000);
  }
  .page-input {
    height: 20px;
    width: 80px;
    font-size: 0.6rem;
  }
  .pages {
    font-size: 0.6rem;
    text-align: right;
  }
</style>

<nav
  class="HighlightToolbar"
  class:colour
  bind:this={toolbar}
  class:visually-hidden={hidden}
  on:mousedown={(event) => {
    if (event.target.matches('details *:not(label):not(input)') || event.target === event.currentTarget) {
      event.preventDefault();
    }
  }}
  on:click={(event) => {
    if (event.target.matches('input')) {
    }
  }}>
  <ol>
    <HighlightColours bind:colour tags={$tags$} />
    <li>
      <HighlightFlags
        {colour}
        tags={$tags$}
        bind:selectedFlags
        bind:flagMenu
        create={createFlag} />
    </li>
    <li>
      <HighlightNotebooks
        {colour}
        notebooks={$notebooks$.items}
        bind:selectedNotebooks
        bind:noteBookMenu
        create={createNotebook} />
    </li>
    <li />
  </ol>
  {#if (selectedFlags && selectedFlags.length !== 0) || (selectedNotebooks && selectedNotebooks.length !== 0) || createdNotebooks.length !== 0 || createdFlags.length !== 0}
    <div class="Flags">
      {#if selectedFlags}
        {#each selectedFlags as flag}
          <div class="Flag Item">
            <svelte:component this={assignIco(flag.name)} />
            <span class={flag.name}>
              {flag.name[0].toUpperCase()}{flag.name.slice(1)}
            </span>
            <CloseIcon
              click={() => {
                const index = selectedFlags.indexOf(flag);
                if (index !== -1) {
                  selectedFlags = selectedFlags.filter((old) => {
                    return old.shortId !== flag.shortId;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
      {#if createdFlags.length !== 0}
        {#each createdFlags as flag}
          <div class="Flag Item">
            <IcoTag />
            <span class={flag.name}>
              {flag.name[0].toUpperCase()}{flag.name.slice(1)}
            </span>
            <CloseIcon
              click={() => {
                const index = createdFlags.indexOf(flag);
                if (index !== -1) {
                  createdFlags = createdFlags.filter((old) => {
                    return old !== flag;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
      {#if createdNotebooks.length !== 0}
        {#each createdNotebooks as notebook}
          <div class="Flag Item">
            <IcoNotebook />
            <span class={notebook.name}>{notebook.name}</span>
            <CloseIcon
              click={() => {
                const index = createdNotebooks.indexOf(notebook);
                if (index !== -1) {
                  createdNotebooks = createdNotebooks.filter((old) => {
                    return old !== notebook;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
      {#if selectedNotebooks}
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
      {/if}
    </div>
  {/if}
  <HighlightNoteField bind:plaintext />
  <div class="pages">
    {#if annotation && annotation.json}
    pages: <input type="text" class="page-input" bind:value={annotation.json.pages} placeholder="page(s)" />
    {:else}
    pages: <input type="text" class="page-input" bind:value={pageNumber} placeholder="page(s)" />
    {/if}</div>
  <div class="ButtonBar">
    <HighlightTextButton
      click={() => {
        modal.open();
        stopEditing();
      }}>
      <div class="visually-hidden">Delete</div>
      <svg
        width="28"
        height="28"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="18" rx="3" fill="currentColor" />
        <path
          d="M6.14794 6.77944C6.13067 6.57737 6.29003 6.40381 6.49284
          6.40381H11.5081C11.7109 6.40381 11.8702 6.57737 11.853 6.77944L11.3352
          12.8371C11.3199 13.0162 11.1701 13.1538 10.9903
          13.1538H7.01059C6.83084 13.1538 6.681 13.0162 6.66569 12.8371L6.14794
          6.77944Z"
          fill="white" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.13461 4.15381C7.9753 4.15381 7.84615 4.27973 7.84615
          4.43506V5.27881H5.82692C5.66761 5.27881 5.53846 5.40473 5.53846
          5.56006C5.53846 5.71539 5.66761 5.84131 5.82692
          5.84131H12.1731C12.3324 5.84131 12.4615 5.71539 12.4615
          5.56006C12.4615 5.40473 12.3324 5.27881 12.1731
          5.27881H10.1538V4.43506C10.1538 4.27973 10.0247 4.15381 9.86538
          4.15381H8.13461ZM9.57692 4.71631H8.42308V5.27881H9.57692V4.71631Z"
          fill="white" />
      </svg>

    </HighlightTextButton>

    <div class="textButtons">
      <HighlightButton outline={true} click={() => stopEditing()}>
        Cancel
      </HighlightButton>
      <HighlightButton click={() => update()}>Save</HighlightButton>
    </div>
  </div>
</nav>
