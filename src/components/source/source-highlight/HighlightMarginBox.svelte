<script>
  import {
    getNoted,
    getHighlighted,
    getFlags,
    getColours,
  } from "../source-margin/processNote.js";
  import { assignIco } from "../source-margin/assignIco.js";
  import { setColour } from "./setColour.js";
  import DateFormat from "../../widgets/Date.svelte";
  import HighlightMarginEdit from "./HighlightMarginEdit.svelte";
  import IcoNotebook from "../../img/IcoNotebook.svelte";
  import HighlightButton from "./HighlightButton.svelte";
  import { updateNoteHeight } from "../../../../state/state";
  import { onDestroy, onMount } from "svelte";
  import { text } from "svelte/internal";
  export let note;
  export let annotations;
  export let element;
  // $: if (element && annotations) {
  //   element.addEventListener("annotation-id-change", () => {
  //     note = annotations[element.dataset.annotationId];
  //   });
  // }
  let annotation;
  $: if ($note && $note.annotation) {
    // console.log($note, $note.annotation.body);
    annotation = $note.annotation;
  }
  let clean = "";
  let id, highlighted, noted, flags, colours;
  $: if (annotation) {
    highlighted = getHighlighted(annotation);
    noted = getNoted(annotation);
    flags = getFlags(annotation);
    colours = getColours(annotation);
  }
  let colour;
  $: if (
    annotation &&
    annotation.tags &&
    annotation.tags.find((tag) => tag.type === "colour")
  ) {
    colour = annotation.tags.find((tag) => tag.type === "colour");
  }
  let noteElement;
  $: if (colour && noteElement) {
    setColour(colour, noteElement);
  } else if (noteElement) {
    noteElement.style.setProperty("--toolbar-colour", "#dddddd");
    noteElement.style.setProperty("--toolbar-text", "#999");
  }
  let editing;
  let modal;
  let height;
  let oldHeight;
  $: if (height && height !== oldHeight) {
    updateNoteHeight({ id: note.id, height });
    oldHeight = height;
  }
  let wrapper;
  function handleEvent(event) {
    if (event.target.matches(`[data-annotation-id="${annotation.id}"]`)) {
      editing = true;
    }
  }
  onDestroy(() => {
    document.removeEventListener("click", handleEvent);
  });
  onMount(() => {
    document.addEventListener("click", handleEvent);
  });
</script>

