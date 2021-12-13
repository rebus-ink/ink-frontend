<script lang="ts">
  import { getToken } from "../../../getToken";
  export let name;
  export let placeholder = "";
  export let dark = false;
  let file;
  let publication;
  let type;
  let working;
  let done;
  let failed;
  export let storageId = null;
  export let fileName = null;
  let original;
  let error = false;

  let supportedTypes = ["application/epub+zip", "application/pdf", "image/jpeg", 
    "image/png", "image/gif", "audio/mpeg"]
  
  async function change(event) {
    working = true;
    file = event.target.files[0];

    console.log(file.type)
    if (supportedTypes.indexOf(file.type) === -1) {
      error = true;
      working = false;
      fileName = undefined; // to disable the save button
    } else {
      error = false;
      fileName = file.name
    let url;
    let body;
    let fileType;
    // if (file.size < 1024 * 1024) {
    //   url = `/api/upload-small-file?filePath=${file.name}`;
    //   body = event.target.files[0]
    //   fileType = file.type;
    // } else {
    //   url = `/api/upload-url`;
    //   body = JSON.stringify({ file: file.name });
    //   fileType = "application/json";
    // }
    url = `/api/upload-url`;
    body = JSON.stringify({ file: file.name });
    fileType = "application/json";
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": fileType,
        "csrf-token": getToken()
      },
      body
    });
    const payload = await response.json();
    url = payload.url;
    publication = payload.publication;
    type = payload.type;
    storageId = payload.storageId;
    original = payload.original;
    try {
      await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": type,
          "Content-Disposition": `attachment; filename="${fileName}"`
        },
        body: file
      });
      working = false;
      done = true;
    } catch (err) {
      console.error(err)
      working = false;
      done = false;
      failed = true;
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
    background-color: #dde8ed;
  }
  .error-input {
    border: 2px solid red !important;
    box-shadow: 0 0 0 2px red !important;

  }
  .input:hover {
    background: rgba(255, 255, 255, 0.1);
  } /*
  .dark .input {
    border-color: transparent;
    color: #fff;
    background-color: rgba(255,255,255, 0.125);
  }*/
  label:focus-within .input {
    outline: none;
    box-shadow: 0 0 0 2px rgba(104, 214, 212, 0.6);
  }
  label.dark:focus-within .input {
    box-shadow: 0 0 2px 2px white;
  }
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
  .error {
    color: red;

    font-size: 0.8rem;
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
    box-shadow: 0 0 2px #f0f0f0, 0 0 4px black;
    background-color: transparent;
    animation-duration: 500ms;
    animation-name: loading;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    opacity: 0.5;
  }
  @keyframes loading {
    from {
      transform: scale(0.75);
      box-shadow: 0 0 1px #333, 0 0 2px #999;
    }
    to {
      transform: scale(1);
      box-shadow: 0 0 0 8px #999, 0 0 0 4px #ccc, 0 0 0 2px #fff;
    }
  }
  @media (max-width: 720px) {
    .LabelText {
      font-size: 0.85rem;
    }
  }
  label {
    width: 100%;
  }
</style>

<!-- This needs to react when changed and set the upload text to the file name. And when a file is selected it needs to fetch an upload url and upload the file. Once this is done we save the upload file url and the content type to hidden inputs.

Upload URL endpoint should take content type as a parameter and return a {publication: true|false, url} object to indicate whether we support that file type.
 -->
<label class:dark for="input-{name}">
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
  <div class={ error ? "input error-input" : "input"} class:done class:failed class:working>
    {#if file}{file.name}{:else}Upload a file{/if}
    <input
      type="file"
      {name}
      id="input-{name}"
      {placeholder}
      autocomplete="off"
      class="visually-hidden"
      on:change={change} />
  </div>
  <div class="error">
  {#if error}
  file type not supported
  {/if}
</div>
</label>
