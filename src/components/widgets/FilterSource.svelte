<script>
  import { collections } from "../../stores";
  import IcoSearch from "../img/IcoSearch.svelte";
  import IcoNotebook from "../img/IcoNotebook.svelte";
  import ArrowDropDown from "../img/ArrowDropDown.svelte";
  import Stack from "../img/IcoStack.svelte";
  import { page } from "../../stores";
  import { goto } from "@sapper/app";
  import { noteAddNotebooks } from "../../stores/note/notebooks.js";
  import SearchNotebooks from "../notebooks/SearchNotebooks.svelte";
  import Loader from "./Loader.svelte";

  $: getNotebook = notebookArr.find(
    item => $page.query.notebook === item.shortId
  );
  $: notebookArr = $noteAddNotebooks.items;
  let notebookInput;

  let currentNotebook;
  $: if (getNotebook) currentNotebook = getNotebook;
  $: if (!$page.query.notebook) currentNotebook = undefined;

  let stackInput, typeInput;
  let types = [
    "Article",
    "Blog",
    "Book",
    "Chapter",
    "Collection",
    "Comment",
    "Conversation",
    "Course",
    "Dataset",
    "Drawing",
    "Episode",
    "Manuscript",
    "Map",
    "MediaObject",
    "MusicRecordig",
    "Painting",
    "Photograph",
    "Play",
    "Poster",
    "PublicationIssue",
    "PublicationVolume",
    "Review",
    "ShortStory",
    "Thesis",
    "VisualArtwork",
    "WebContent"
  ];

  let unFilterIt = a => {
    let queries = Object.assign({}, $page.query);
    delete queries[a];
    queries.page = 1;
    let mark = Object.keys(queries).length ? "?" : "";
    goto(`${$page.path}${mark}${new URLSearchParams(queries).toString()}`);
  };

  let filterIt = (a, b) => {
    let queries = Object.assign({}, $page.query);
    queries[a] = b;
    queries.page = 1;
    goto(`${$page.path}?${new URLSearchParams(queries).toString()}`);
  };

  $: currentType = $page.query.type;
  $: currentStack = $page.query.stack;
</script>

