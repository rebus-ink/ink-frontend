<script>
  import IcoNotebook from "../../img/IcoNotebook.svelte";
  import NavSource from "../../img/NavSource.svelte";
  import SearchNotebooks from "../../notebooks/SearchNotebooks.svelte";
  import { noteAddNotebooks } from "../../../stores/note/notebooks.js";
  import { page } from "../../../stores";
  import Search from "../../widgets/Search.svelte";
  import { noteAddSources } from "../../../stores/note/sources.js";
  import Loader from "../../widgets/Loader.svelte";

  export let itemsArr;
  export let itemInfo; //This will change when backends sends the source info
  export let assignItem; //Add notebook or replace source
  export let type;

  let clicked;
  $: itemsLoader =
    type === "source" ? $noteAddSources.type : $noteAddNotebooks.type;

  let Searcher = (type) => {
    return type === "source" ? Search : SearchNotebooks;
  };

  let addNotebook = (item) => {
    assignItem = [...assignItem, item];
  };

  let addSource = (item) => {
    assignItem = item;
    clicked = true;
  };

  $: if (type === "source" && $page.path && !clicked) {
    assignItem = "";
    clicked = false;
  }
</script>

<style>
  ul,
  ul p {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  p {
    text-overflow: ellipsis;
    font-size: 0.8rem !important;
    font-weight: 500;
    color: #333;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: inherit;
  }
  ul {
    display: none;
    background: #ffffff;
    position: absolute;
    width: 50%;
    top: 40px;
    left: 0;
    z-index: 2;
    padding: 0;
    border-radius: 10px;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    max-height: 300px;
    overflow-y: scroll;
  }
  .SearchSources {
    top: 30px;
  }
  ul:focus-within,
  ul:active {
    display: block;
  }
  .SearchSources li {
    grid-template-columns: 10px 1fr;
    padding: 10px;
  }
  .SearchSources li:hover {
    background: #f6f6f6;
  }
  .SearchSources li :global(svg) {
    width: 10px;
    height: auto;
  }
  ul :global(.SearchBox) {
    width: calc(100% - 10px);
    border-radius: 10px;
    margin: 5px;
  }
  ul li {
    display: grid;
    grid-template-columns: 20px 1fr;
    float: left;
    width: calc(100% - 10px);
    border-radius: 10px;
    padding: 5px 10px;
    align-items: center;
    grid-gap: 5px;
    cursor: pointer;
    margin: 0 5px;
    background: transparent;
    transition: all 0.2s ease;
  }
  ul li:last-child {
    margin-bottom: 5px;
  }
  ul .OnlyItem {
    display: none;
  }
  ul li:only-of-type {
    display: block;
  }
  ul.SearchNotebooks :global(.SearchBox),
  ul.SearchSources :global(.SearchBox) {
    position: relative;
    left: 0;
  }
</style>

<ul class={`Search${type.charAt(0).toUpperCase()}${type.slice(1)}s`}>
  <svelte:component this={Searcher(type)} />
  {#if itemsLoader && itemsLoader === 'loading'}
    <Loader />
  {:else}
    <li class="OnlyItem">
      <p>No {type}s found</p>
    </li>
    {#each itemsArr as li}
      {#if type === 'source'}
        {#if (!itemInfo && !assignItem) || (!assignItem && itemInfo && itemInfo.shortId !== li.shortId) || (!itemInfo && assignItem && assignItem.shortId !== li.shortId) || (itemInfo && assignItem && assignItem.shortId !== li.shortId && itemInfo.shortId !== li.shortId)}
          <li on:click={addSource(li)}>
            <NavSource />
            <p>{li.name}</p>
          </li>
        {/if}
      {:else if (!itemInfo.length && !assignItem.length) || (!assignItem.length && itemInfo.length && !itemInfo.find((notebook) => notebook.id === li.id)) || (!itemInfo.length && assignItem.length && !assignItem.find((notebook) => notebook.id === li.id)) || (itemInfo.length && assignItem.length && !itemInfo.find((notebook) => notebook.id === li.id) && !assignItem.find((notebook) => notebook.id === li.id))}
        <li
          class={li && li.settings && li.settings.colour}
          on:click={addNotebook(li)}>
          <span>
            <IcoNotebook />
          </span>
          <p>{li.name}</p>
        </li>
      {/if}
    {/each}
  {/if}
</ul>
