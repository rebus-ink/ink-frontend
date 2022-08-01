<script context="module">
  export let dialog;
</script>

<script>
  import NoteEdit from "./NoteEdit.svelte";
  import A11yDialog from "a11y-dialog";
  let element;
  let localDialog;
  $: if (element) {
    localDialog = new A11yDialog(element);
    dialog = localDialog;
  }
  let note = { body: [], source: { name: "" } };
  $: if (localDialog) {
    localDialog.on("show", async function(dialogEl, event) {
      const noteURL = event.annotationId.split("/");
      const noteId = noteURL[noteURL.length - 1];
      const url = `/api/note/${noteId}`;
      const response = await fetch(url).catch(err => {
        console.error(err);
      });
      note = await response.json();
    });
    localDialog.on("hide", async function() {
      note = { body: [], source: { name: "" } };
    });
  }
</script>

<style>
  :global(#note-edit-dialog.dialog[aria-hidden="true"]) {
    display: none;
  }
  .dialog-overlay {
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.66);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .dialog-content {
    z-index: 11;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    margin: 0;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes appear {
    from {
      transform: translate(-50%, -40%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  .dialog:not([aria-hidden="true"]) > .dialog-overlay {
    animation: fade-in 200ms 1 both;
  }

  .dialog:not([aria-hidden="true"]) > .dialog-content {
    animation: appear 400ms 150ms 1 both;
  }

  .dialog-content {
    padding: 0;
    max-width: 90%;
    width: 600px;
    border-radius: 15px;
  }

  @media screen and (min-width: 700px) {
    .dialog-content {
      padding: 0;
    }
  }

  .dialog-overlay {
    background-color: rgba(43, 46, 56, 0.9);
  }

  .dialog h1 {
    font-size: 1.25em;
  }

  .dialog-close {
    position: absolute;
    top: 2.7rem;
    right: 14em;
    z-index: 12;
    border: 0;
    padding: 0;
    background-color: transparent;
    font-weight: normal;
    font-size: 0.75em;
    height: 1.2em;
    text-align: center;
    cursor: pointer;
    transition: 0.15s;
    text-transform: uppercase;
  }
  h1 {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0.5rem 1rem;
    z-index: 11;
  }
</style>

<div
  id="note-edit-dialog"
  bind:this={element}
  class="dialog"
  aria-hidden="true">
  <div class="dialog-overlay" tabindex="-1" data-a11y-dialog-hide />

  <!--
    Dialog window content related notes:
    - It is the actual visual dialog element.
    - It may have the `alertdialog` role to make it behave like a “modal”. See the “Usage as a modal” section of the docs.
    - It doesn’t have to be a `<dialog>` element, it can be a `<div>` element with the `dialog` or `alertdialog` role (e.g. `<div role="dialog">`).
    - It doesn’t have to have the `aria-labelledby` attribute however this is recommended. It should match the `id` of the dialog title.
  -->
  <div role="dialog" class="dialog-content" aria-labelledby="dialog-title">
    <!--
      Closing button related notes:
      - It does have to have the `type="button"` attribute.
      - It does have to have the `data-a11y-dialog-hide` attribute.
      - It does have to have an aria-label attribute if you use an icon as content.
    -->
    <button
      data-a11y-dialog-hide
      class="dialog-close"
      aria-label="Close this dialog window">
      close
    </button>
    <h1 id="dialog-title" class="visually-hidden" data-ink-private="true">Edit Note</h1>
    {#if note.id && process.browser}
      <NoteEdit {note} dialog={true} />
    {/if}
  </div>
</div>
