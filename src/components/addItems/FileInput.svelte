<script>
  import { getToken } from "../../getToken";
  import Button from "../widgets/Button.svelte"
  import {refreshNotes, refreshInNote, selectedNotebooks, selectedSource, tags} from "../../stores"
  export let name;
  export let placeholder = "";
  export let dark = false;
  export let notesImport = false;
  export let close = () => {};
  export let ntbkClose = () => {};
  export let noteColour;

  import { stores } from "@sapper/app";
  const { page } = stores();

  let url;
  let publication;
  let type;
  let working;
  let done;
  let failed;
  let storageId;
  let original;
  let fileName;
  let file;
  let atNotebook;
  $: atNotebook =
    $page.path && $page.path.startsWith("/notebooks/") ? true : false;

  let supportedTypes = ["application/epub+zip", "application/pdf", "image/jpeg", 
    "image/png", "image/gif", "audio/mpeg"];

  let error = false;

  async function uploadNotes() {


    if ($selectedSource || 
    ($selectedNotebooks && $selectedNotebooks.length) || noteColour) {

      let body = {};
      if ($selectedNotebooks && $selectedNotebooks.length) {
        body.notebooks = $selectedNotebooks;
      }
      if ($selectedSource) {
        body.sourceId = $selectedSource.shortId;
      }

      if (noteColour) {
        body.tags = $tags.getIds([noteColour]);
      }

      await fetch("/api/notes", {
        method: "PATCH",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "csrf-token": getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    }

    await fetch("/api/notes", {
      method: "PUT",
      credentials: "include",
      mode: "cors",
        headers: { 
          "csrf-token": getToken(),
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
        body: file,
    });


    if ($page.path === "/") $refreshInNote = Date.now();
      else if (atNotebook) ntbkClose();
      else $refreshNotes = Date.now();

      await close()


  }

  async function change(event) {
    file = event.target.files[0];
    fileName = file.name;



    if (!notesImport) {

    if (supportedTypes.indexOf(file.type) === -1) {
      error = true;
    } else {
      error = false;
    }

    if (!error) {
      const response = await fetch("/api/upload-url", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "csrf-token": getToken(),
      },
      body: JSON.stringify({ file: file.name }),
    });
    const payload = await response.json();
    url = payload.url;
    publication = payload.publication;
    type = payload.type;
    storageId = payload.storageId;
    original = payload.original;
    try {
      working = true;
      await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": type,
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
        body: file,
      });
      working = false;
      done = true;
    } catch (err) {
      working = false;
      done = false;
      failed = true;
    }
    }
  } else {

    console.log(file)
    if (file.name.toLowerCase().endsWith('.docx')) {
      error = false;
    } else {
      error = true;
    }
  }

  }
</script>

<style>
  .LabelText {
    font-weight: 500;
    font-size: 0.8rem;
  }
  .dark {
    color: white;
  }
  .input {
    width: 100%;
    float: left;
    cursor: pointer;
    font-size: 0.85rem;
    padding: calc(var(--base) * 0.5 - 2px);
    margin: calc(var(--base) * 0.25) 0;
    border-radius: 10px;
    border: 2px solid #fff;
    line-height: 1rem;
    position: relative;
    text-align: center;
    padding-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .input:hover {
    background: rgba(255, 255, 255, 0.1);
  } /*
  .dark .input {
    border-color: transparent;
    color: #fff;
    background-color: rgba(255,255,255, 0.125);
  }*/
  /* label:focus-within .input {
    outline: none;
    box-shadow: 0 0 0 2px rgba(104, 214, 212, 0.6);
  }
  label.dark:focus-within .input {
    box-shadow: 0 0 2px 2px white;
  } */
  .dark input::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }
  .input.done::after {
    content: "✓";
    font-size: 1rem;
    top: 0;
    right: 0.5rem;
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: bold;
    animation-duration: 250ms;
    animation-name: loaded;
  }
  @keyframes loaded {
    from {
      transform: scale(0.25);
    }
    to {
      transform: scale(1);
    }
  }
  .input.working::after {
    content: " ";
    font-size: 1rem;
    top: 0.85rem;
    right: 0.75rem;
    position: absolute;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: bold;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    box-shadow: 0 0 2px #f0f0f0, 0 0 4px var(--workspace-color);
    background-color: transparent;
    animation-duration: 1000ms;
    animation-name: loading;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    opacity: 0.5;
  }
  .error {
    border-color: red;
  }
  .error-message {
    color: red;
    font-size: 0.8rem;
  }
  @keyframes loading {
    from {
      transform: scale(0.75);
      box-shadow: 0 0 1px #f0f0f0, 0 0 2px #eee;
    }
    to {
      transform: scale(1);
      box-shadow: 0 0 0 6px #f9f9f9, 0 0 0 4px #eee, 0 0 0 2px #ccc;
    }
  }
  @media (max-width: 720px) {
    .LabelText {
      font-size: 0.85rem;
    }
  }
</style>

<!-- This needs to react when changed and set the upload text to the file name. And when a file is selected it needs to fetch an upload url and upload the file. Once this is done we save the upload file url and the content type to hidden inputs.

Upload URL endpoint should take content type as a parameter and return a {publication: true|false, url} object to indicate whether we support that file type.
 -->
<div class:dark>
  <div class="LabelText">
    <br />
    <slot />
  </div>
  {#if type}
    <input type="hidden" name="uploadType" value={type} />
  {/if}
  {#if publication}
    <input type="hidden" name="uploadPublication" value={publication} />
  {/if}
  {#if storageId}
    <input type="hidden" name="storageId" value={storageId} />
  {/if}
  {#if fileName}
    <input type="hidden" name="fileName" value={fileName} />
  {/if}
  {#if original}
    <input type="hidden" name="uploadURL" value={original} />
  {/if}
  <label class="input" class:done class:failed class:working class:error>
    {#if file}{file.name}{:else}Upload a file{/if}
    <input
      type="file"
      {name}
      id="input-{name}"
      {placeholder}
      autocomplete="off"
      class="visually-hidden"
      on:change={change} />
  </label>

  {#if notesImport}
  <Button click={uploadNotes} disabled={!file} light={true}>Upload Notes</Button>
  {/if}
  {#if error}
  <span class="error-message">file format not supported</span>
  {/if}
</div>
