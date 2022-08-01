<script>
  import { typeName } from "../typeName.js";
  import ArrowDropDown from "../img/ArrowDropDown.svelte";
  const types = [
    "Source",
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
    "MusicRecording",
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
  export let dark = false;
  export let noDefault = false;
  export let defaultValue = null;
</script>

<style>
  label,
  select,
  option {
    font-size: 0.85rem;
  }
  select {
    display: inline-block;
    color: rgb(0, 34, 48, 1);
    box-sizing: border-box;
    border: none;
    padding-right: 1.5rem;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: white;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2213%22%20height%3D%228%22%20viewBox%3D%220%200%2013%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6.5%208L0.00480908%200.5L12.9952%200.500001L6.5%208Z%22%20fill%3D%22%23002230%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(180deg, transparent 0, transparent);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 8px auto, 100%;
    position: relative;
    width: 100%;
    padding: calc(var(--base) * 0.5);
    margin: calc(var(--base) * 0.25) 0;
    border-radius: 10px;
    border: 1px solid #eeeeee;
    font-size: 0.85rem;
  }
  select::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 100px solid red;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: var(--rc-main);
    cursor: pointer;
  }
  .LabelText {
    font-weight: 500;
    font-size: 0.8rem;
  }
  label > :global(svg) {
    right: 15px !important;
    top: inherit !important;
    color: #ffffff !important;
    bottom: 18px;
  }
  @media (max-width: 720px) {
    .LabelText {
      font-size: 0.85rem;
    }
  }
</style>

<label class:dark>
  <div class="LabelText">
    <slot />
  </div>
  <ArrowDropDown />
  <select name="pubType" id="select-pubType" value={defaultValue}>
    {#if noDefault}
      <option value="none">None</option>
    {/if}
    {#each types as type}
      <option value={type}>{typeName(type)}</option>
    {/each}
  </select>
</label>
