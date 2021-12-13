<script>
    import Button from "../../widgets/Button.svelte";
    import { getToken } from "../../../getToken";
    import IcoGoBack from "../../img/IcoGoBack.svelte";
    import IcoEdit from "../../img/IcoEdit.svelte";
    import IcoNewTab from "../../img/IcoNewTab.svelte"
    import { onMount } from "svelte"

    export let source;
    export let resetDisplay;

    let url = source.links && source.links.length ? source.links[0].url : null;
    let editing = !url;
    let preview;
    onMount(async () => {
      if (url) {
        preview = await getPreview(url);
      }
    })

    async function getPreview(url) {
      try {
        const response = await fetch(`/api/urlPreview?url=${url}`, {
          method: "GET",
          credientials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          }
        })
        return await response.json();
      } catch (err) {
        return;
      }
    }

    async function submit(event) {
      event.preventDefault();
     let payload = source;
     payload.links = [{rel: "alternate", url: url}]
      try {
        await fetch(`/api/publication/${source.shortId}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          },
          body: JSON.stringify(payload),
        });
        preview = await getPreview(url)
      } catch (err) {
        console.error(err);
      }
      editing= false;

    }
    function close(event) {

        event.preventDefault();
        resetDisplay()
    }
    function openEdit(event) {
        event.preventDefault();
        editing = true;
    }
  </script>
  
  <style>
    .Pane {
        padding: 50px 10px;
    }
    h3 {
      padding: 40px 0;
      margin: 0;
      font-weight: bold;
      text-align: center;
      font-size: 2rem;
    }

    input[type="submit"]:hover {
        background: var(--rc-dark);
    }

    .url-input {
      text-align: center;
      margin: 0 5%;
    }
    input {
        background: var(--main-background-color);
        border: auto;
        border-radius: 10px;
        padding: 0 20px;
        margin: 0 20px 10px 20px;
        color: var(--workspace-color);
        outline: none;
        height: 30px;
        
    }
    textarea {
        background: white;
        border: none;
        border-radius: 10px;
        padding: 10px 20px;
        margin: 0 20px 10px 20px;
        color: var(--workspace-color);
        outline: none;
        width: 80%;
    }
    .preview-title {
      font-weight: 500;
      font-size: 1.5rem;
      padding: 20px 10%;
      text-align: left;
    }
    .preview-description {
      text-align: left;
      padding: 0 10%;
    }
    .preview-image {
      float: left;
      padding: 20px 10%;
    }
    .preview {
      font-weight: 700;
      font-size: 1.5rem;
      padding: 20px;
    }

  </style>
  
  <div class="Pane">
      <h3>Url</h3>
      <div class="url-input">
        {#if url && !editing}
        <IcoNewTab /><a href={url} target="_blank">{url}</a>
        <span on:click={openEdit}><IcoEdit /></span>
          {#if preview}
          <div class="preview-box">
            <div class="preview">Preview: </div>
            {#if preview.title} 
            <div class="preview-title">{preview.title}</div>
            {/if}
            {#if preview.description}
            <div class="preview-description">{preview.description}</div>
            {/if}
            {#if preview.images && preview.images.length}
            <img class="preview-image" width="200" height="200" src={preview.images[0]} alt="preview"/>
            {/if}
          </div>
          {/if}
        {/if}
        {#if editing}
        <form on:submit={submit}>
        <textarea type=textarea bind:value={url}/>
        <br/>
        <input type="submit" value="save" />
        </form>
        {/if}
      </div>


  </div>
  