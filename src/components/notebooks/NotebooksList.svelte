<script>
  import { notebooks, clearSelected, selectedItems } from "../../stores";
  import NotesListFooter from "../notes/notesListFooter/NotesListFooter.svelte";
  import SortSelect from "../library/SortSelect.svelte";
  import NoNotebooks from "../img/NoNotebooks.svelte";
  import SearchNotebooks from "./SearchNotebooks.svelte";
  import PaginationButtons from "../widgets/PaginationButtons.svelte";
  import NotebookCard from "./NotebookCard.svelte";

  import { stores } from "@sapper/app";
  const { page } = stores();
  let items;

  $: items = $notebooks ? $notebooks.items : [];
  $: query = Object.assign({}, $page.query) || "";

  let selecting = true;
  let selection = function() {
    selectAll = false;
    if (!selecting) selecting = true;
  };

  $: selectable =
    $page.path === "/notebooks/" || $page.path === "/notebooks" ? true : false;
  $: if (!selectable) {
    clearSelected();
  }

  //clearSelected();

  let selectAll = false;
  let chooseAll = () => {
    if ($selectedItems.size !== items.length) selectAll = true;
  };
  $: fullList = $selectedItems.size == items.length ? true : false;
</script>

<style>
  :root {
    --list-template-columns: 60px 1fr 1fr 0.5fr 0.5fr 2rem;
    --item-font-size: 0.7rem;
    --list-grid-gap: calc(var(--base) * 0.5);
  }
  .Cards {
    position: relative;
    display: grid;
    padding: calc(var(--base) * 2);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: var(--base);
    z-index: 0;
    grid-auto-rows: max-content;
  }
  .CardHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--item-font-size);
    position: relative;
    background-color: #ffffff;
    z-index: 2;
    padding: 20px 40px 10px;
    border-bottom-right-radius: 50px;
    -webkit-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
    -moz-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
  }
  .Loading {
    width: 2rem;
    height: 2rem;
    border-radius: 100%;
    background-color: transparent;
    box-shadow: 0 0 2px #f0f0f0, 0 0 4px var(--workspace-color);
    margin: 8rem auto;
    animation-duration: 1s;
    animation-name: loading;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    opacity: 0.5;
    grid-column: 1 / -1;
  }
  @keyframes loading {
    from {
      transform: scale(0.5);
      box-shadow: 0 0 2px #f0f0f0, 0 0 4px var(--workspace-color);
    }
    to {
      transform: scale(1.5);
      box-shadow: 0 0 0 3px var(--workspace-color), 0 0 0 20px #f0f0f0;
    }
  }
  .Empty {
    text-align: center;
    color: #c4cdd1;
    grid-column: 1 / -1;
  }
  .Empty {
    text-align: center;
    color: #c4cdd1;
    grid-column: 1 / -1;
    margin-top: 80px;
  }
  @media (min-width: 641px) and (max-width: 720px) {
    .CardHeader {
      top: 0;
      padding-top: 0;
      position: relative;
    }
  }
  @media (max-width: 640px) {
    .CardHeader {
      padding-top: 50px;
    }
  }
</style>

<div class="CardHeader">
  <div>
    <SortSelect {query} path={$page.path}>Sort By:</SortSelect>
  </div>
  <div>
    <SearchNotebooks />
  </div>
</div>

<div class="Cards">
  {#if $notebooks.type === 'loading'}
    <div class="Loading" />
  {:else}
    {#each items as notebook}
      <NotebookCard {notebook} {selecting} {selection} {selectAll} />
    {:else}
      <div class="Empty">
        <NoNotebooks />
      </div>
    {/each}
  {/if}
</div>
{#if selecting && $selectedItems.size && selectable}
  <NotesListFooter
    type="notebook"
    {chooseAll}
    {fullList}
    endSelection={() => {
      selecting = false;
      clearSelected();
    }} />
{/if}
{#if items && items.length}
  <PaginationButtons itemsLenght={items.length} totalItems={$notebooks.totalItems}/>
{/if}
