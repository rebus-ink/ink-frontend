<script>
  import SortSelect from "../../library/SortSelect.svelte";
  import SortSelectNotebooks from "./SortSelectNotebooks.svelte";
  import NoNotebooks from "../../img/NoNotebooks.svelte";
  import IcoFilter from "../../img/IcoFilter.svelte";
  import FilterNote from "../../widgets/FilterNote.svelte";
  import FilterSource from "../../widgets/FilterSource.svelte";
  import NotesCard from "../../notes/NotesCard.svelte";
  import Card from "../../library/Card.svelte";
  import PageCard from "../../pages/PageCard.svelte";
  import Loader from "../../widgets/Loader.svelte";
  import NotebookItemsBulk from "./NotebookItemsBulk.svelte";
  import SingleNotebookMenu from "./SingleNotebookMenu.svelte";
  import {
    pages,
    selectedItems,
    clearSelected,
  } from "../../../stores";
  import { stores } from "@sapper/app";
  export let notebook = {};
  export let clickPage;
  const { page } = stores();
  let filterOn = false;
  let clicked = false;
  let Items;
  let menuTabs = "all";
  $: if (notebook && notebook.type !== "loading") {
    if (menuTabs === "all") {
      Items = []
        .concat(notebook.sources)
        .concat(notebook.notes)
        .concat($pages.items);
    } else if (menuTabs === "sources") {
      Items = [].concat(notebook.sources);
    } else if (menuTabs === "notes") {
      Items = [].concat(notebook.notes);
    } else if (menuTabs === "pages") {
      Items = [].concat($pages.items);
    }
  } else {
    Items = "loading";
  }

  $: if (Items !== "loading" || (menuTabs === "all" && !Items[0])) {
    if (menuTabs === "all" && query.dir && query.dir === "asc")
      Items.sort((a, b) => (a.updated > b.updated ? 1 : -1));
    else Items.sort((a, b) => (a.updated > b.updated ? -1 : 1));
  }

  $: query = Object.assign({}, $page.query) || "";

  $: if ((query.stack || query.type || query.flag) && !clicked) filterOn = true;

  let filter = () => {
    filterOn = !filterOn;
    clicked = true;
  };

  let selecting = true;
  let selection = function() {
    if (!selecting) selecting = true;
  };

  let typeOfItem;
  $: if ($selectedItems.size) {
    $selectedItems.forEach((obj) => {
      typeOfItem = obj.noteContexts ? "page" : "items";
    });
  } else {
    typeOfItem = false;
  }
  $: console.log($selectedItems.size)
  $: console.log('typeOfItem', typeOfItem)
</script>

