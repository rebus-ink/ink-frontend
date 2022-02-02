<script>
  import { pageItem, page, refreshNotebook } from "../../stores";
  import { getToken } from "../../getToken";
  import History from "../widgets/History.svelte";
  import PageTitle from "./Tools/PageTitle.svelte";
  import PageTypeCard from "./Tools/PageTypeCard.svelte";
  import Loader from "../widgets/Loader.svelte";
  import { goto } from "@sapper/app";
  import DeletionModalPage from "../widgets/DeletionModal.svelte";

  $: pageInfo = $pageItem;
  let activeModal = false;
  const pageTypes = ["outline", "mindmap", "affinity map"];

  async function remove() {
    let notebook = pageInfo.notebook.id;
    goto(`notebooks/${pageInfo.notebook.shortId}`);

    try {
      await fetch(`/api/pages/${$page.params.pageId}`, {
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
  :global(.pageWorkspace .content.unfinished) {
    grid-column: inherit;
    background: #f9fbfc;
  }
  .Page {
    width: 100%;
    display: grid;
    grid-column: inherit;
    gap: 70px;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 40px;
    text-align: center;
    transform: translate(-50%, -50%);
  }
  .PageType {
    display: grid;
    gap: 100px;
    justify-content: center;
    grid-template-columns: repeat(3, 200px);
  }
  @media (min-width: 641px) and (max-width: 920px) {
    :global(.pageWorkspace .content.unfinished) {
      height: 100vh;
    }
    .PageType {
      gap: 30px;
    }
    .PageType {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (max-width: 640px) {
    .Page {
      gap: 30px;
      left: inherit;
      top: inherit;
      display: grid;
      grid-column: inherit;
      position: inherit;
      transform: translate(0, 0);
    }
    .PageType {
      gap: 20px;
      grid-template-columns: 1fr;
    }
  }
</style>

{#if pageInfo.type === 'loading'}
  <Loader />
{:else}
  <History />
  <div class="Page">
    <PageTitle {pageInfo} bind:activeModal />
    <div class="PageType">
      {#each pageTypes as type}
        <PageTypeCard
          {type}
          {pageInfo}
          context={pageInfo.noteContexts.find((item) => item.type === type)} />
      {/each}
    </div>
  </div>
{/if}
{#if activeModal}
  <DeletionModalPage {remove} bind:activeModal type="page" {pageInfo} />
{/if}
