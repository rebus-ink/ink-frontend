<script>
  import NavSource from "../../img/NavSource.svelte";
  import { page, addSelected, selectedItems, removeSelected } from "../../../stores";
  export let note = {};
  export let selection = function() {}
  let selected = false
  export let selecting;

  let noted, highlighed, plainHighlight, plainComment;
  $: colour = note.tags.find((colour) => colour.type === "colour") || "";

  $: if (note && note.body && note.body[0]) {
    noted = note.body.find((item) => item.motivation === "commenting");
    highlighed = note.body.find((item) => item.motivation === "highlighting");
  }

  $: if (!selecting && selected) selected = false;

  $: if (highlighed)
    plainHighlight = new DOMParser()
      .parseFromString(highlighed.content, "text/html")
      .querySelector("body").textContent;

  $: if (noted)
    plainComment = new DOMParser()
      .parseFromString(noted.content, "text/html")
      .querySelector("body").textContent;
      
  $: if (selected && note.id) addSelected(note);
    else removeSelected(note);
</script>

<style>
  .Item * {
    margin: 0;
    font-weight: 500;
  }
  .Item {
    background: #ffffff;
    border-radius: 15px;
    padding: 16px 30px 16px 16px;
    display: grid;
    gap: 10px;
    grid-template-rows: max-content;
    position: relative;
  }
  .Item.two {
    grid-template-rows: repeat(2, max-content);
  }
  /* -------------- Highlight -------------- */
  header {
    display: grid;
    grid-template-columns: 4px 1fr;
    grid-gap: 8px;
  }
  header .info {
    display: grid;
    grid-gap: 4px;
  }
  .Page {
    font-size: 0.6rem;
    float: left;
    width: max-content;
    padding: 0 8px;
    border-radius: 5px;
    align-items: center;
    display: flex;
    color: #ffffff;
  }
  .Highlight {
    font-size: 0.75rem;
    line-height: 0.9rem;
    color: #333333;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .noNote {
    -webkit-line-clamp: 8;
  }
  .Source {
    display: grid;
    align-items: center;
    grid-template-columns: 10px 1fr;
    grid-gap: 5px;
  }
  .Source :global(svg) {
    width: 10px;
    height: auto;
    color: var(--workspace-color);
  }
  .Source p {
    font-size: 0.7rem;
    font-weight: 400;
    color: #333333;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .BulkSelector {
    position: absolute;
    left: 0;
    top: auto;
    width: 40px;
    height: 40px;
    -webkit-appearance: none;
    /* You need to set border to none as well as inputs in Mobile Safari's default stylesheet have a border */
    border: none;
    outline: none;
    cursor: pointer;
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
    border: 1px solid #888888;
    background: #ffffff;
  }
  .BulkSelector::after {
    width: 8px;
    height: 8px;
    background: transparent;
  }
  .BulkSelector:checked::after {
    background: #888888;
  }

  /* -------------- Note -------------- */
  .Note,
  .Highlight {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.75rem;
    line-height: 0.9rem;
    margin: 0;
    color: #333333;
  }
  /* ------------ No colour ------------ */
  .Item {
    padding-left: 35px;
    border: 1px solid #cccccc;
  }
  .Item header .column {
    background: #999999;
  }
  /* ------------ Colour 1 ------------ */
  .colour1 {
    border: 1px solid #ffe4cb;
  }
  .colour1 header .column {
    background: #fea95b;
  }
  /* ------------ Colour 2 ------------ */
  .colour2 {
    border: 1px solid #fcd5e5;
  }
  .colour2 header .column {
    background: #ff8ebe;
  }
  /* ------------ Colour 3 ------------ */
  .colour3 {
    border: 1px solid #7de8f8;
  }
  .colour3 header .column {
    background: #57cfea;
  }
  /* ------------ Colour 4 ------------ */
  .colour4 {
    border: 1px solid #d3eacc;
  }
  .colour4 header .column {
    background: #81d173;
  }
</style>

<div
  class="Item {colour.name}
  {plainComment && (plainHighlight || note.source) ? 'two' : ''}">
  {#if plainHighlight || note.source}
    <header>
      <!-- bulk add to outline -->
      <!-- <input
      class="BulkSelector"
      type="checkbox"
      bind:checked={selected}
      on:click={() => selection()} /> -->
      <div class="column" /> 
      
      <div class="info">
        {#if plainHighlight}
          <p class="Highlight {noted && noted.content ? '' : 'noNote'}">
            {plainHighlight}
          </p>
        {/if}
        {#if note.source && note.source.name}
          <div class="Source">
            <NavSource />
            <p>{note.source.name}</p>
          </div>
        {/if}
      </div>
    </header>
  {/if}
  {#if plainComment}
    <!-- bulk add to outline -->
  <!-- <input
  class="BulkSelector"
  type="checkbox"
  bind:checked={selected}
  on:click={() => selection()} /> -->
    <p class="Note">{plainComment}</p>
  {/if}
</div>
