<script>
  import { page, addSelected, removeSelected } from "../../stores";
  import IcoNotebook from "../img/IcoNotebook.svelte";
  import DateFormat from "../widgets/Date.svelte";

  export let notebook = {};
  export let selecting;
  export let selection = function() {};
  export let selectAll;

  let selected = false;

  $: if (!selecting && selected) selected = false;
  $: if (selected && notebook.id) addSelected(notebook);
  else removeSelected(notebook);

  $: selectable =
    $page.path === "/notebooks" || $page.path === "/notebooks/" ? true : false;

  $: if (selectAll) {
    selected = true;
    selection();
  }
</script>

<style>
  .Item {
    display: grid;
    grid-template-rows: 150px auto;
    background-color: #fff;
    border: 1px solid #eeeeee;
    overflow: hidden;
    position: relative;
    border-radius: 15px;
    -webkit-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
    -moz-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
  }
  a {
    text-decoration: inherit !important;
    color: inherit;
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  /* -------------- Input -------------- */
  .BulkSelector {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    -webkit-appearance: none;
    outline: none;
    /* You need to set border to none as well as inputs in Mobile Safari's default stylesheet have a border */
    border: none;
    cursor: pointer;
    z-index: 2;
  }
  .BulkSelector::before,
  .BulkSelector::after {
    content: "";
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    border-radius: 50%;
    position: absolute;
    transition: all 0.25s ease-out;
  }
  .BulkSelector::before {
    width: 14px;
    height: 14px;
    border: 1px solid var(--workspace-color);
    background: #ffffff;
  }
  .BulkSelector::after {
    width: 8px;
    height: 8px;
    background: transparent;
  }
  .BulkSelector:checked::after {
    background: var(--workspace-color);
  }
  /* ---------- Cover image --------------*/
  .Img {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
  .Info {
    display: grid;
    grid-template-columns: 34px 1fr;
    padding: 20px;
    grid-gap: 10px;
    min-width: 0;
  }
  .Icon {
    border-radius: 50%;
    width: 34px;
    height: 34px;
    position: relative;
    background: var(--main-background-color);
  }
  h5 {
    font-weight: 600;
    margin: 0;
  }
  p {
    color: #888888;
    font-size: var(--item-font-size);
    margin: 0;
  }
  .Icon :global(svg) {
    width: 15px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    color: var(--workspace-color);
    transform: translate(-50%, -50%);
  }
  .name,
  .Date {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .InfoContent {
    overflow: hidden;
  }
  @media (min-width: 721px) {
    div.NotebookCard:only-child {
      width: calc(50% - var(--base) / 2) !important;
    }
  }
</style>

<div class="Item NotebookCard {notebook.settings.colour}">
  <a href={`notebooks/${notebook.shortId}`}>{notebook.name}</a>
  {#if selectable}
    <input
      class="BulkSelector"
      type="checkbox"
      bind:checked={selected}
      on:click={() => selection()} />
  {/if}
  {#if notebook.settings.coverImg}
    <div
      class="Img"
      style={`background-image: url("/img/NotebookImg/${notebook.settings.coverImg}.jpg")`} />
  {:else}
    <div class="Img" style={'background-image: url("/img/NotebookImg/mike-c-s-7HlJkjH3k60.jpg")'} />
  {/if}
  <div class="Info">
    <div class="Icon {notebook.settings.colour}">
      <IcoNotebook />
    </div>
    <div class="InfoContent">
      <h5 class="name">{notebook.name}</h5>
      <p class="Date">
        <DateFormat updated={notebook.updated} published={notebook.published} />
      </p>
    </div>
  </div>
</div>