<style>
  .filter {
    position: relative;
  }
  p {
    font-size: 0.75rem;
    color: var(--workspace-color);
    font-weight: 600;
    margin: 0;
  }
  .inputs {
    border: 1px solid #dde8ed;
    background: #ffffff;
    border-radius: 10px;
    padding: 4px 15px 0 4px;
    position: relative;
    margin-top: 3px;
    cursor: pointer;
    float: left;
    width: 100%;
  }
  .inputs:active ~ ul {
    display: none !important;
  }
  .query {
    font-weight: 500;
    border: 1px solid #dde8ed;
    border-radius: 6px;
    padding: 2px 0 2px 4px;
    line-height: 18px;
    background: var(--main-background-color);
    position: relative;
    margin-right: 4px;
    margin-bottom: 4px;
    z-index: 2;
    float: left;
    align-items: center;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-gap: 3px;
  }
  .query span.Remove {
    width: 18px;
    height: 18px;
    float: right;
    margin-left: 1px;
    position: relative;
  }
  .query p {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: inherit;
  }
  .query span.Remove::before,
  .query span.Remove::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--workspace-color);
    border-radius: 10px;
  }
  .query span.Remove::before {
    width: 50%;
    height: 2px;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .query span.Remove::after {
    width: 2px;
    height: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .arrow {
    position: absolute;
    right: 8px;
    top: 10px;
    color: var(--action);
  }
  .inputs .placeholder {
    color: #bbd2db;
    font-weight: 400;

    padding: 2px 2px 2px 4px;
    line-height: 18px;
    margin-bottom: 4px;
    float: left;
  }
  .placeholder :global(svg) {
    float: left;
    margin-top: 4px;
    margin-right: 5px;
    height: 11px;
  }
  ul {
    display: none;
    position: absolute;
    z-index: 2;
    bottom: 0;
    width: 100%;
    transform: translateY(calc(100% + 5px));
    background: #ffffff;
    list-style: none;
    padding: 0;
    border-radius: 10px;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
    margin: 5px 0 0;
    right: 0;
    border: 1px solid #eee;
    max-height: 300px;
    overflow-y: scroll;
  }
  input.btn {
    outline: none;
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% - 19px);
    margin-top: 19px;
    opacity: 0;
    z-index: 1;
  }
  .filter:focus-within ul,
  .filter:active ul {
    display: block;
  }
  li {
    display: grid;
    grid-template-columns: 20px 1fr;
    float: left;
    padding: 5px 10px;
    align-items: center;
    grid-gap: 5px;
    cursor: pointer;
    margin: 0 5px;
    background: transparent;
    transition: all 0.2s ease;
    width: calc(100% - 10px);
    border-radius: 10px;
  }
  li:first-of-type {
    margin-top: 5px;
  }
  li:last-child {
    margin-bottom: 5px;
  }
  li:hover {
    background: var(--main-background-color);
  }
  :global(.SearchNotebooks li p),
  li p {
    text-overflow: ellipsis;
    font-size: 0.8rem;
    font-weight: 500;
    color: #333;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: inherit;
  }
  .Icon {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    float: left;
    position: relative;
    background: var(--main-background-color);
    border-radius: 50%;
    text-align: center;
  }
  ul .Icon :global(svg) {
    width: 9px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  /*------------- Notebooks Colours ---------------*/
  .notebook .query {
    border: none;
  }
  .notebook .query :global(svg) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: auto;
  }
  .notebook .query .Icon {
    background: #ffffff;
  }
  .notebook .notebook li:hover .Icon,
  .notebook .notebook .query .Icon {
    background: #ffffff !important;
  }
  .notebook .query.colour1 span.Remove::before,
  .notebook .query.colour1 span.Remove::after {
    background: #a43939;
  }
  .notebook li.colour1:hover,
  .notebook li.colour1 .Icon,
  .notebook .query.colour1 {
    background: #f5d2d2;
  }
  .notebook .query.colour1 .Icon :global(svg),
  .notebook li.colour1 .Icon :global(svg) {
    color: #a43939;
  }
  .notebook .query.colour2 span.Remove::before,
  .notebook .query.colour2 span.Remove::after {
    background: #6f4c9b;
  }
  .notebook li.colour2:hover,
  .notebook li.colour2 .Icon,
  .notebook .query.colour2 {
    background: #d4ccea;
  }
  .notebook .query.colour2 .Icon :global(svg),
  .notebook li.colour2 .Icon :global(svg) {
    color: #6f4c9b;
  }
  .notebook .query.colour3 span.Remove::before,
  .notebook .query.colour3 span.Remove::after {
    background: #8f7000;
  }
  .notebook li.colour3:hover,
  .notebook li.colour3 .Icon,
  .notebook .query.colour3 {
    background: #cceadf;
  }
  .notebook .query.colour3 .Icon :global(svg),
  .notebook li.colour3 .Icon :global(svg) {
    color: #8f7000;
  }
  .notebook .query.colour4 span.Remove::before,
  .notebook .query.colour4 span.Remove::after {
    background: #4c9b92;
  }
  .notebook li.colour4:hover,
  .notebook li.colour4 .Icon,
  .notebook .query.colour4 {
    background: #cceadf;
  }
  .notebook .query.colour4 .Icon :global(svg),
  .notebook li.colour4 .Icon :global(svg) {
    color: #4c9b92;
  }
  /*------------- Stack List ---------------*/
  .stack li {
    grid-gap: 10px;
  }
  .stack .query .Icon {
    width: 14px;
  }
  .stack .query .Icon :global(svg) {
    width: 14px;
    height: auto;
    transform: translateY(1px);
  }
  .stack li:hover .Icon {
    border: none;
  }
  /*------------- Type List ---------------*/
  .type li {
    grid-template-columns: 1fr;
  }
  /*------------- Notebooks Colours ---------------*/
  ul :global(.SearchBox),
  .SearchBox {
    width: calc(100% - 10px);
    border-radius: 10px;
    margin: 5px;
    position: relative;
    height: 34px;
    left: 0;
    background: var(--main-background-color);
  }
  .SearchBox input {
    font-family: var(--sans-fonts);
    font-size: var(--item-font-size);
    border: none;
    font-weight: 700;
    background: transparent;
    position: absolute;
    top: 50%;
    left: 40px;
    width: calc(100% - 50px);
    height: 100%;
    transform: translateY(-50%);
    color: var(--action);
    transition: all 0.25s ease-out;
    outline: none;
    margin: 0;
  }
  .SearchBox input::placeholder {
    color: var(--action);
    font-weight: 500;
    opacity: 0.6;
  }
  .SearchBox :global(svg) {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    margin: 0;
    width: 15px;
    height: 15px;
  }
</style>

<div class="filter notebook">
  <p>Notebook</p>
  <input class="btn" readonly />
  <div class="inputs">
    {#if !currentNotebook}
      <p class="placeholder">
        <IcoNotebook />
        Choose notebook
      </p>
    {:else}
      <p class="query {currentNotebook.settings.colour}">
        <span class="Icon">
          <IcoNotebook />
        </span>
        {currentNotebook.name}
        <span class="Remove" on:click={() => unFilterIt('notebook')} />
      </p>
    {/if}
    <ArrowDropDown />
  </div>
  <ul>
    <SearchNotebooks />
    {#if $noteAddNotebooks.type === 'loading'}
      <Loader />
    {:else if notebookArr.length}
      {#each notebookArr as notebook}
        {#if (!currentNotebook || currentNotebook.shortId !== notebook.shortId) && (!notebookInput || notebook.name
              .toLowerCase()
              .includes(notebookInput.toLowerCase()))}
          <li
            class={notebook.settings.colour}
            on:click={() => filterIt('notebook', notebook.shortId)}>
            <span class="Icon">
              <IcoNotebook />
            </span>
            <p class={notebook.settings.colour}>{notebook.name}</p>
          </li>
        {/if}
      {/each}
    {/if}
  </ul>
</div>

<div class="filter stack">
  <p>Stack</p>
  <input class="btn SearchBox" readonly />
  <div class="inputs">
    {#if !currentStack}
      <p class="placeholder">
        <Stack />
        Choose stack
      </p>
    {:else}
      <p class="query {currentStack}">
        <span class="Icon">
          <Stack />
        </span>
        {currentStack}
        <span class="Remove" on:click={() => unFilterIt('stack')} />
      </p>
    {/if}
    <ArrowDropDown />
  </div>
  <ul>
    <div class="SearchBox">
      <IcoSearch />
      <input
        placeholder="Filter by stack..."
        bind:value={stackInput}
        class="SearchBox" />
    </div>
    {#each $collections as stack}
      {#if currentStack !== stack.name && (!stackInput || stack.name
            .toLowerCase()
            .includes(stackInput.toLowerCase()))}
        <li on:click={() => filterIt('stack', stack.name)}>
          <span class="Icon">
            <Stack />
          </span>
          <p class={stack.name}>{stack.name}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>

<div class="filter type">
  <p>Type</p>
  <input class="btn" readonly />
  <div class="inputs">
    {#if !currentType}
      <p class="placeholder">Choose type</p>
    {:else}
      <p class="query {currentType}">
        {currentType}
        <span class="Remove" on:click={() => unFilterIt('type')} />
      </p>
    {/if}
    <ArrowDropDown />
  </div>
  <ul>
    <div class="SearchBox">
      <IcoSearch />
      <input placeholder="Filter by type..." bind:value={typeInput} />
    </div>
    {#each types as type}
      {#if currentType !== type && (!typeInput || type
            .toLowerCase()
            .includes(typeInput.toLowerCase()))}
        <li on:click={() => filterIt('type', type)}>
          <p class={type.replace(' ', '')}>{type}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>
