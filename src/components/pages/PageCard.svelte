<script>
  import PageIcoOutline from "../img/PageIcoOutline.svelte";
  import DateFormat from "../widgets/Date.svelte";
  import {
    addSelected,
    removeSelected,
    selectedItems,
    pages,
    page,
  } from "../../stores";
  export let item = {};
  export let selecting;
  export let selection = function() {};

  let selected = false;

  $: if (!selecting && selected) selected = false;
  $: if (selected && item.id) addSelected(item);
  else removeSelected(item);

  let selectable = true;
  $: if ($selectedItems.size) {
    $selectedItems.forEach((obj) => {
      selectable = obj.noteContexts ? true : false;
    });
  } else {
    selectable = true;
  }
  $: outline = item;

</script>

<style>
  .Item,
  .Item * {
    transition: all 0.25s ease-out;
  }
  .Item {
    text-decoration: none;
    background-color: #fff;
    position: relative;
    border: 1px solid #eeeeee;
    border-radius: 15px;
    padding: 20px 30px;
    text-align: center;
    display: grid;
    gap: 20px;
    height: 100%;
    align-items: center;
    grid-template-rows: repeat(2, max-content);
    -webkit-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
    -moz-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
    box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.03);
  }
  .Item > a {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    opacity: 0;
    z-index: 1;
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
    cursor: pointer;
    /* You need to set border to none as well as inputs in Mobile Safari's default stylesheet have a border */
    border: none;
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
  /* -------------------------------- */
  .circle {
    width: 80px;
    height: 80px;
    background: #ebf1f4;
    border-radius: 50%;
    margin: 10px auto 0;
    display: grid;
    align-items: center;
    text-align: center;
  }
  .circle :global(svg) {
    height: 25px;
    width: auto;
    margin: 0 auto;
    color: var(--workspace-color);
  }
  footer *,
  footer :global(ul) {
    margin: 0;
    padding: 0;
  }
  footer {
    display: grid;
    grid-gap: 5px;
    text-align: left;
    margin-top: 10px;
    grid-template-rows: repeat(3, max-content);
  }
  .Title {
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .Title.Error {
    color: #f05657;
  }
</style>

<div class="Item">
  <a
    href={outline ? `outlines/${outline.shortId}?notebook=${item.notebookId}` : $page.path}>
    _
  </a>
  {#if selectable}
    <input
      class="BulkSelector"
      type="checkbox"
      bind:checked={selected}
      on:click={() => selection()} />
  {/if}
  <span class="circle">
    <PageIcoOutline />
  </span>
  {#if outline}
    <footer>
      <h5 class="Title">{outline.name}</h5>
      <!--
      <p class="Type">Outline</p>-->
      <p class="Date">
        <DateFormat updated={outline.updated} published={'None'} />
      </p>
    </footer>
  {:else}
    <footer>
      <h5 class="Title Error">Error</h5>
    </footer>
  {/if}
</div>
