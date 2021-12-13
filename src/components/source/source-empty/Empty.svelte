<script lang="ts">
  import EmptySourcePasteForm from "./EmptySourcePasteForm.svelte";
  import EmptySourceUploadForm from "./EmptySourceUploadForm.svelte";
  import TitleBar from "../source-titlebar/TitleBar.svelte";
  import EmptySourcePaster from "./EmptySourcePaster.svelte"
  // import { onMount } from 'svelte';
  import Button from "../../widgets/Button.svelte";
  import UploadIcon from "./UploadIcon.svelte";
  import EmptySourceNotes from "./EmptySourceNotes.svelte"
  import UrlForm from "./UrlForm.svelte"
  export let source;
  let leftDisplay = null;
  let uploading = false;
  let pasting = false;
  let hasNotes = !!source.replies.length;
  let display = "notes";
  // let Info
  // onMount(async () => {
  //   const module = await import('./EmptyInfo.svelte');
  //   Info = module.default;
  // });
  async function submit(event) {
    event.preventDefault();
    display = event.target.value;
  }

</script>

<style>
  /* your styles go here */
  .NoSource {
    grid-column: 1 / -1;
    grid-row: 2 / -1;
    display: grid;
    grid-template-columns: 300px auto;
    grid-template-rows: repeat(auto-fit, minmax(300px, 1fr));
    min-height: 100vh;
    padding-top: 50px;
  }
  .TitleBar {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .left-menu {
    background: lightgrey;
  }
  .left-menu-section {
    padding: 30px 10px 60px 0;
    text-align: center;
  }
  .active {
    background-color: rgb(236, 241, 244);
  }
  

</style>

<div class="TitleBar">
  <TitleBar name={source.name} {source} />
</div>
<!-- 
<svelte:component this={Info} /> -->


<div class="NoSource">
  <div class="left-menu">

    <div class={display === "notes" ? "left-menu-section active" : "left-menu-section"}>
      <Button light={true} click={submit} value="notes">Notes</Button>
    </div>
    <div class={display === 'upload' ? "left-menu-section active" : "left-menu-section"}>
      <Button disabled={hasNotes} light={true} click={submit} value="upload">Upload File</Button>
    </div>
    <div class={display === 'paste' ? "left-menu-section active" : "left-menu-section"}>
      <Button disabled={hasNotes} light={true} click={submit} value="paste">Copy-Paste content</Button>
    </div>
    <div class={display === "url" ? "left-menu-section active" : "left-menu-section"}>
      <Button light={true} click={submit} value="url">Url</Button>
    </div>
  </div>
  <div>
    {#if display === 'upload'}
      <EmptySourceUploadForm bind:uploading {source} />
    {:else if display === "paste"}
      <EmptySourcePasteForm bind:pasting {source} />
    {:else if display==="url"}
    <UrlForm {source} />

    {:else}
    <EmptySourceNotes {source} />

    {/if}
  </div>
</div>
