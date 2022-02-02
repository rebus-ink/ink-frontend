<script>
  import NewNotebook from "./NewNotebook.svelte";
  import NotebooksList from "./NotebooksList.svelte";
  import SingleNotebook from "./singleNotebook/SingleNotebook.svelte";
  import History from "../widgets/History.svelte";
  import NavNotebook from "../img/NavNotebook.svelte";
  export let id;
  export let noteId;
</script>

<style>
  .Toolbar {
    display: flex;
    top: 0;
    position: relative;
    justify-content: space-between;
    background-color: #ffffff;
    z-index: 3;
    padding: 20px calc(var(--base) * 2) 0;
  }
  nav.Toolbar::before {
    content: "";
    background: #ffffff;
    width: 80px;
    height: 130px;
    position: absolute;
    top: 0;
    left: -80px;
  }
  .Toolbar section {
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  .Toolbar section * {
    float: left;
  }
  .library :global(svg) {
    width: 16px;
    margin-right: 5px;
    float: left;
  }
  .library h3 {
    font-weight: 600;
    margin: 0;
  }
  @media (max-width: 720px) {
    nav.Toolbar::before {
      content: none;
    }
    .Toolbar {
      position: relative;
      padding: calc(var(--base) * 1.5) calc(var(--base) * 2);
    }
    .Toolbar:first-child:nth-last-child(5) :global(.new-button) {
      display: none;
    }
    .Toolbar section {
      display: table;
      width: 100%;
      text-align: center;
    }
    .library {
      float: inherit !important;
      display: inline-table;
    }
  }
  .Body {
    display: grid; /*
    grid-gap: 1rem;*/
  }
</style>

{#if !id}
  <nav class="Toolbar">
    <section>
      <History />
      <div class="library">
        <NavNotebook />
        <h3>Notebooks library</h3>
      </div>
    </section>
    <NewNotebook />
  </nav>
{/if}

<div class="Body">
  {#if !id}
    <div class="notesList">
      <NotebooksList />
    </div>
  {:else}
    <SingleNotebook />
  {/if}
</div>
