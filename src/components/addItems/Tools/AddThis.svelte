<script>
  import NotesFound from "./NotesFound.svelte";
  export let addItem;
  export let itemType;
  export let removeThis;

  let colour;
  if (itemType === "note") {
    colour = addItem.tags.find(tag => {
      if (tag.name.startsWith("colour")) return tag;
    });
  }
</script>

<style>
  .addThis {
    color: #333333;
    position: absolute;
    width: 100%;
    height: 60px;
    border-radius: 10px;
    background: var(--main-background-color);
    grid-gap: 10px;
    display: grid;
    grid-template-columns: 1fr 30px;
    align-items: center;
    padding: 10px 20px;
  }
  .addThis.colour1 {
    background: #fff9f5;
    border: 2px solid #fea95b;
  }
  .addThis.colour2 {
    background: #fdfafc;
    border: 2px solid #ff8ebe;
  }
  .addThis.colour3 {
    background: #fafeff;
    border: 2px solid #57cfea;
  }
  .addThis.colour4 {
    background: #fafffa;
    border: 2px solid #81d173;
  }
  .addThis.colour1 span {
    background: #d86801;
  }
  .addThis.colour2 span {
    background: #c0004e;
  }
  .addThis.colour3 span {
    background: #0693b2;
  }
  .addThis.colour4 span {
    background: #589b4c;
  }
  span {
    cursor: pointer;
    background: var(--workspace-color);
    width: 30px;
    height: 30px;
    float: left;
    position: relative;
    border-radius: 5px;
  }
  span:hover {
    opacity: 0.8;
  }
  span:before,
  span:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--main-background-color);
    border-radius: 10px;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  span:before {
    width: 50%;
    height: 2px;
  }
  span:after {
    width: 2px;
    height: 50%;
  }
  .addThis :global(li) {
    padding: 0;
    cursor: default;
    grid-gap: 5px;
    background: none !important;
    border-bottom: none !important;
  }
  /*------- Notes -------*/
  .addThis :global(.Highlight),
  .addThis :global(.Note),
  .addThis :global(.Highlight.noNote) {
    -webkit-line-clamp: 1;
  }
  .addThis :global(.Source) {
    display: none;
  }
  .addThis :global(.Highlight.noNote ~ .Source) {
    display: grid;
  }
  .addThis :global(.noHighlight) {
    -webkit-line-clamp: 2;
  }
  /*------- Sources -------*/
  .addThis :global(.SourceList) {
    grid-template-columns: 25px 1fr;
  }
  .addThis :global(li.SourceList) {
    grid-gap: 20px;
  }
</style>

<div
  class="addThis {itemType === 'note' && colour ? colour.name.replace(' ', '') : ''}">
  <NotesFound item={addItem} addThis={false} {itemType} />
  <span on:click={removeThis} />
</div>
