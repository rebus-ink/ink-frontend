<script>
  import Closer from "../widgets/Closer.svelte";
  import PageTypeCard from "./Tools/PageTypeCard.svelte";
  import { getToken } from "../../getToken";
  import { page } from "../../stores";
  import { goto } from "@sapper/app";

  export let open;
  export let ntbkClose;

  const pageTypes = ["outline", "mindmap", "affinity map"];
  async function submit(event) {
    event.preventDefault();
    ntbkClose();

    try {
      const payload = Object.assign(
        {},
        { name: `Page`, notebookId: $page.params.id }
      );

      await window
        .fetch(`/api/outlines`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "csrf-token": getToken(),
          },
        })
        .then((e) => {
          goto(e.url);
        });
    } catch (err) {
      console.error(err);
    }
  }

</script>

<style>
  .NewBox {
    position: absolute;
    background-color: var(--workspace-color);
    color: #fff;
    left: 20px;
    width: calc(100% - 40px);
    top: 20px;
    z-index: 3;
    border-radius: 30px;
    padding: 30px 40px;
  }
  :global(.Button) {
    float: right;
  }
  .newNote :global(button.Closer) {
    width: 125px;
    height: 34px;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .newNote :global(.Closer::after) {
    content: "Cancel";
    color: var(--main-background-color);
  }
  :global(.Closer:hover::after) {
    text-decoration: underline;
  }
  :global(.Closer svg) {
    display: none;
  }
  @media (max-width: 720px) {
    .NewBox {
      left: 0;
      top: 0;
      border-radius: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      position: fixed;
      align-items: center;
      display: flex;
    }
    :global(button.Closer),
    :global(button.Submit) {
      width: 50%;
      padding: 15px 0 !important;
      margin: 0 !important;
      font-size: 0.9rem;
      border-radius: 20px !important;
    }
  }
  .NewBox {
    display: grid;
    gap: 20px;
  }
  .PageType {
    display: grid;
    gap: 40px;
    justify-content: center;
    grid-template-columns: repeat(3, 1fr);
  }
  .NewBox .PageType ~ :global(.Closer) {
    margin-left: auto;
  }
</style>

{#if open}
  <div class="NewBox newNote">
    <div class="PageType">
      {#each pageTypes as type}
        <PageTypeCard {type} {submit} />
      {/each}
    </div>
    <Closer
      click={() => {
        ntbkClose('cancel');
      }}
      dark={true} />
  </div>
{/if}
