<script>
  import { publication } from "../../../stores";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import DeletionModal from "../../widgets/DeletionModal.svelte";
  import { goto } from "@sapper/app";
  import { getToken } from "../../../getToken";

  // let download;
  // $: if ($publication && $publication.json && $publication.json.storageID) {
  //   download = `/api/download/${$publication.json.storageId}`;
  // } else {
  //   download = "";
  // }

  let activeModal = false;

  async function remove() {
    goto(`library/all/all/`);

    try {
      await fetch(`/api/publication/${$publication.shortId}`, {
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
  }
</script>

<style>
  .ToolBar {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--reader-toolbar-background);
    border-bottom: 1px solid var(--reader-toolbar-border);
    color: var(--reader-toolbar-color);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: sticky;
    top: 0;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    padding: 0;
    display: flex;
    justify-content: space-between;
    padding: 7px 1rem;
    align-items: stretch;
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
</style>

<div class="ToolBar">
  <ol>
    <span
      class="deletion"
      on:click={() => {
        activeModal = true;
      }}>
      <IcoDelete />
      Delete
    </span>
  </ol>
</div>
{#if activeModal}
  <DeletionModal
    {remove}
    bind:activeModal
    type="source"
    items={[$publication]} />
{/if}
