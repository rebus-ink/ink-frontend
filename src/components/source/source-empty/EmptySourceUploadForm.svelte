<script>
  import Button from "../../widgets/Button.svelte";
  import UploadIcon from "../../img/UploadIcon.svelte";
  import { getToken } from "../../../getToken";
  import { goto } from "@sapper/app";
  import FileInput from "./EmptySourceFileInput.svelte";
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  export let source;
  export let uploading = false;
  let form;
  let storageId;
  let fileName;
  async function submit(event) {
    event.preventDefault();
    if (!storageId) return;
    try {
      const body = Object.fromEntries(
        new URLSearchParams(new FormData(form)).entries()
      );
      await fetch(form.action, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err);
    }
    uploading = false;
    await sleep(500);
    return goto(`/sources/${source.shortId}/${storageId}`);
  }
</script>

<style>
  h3 {
    margin: 0;
    font-weight: bold;
  }
  p {
    color: #888888;
    margin: 0.5rem;
    font-size: 0.85rem;
  }
  .Text {
    margin: 2rem;
  }
  .Pane {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 15%;
    transition: opacity 100ms cubic-bezier(0.39, 0.575, 0.565, 1);
  }
  .Pane.uploading {
    display: grid;
    grid-template-rows: min-content 1fr 5rem;
    justify-content: stretch;
    align-items: stretch;
    padding: 1rem;
    grid-gap: 1rem;
    padding-top: 35%;
    padding-bottom: 10rem;
  }
  .ButtonRow {
    padding-top: 2rem;
  }
  .Pane :global(.Editor) {
    background-color: white;
  }
  .NewForm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="Pane" class:uploading>
    <UploadIcon />

    <div class="Text">
      <h3>Upload a file to your source</h3>
      <p>
        Click to upload your file. Processing may take a while after you upload.
      </p>
      <form
        id="newform"
        class="NewForm"
        action="/api/publication/{source.shortId}/attach-file"
        on:submit={submit}
        bind:this={form}>

        <FileInput name="newFile" type="file" bind:storageId bind:fileName />
        <div class="ButtonRow">
          <Button disabled={!fileName} light={!fileName} click={submit}>Save</Button>
        </div>
      </form>
    </div>
</div>