<style>
  :root {
    --list-template-columns: 60px 1fr 1fr 0.5fr 0.5fr 2rem;
    --item-font-size: 0.7rem;
    --list-grid-gap: calc(var(--base) * 0.5);
  }
  .Header > div {
    display: flex;
    align-items: center;
  }
  .Cards {
    position: relative;
    display: grid;
    padding: calc(var(--base) * 2);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: var(--base);
    z-index: 0;
    align-items: center;
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
  .CardHeader :global(ul.Menu) {
    order: 2;
  }
  .EmptyFilter {
    width: 87px;
    height: 34px;
    margin: 0;
    order: 3;
  }
  .filter {
    background: transparent;
    border: 2px solid var(--action);
    border-radius: 10px;
    color: var(--action);
    padding: 7px 15px;
    font-weight: 700;
    position: relative;
    margin: 0;
    float: right;
    display: flex;
    align-items: center;
    cursor: pointer;
    order: 3;
  }
  .filter:not(.active):hover {
    background: var(--main-background-color);
  }
  .filter p {
    font-size: var(--item-font-size);
    margin: 0 8px 0 0;
    float: left;
    font-weight: 600;
  }
  .active p,
  .active > :global(svg) {
    color: #ffffff;
  }
  .active {
    background: var(--action);
  }

  .formFilter {
    background: #f9fbfc;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--base);
    grid-auto-rows: -webkit-max-content;
    grid-auto-rows: max-content;
    margin: 0;
    border-radius: 0 0 50px 0;
    height: 0;
    overflow: hidden;
    position: relative;
    position: relative;
    padding: 0 40px;
    z-index: 1;
    transition: all 0.25s ease-out;
  }
  .formFilter.active {
    height: inherit;
    padding: 20px 40px;
    overflow: inherit;
  }
  .formFilter::before {
    content: "";
    background: #f9fbfc;
    width: 50px;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(-100%);
    height: 0;
    transition: all 0.25s ease-out;
  }
  .formFilter.active::before {
    height: 50px;
  }
  .formFilter :global(.notebook) {
    display: none;
  }
  .Cards > :global(a:only-child) {
    width: calc(50% - (var(--base) / 2));
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
  .Empty :global(svg) {
    width: 50%;
    max-width: 250px;
  }
  button.Item {
    text-decoration: none;
    background-color: #f9fbfc;
    position: relative;
    border: 3px dashed #dde8ed;
    border-radius: 15px;
    padding: 30px 0;
    text-align: center;
    display: grid;
    gap: 20px;
    align-content: center;
    cursor: pointer;
    text-align: center;
    height: 100%;
    box-shadow: 2px 2px 10px 0 rgb(0 0 0 / 3%);
  }
  button.Item span {
    background: var(--action);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: relative;
    margin: 0 auto;
  }
  button.Item span::before,
  button.Item span::after {
    content: "";
    position: absolute;
    width: 40%;
    height: 3px;
    background: #f9fbfc;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  button.Item span::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  button.Item p {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--action);
  }
  @media (min-width: 641px) and (max-width: 720px) {
    .CardHeader {
      top: 0;
      padding-top: 0;
      position: relative;
    }
  }
  @media (max-width: 720px) {
    .CardHeader {
      display: grid;
      grid-template-columns: 1fr max-content;
      row-gap: 30px;
    }
    .formFilter {
      grid-template-columns: 1fr;
    }
  }
  @media (min-width: 721px) {
    :global(.Body:not(.NotesEditor) .Cards .Item:only-child) {
      width: 100%;
    }
    :global(.Body .CardsContent:not(.NotesEditor) .Cards .Item:only-child) {
      width: calc(50% - var(--base) / 2);
    }
  }
</style>

<div class="CardHeader">
  <SingleNotebookMenu
    bind:menuTabs
    shortId={notebook.shortId}
    endSelection={() => {
      selecting = false;
      clearSelected();
    }} />
  <div>
    {#if menuTabs !== 'all'}
      <SortSelect {query} path={$page.path}>Sort By:</SortSelect>
    {:else}
      <SortSelectNotebooks {query} path={$page.path}>
        Sort By:
      </SortSelectNotebooks>
    {/if}
  </div>
  {#if menuTabs === 'hide'}
    <section class="filter {filterOn ? 'active' : ''}" on:click={filter}>
      <p>Filter</p>
      <IcoFilter />
    </section>
  {:else}
    <section class="EmptyFilter" />
  {/if}
</div>
{#if menuTabs !== 'all'}
  <section class="formFilter {filterOn ? 'active' : ''}">
    {#if menuTabs === 'notes'}
      <FilterNote />
    {:else}
      <FilterSource />
    {/if}
  </section>
{/if}

{#if notebook.type === 'loading'}
  <Loader />
{:else}
  <div class="Cards">
    {#if menuTabs === 'pages' || menuTabs === 'all'}
      <button
        class="Item"
        on:click={(e) => {
          e.preventDefault(), (clickPage = true);
        }}>
        <span />
        <p>Create a page</p>
      </button>
    {/if}
    {#if Items[0]}
      {#each Items as item}
        {#if item.body}
          <NotesCard note={item} {selecting} {selection} 
          inNotebook={true} selectAll={false} />
        {:else if item.author}
          <Card {item} {selecting} {selection} inNotebook={true} selectAll={false} />
        {:else if item.notebookId}
          <PageCard {item} {selecting} {selection} />
        {/if}
      {/each}
    {:else}
      <div class="Empty">
        <NoNotebooks />
      </div>
    {/if}
  </div>
{/if}
{#if selecting && typeOfItem}
  <NotebookItemsBulk
    notebook={notebook.shortId}
    {typeOfItem}
    endSelection={() => {
      selecting = false;
      clearSelected();
    }} />
{/if}