<style>
  .Note {
    box-shadow: 3px 3px 28px rgba(0, 0, 0, 0.03);
    border: 1px solid var(--toolbar-colour, #dddddd);
    border-radius: 14.32px;
    font-size: 0.75rem;
    margin: 0 1rem;
    padding: 1rem 0 0;
    overflow: hidden;
    background-color: white;
  }
  .CommentBlock {
    display: block;
    padding: 0 1rem 0.5rem;
  }
  .CommentBlock,
  .CommentBlock :global(*) {
    font-size: 0.75rem;
  }
  .CommentBlock :global(p) {
    margin: 0;
  }
  .CommentBlock :global(p + p) {
    margin-top: 1em;
  }
  .TextButton,
  .TextButton:link {
    font-family: var(--sans-fonts);
    font-size: 0.75rem;
    flex: 0 1 auto;
    line-height: 1;

    display: inline-block;

    padding: 0;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    font-weight: 500;
    color: #888;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    /* transition: box-shadow 0.15s ease-in-out; */
    background-color: transparent;
    text-decoration: none !important;
    transition: background-color 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    border: none;
  }

  .TextButton:hover,
  .TextButton:link:hover,
  .TextButton:link:visited:hover,
  .TextButton:visited:hover,
  .TextButton:link:visited:hover {
    color: black;
    box-shadow: none;
    text-decoration: underline;
  }

  .TextButton:active,
  .TextButton:link:active {
    background-color: var(--active);
  }
  .TextButton:focus {
    outline: none;
    box-shadow: 0 0 0 3px #68d6d499;
  }
  .Footer {
    padding: 0.5rem 1rem;
    background: var(--toolbar-background, #ddd);
    color: var(--toolbar-text, #333);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .Tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .Flags {
    display: grid;
    padding-top: 0.5rem;
    grid-template-columns: 1fr 0.25fr;
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
    grid-template-columns: 24px 1fr;
    text-align: right;
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
  :global(.modal),
  :global(.modal_screen) {
    position: fixed;
    z-index: 99;
  }

  .DeleteModal + :global(.modal_screen) {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    display: none;
  }
  :global(.modal) {
    visibility: hidden;
  }
  :global(.modal-open) {
    visibility: visible;
  }
  .DeleteModal.modal-open + :global(.modal_screen) {
    display: block;
  }

  :global(.DeleteModal.modal-open) {
    z-index: 100001;
    background: transparent;
    box-sizing: border-box;
    padding: 0;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    overflow: auto;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    box-shadow: none;
    display: flex;
    pointer-events: none;
  }

  .DeleteModal :global(.modal_close) {
    position: absolute;
    top: 1rem;
    right: 1rem;
    border: none;
    cursor: pointer;
    background: transparent;
    margin: 0;
    font-size: 1.4rem;
    width: 1.4em;
    height: 1.4em;
    line-height: 1;
    overflow: hidden;
    text-indent: -999px;
    pointer-events: auto;
  }
  :global(.modal_close:before),
  :global(.modal_close:after) {
    content: "";
    height: 1em;
    width: 0.1em;
    top: 0.2em;
    left: 0.65em;
    background: #777;
    position: absolute;
    transform: rotate(-45deg);
  }
  :global(.modal_close:after) {
    transform: rotate(45deg);
  }
  .InnerModal {
    margin: auto;
    width: 80vw;
    max-width: 500px;
    height: 70vh;
    max-height: 300px;
    background-color: white;
    border-radius: 12px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    justify-content: space-between;
  }
  .InnerModal svg {
    margin: 0 auto 1rem;
  }
  .InnerModal p {
    margin: 0.75rem 0 0;
    font-size: 0.85rem;
  }
  .InnerModal .textButtons {
    display: flex;
    justify-content: center;
    --toolbar-text: #f05657;
  }
  .InnerModal .CancelButton {
    --toolbar-text: black;
    margin-right: 2rem;
  }
  .pages {
    margin: 10px 1rem 0 1rem;
    text-align: right;
  }
</style>

{#if $note && !$note.deleted}

  <fg-modal
    id="delete-note-{annotation.shortId}"
    bind:this={modal}
    class="DeleteModal">
    <div class="InnerModal">
      <svg
        width="102"
        height="94"
        viewBox="0 0 102 94"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="51.4064" cy="52.6794" r="40.7606" fill="#F8E6E6" />
        <path
          d="M3.42857 69.7154L44.1065 5.31873C47.3205 0.230621 54.7393 0.226273
          57.9593 5.3106L98.9265 69.9968C102.389 75.4646 98.4457 82.6003 91.9736
          82.5774L10.3285 82.2879C3.88685 82.265 -0.0116428 75.1615 3.42857
          69.7154Z"
          fill="white"
          stroke="#FFCACA"
          stroke-width="3" />
        <path
          d="M91.7131 82.1456L55.1794 28.2859C51.3305 22.6117 42.9688 22.6161
          39.1259 28.2944L4.85864 78.9282C6.46342 80.8558 8.87714 82.1458
          11.7605 82.156L89.2962 82.431C90.1414 82.434 90.9496 82.3342 91.7131
          82.1456Z"
          fill="#FEF7F7" />
        <circle cx="51.2944" cy="64.7324" r="5.33906" fill="#FFCACA" />
        <path
          d="M46.2138 22.0137C46.0734 19.1111 48.3889 16.6808 51.2949
          16.6808C54.2009 16.6808 56.5163 19.1111 56.3759 22.0137L55.0263
          49.9058C54.9299 51.8965 53.2879 53.461 51.2949 53.461C49.3019 53.461
          47.6598 51.8965 47.5635 49.9058L46.2138 22.0137Z"
          fill="#FFCACA" />
      </svg>
      <div class="Warning">
        <p>Are you sure you want to delete this note?</p>
        <p>
          <strong>This action cannot be undone</strong>
        </p>
      </div>
      <div class="textButtons">
        <div class="CancelButton">
          <HighlightButton outline={true} click={() => modal.close()}>
            Cancel
          </HighlightButton>
        </div>
        <HighlightButton
          click={() => {
            $note.delete();
            modal.close();
          }}>
          Delete
        </HighlightButton>
      </div>
    </div>
  </fg-modal>
  <div bind:offsetHeight={height} bind:this={wrapper}>
    {#if editing}
      <HighlightMarginEdit
        {annotation}
        note={$note}
        stopEditing={() => {
          editing = false;
        }}
        {modal} />
    {:else}
      <div
        class="Note"
        bind:this={noteElement}
        on:click={(event) => {
          if (!editing) {
            editing = true;
          }
        }}>
        <div class="CommentBlock">
          {#if noted}
            {@html noted.content || noted.value}
          {:else}
            <button
              type="button"
              class="TextButton"
              on:click={() => {
                editing = true;
              }}>
              Add note...
            </button>
          {/if}

        </div>
        {#if annotation && annotation.json && annotation.json.pages}
        <div class="pages">p.{annotation.json.pages}</div>
        {/if}
        <div class="Footer">
          <div class="Tags">
            {#each flags as flag}
              <div class="Flag Item">
                <svelte:component this={assignIco(flag.name)} />
                <span class={flag.name}>
                  {flag.name[0].toUpperCase()}{flag.name.slice(1)}
                </span>
              </div>
            {:else}
              <span />
            {/each}
            {#each annotation.notebooks as notebook}
              <div class="Flag Item">
                <IcoNotebook />
                <span class={notebook.name}>
                  {notebook.name[0].toUpperCase()}{notebook.name.slice(1)}
                </span>
              </div>
            {:else}
              <span />
            {/each}
          </div>
          {#if annotation.updated || annotation.published}
            <div class="Flag">
              <span />
              <DateFormat
                updated={annotation.updated}
                published={annotation.published} />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}
