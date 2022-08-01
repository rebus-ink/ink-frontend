<script>
  import { noteAddSources } from "../../../stores/note/sources.js";
  import ListAssigment from "./ListAssigment.svelte";
  import NavSource from "../../img/NavSource.svelte";
  import ArrowDropDown from "../../img/ArrowDropDown.svelte";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import IcoRevert from "../../img/IcoRevert.svelte";

  export let highlight;
  export let noteTest;
  export let replaceSource;

  let removeSource = false;
  $: sourceList = $noteAddSources.items;
  $: sourceInfo = noteTest.source || "";

  let revertAll = () => {
    replaceSource = "";
    removeSource = false;
  };

  let removeCurrentSource = () => {
    removeSource = true;
    replaceSource = "remove";
  };
</script>

<style>
  .Sources {
    position: relative;
    z-index: 1;
  }
  .NewSource:not(.Empty) {
    width: 20px;
    height: 26px;
    margin-right: 0;
    background: transparent;
    border: none;
  }
  .NewSource :global(svg) {
    color: var(--workspace-color);
    right: inherit;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
  }
  .NewSource.Empty ~ :global(.SearchSources) {
    top: 35px;
  }
  .SourceCont {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr max-content;
    grid-gap: 5px 8px;
    background: var(--main-background-color);
    border: 1px solid #dde8ed;
    border-radius: 8px;
    padding: 0 12px;
    float: left;
    text-decoration: none;
    max-width: 60%;
  }
  .SourceCont.Highlighted {
    padding: 3px 12px;
    grid-template-columns: max-content;
  }
  .Source {
    display: grid;
    align-items: center;
    grid-template-columns: 10px 1fr;
    grid-gap: 5px 8px;
    float: left;
    text-decoration: none;
  }
  .Source:hover p {
    text-decoration: underline;
  }
  .Source > :global(svg) {
    width: 10px;
    height: auto;
    color: var(--workspace-color);
  }
  .Source p,
  :global(.SearchSources li p),
  .NewSource p {
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
  .deleteSource {
    opacity: 0.3;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .deleteSource:hover {
    opacity: 1;
  }
  .deleteSource :global(svg) {
    color: var(--workspace-color);
  }
  :global(.SearchSources span) {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    float: left;
    position: relative;
  }
  :global(.SearchSources span svg) {
    width: 8px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .NewSource:focus-within ~ :global(.SearchSources),
  .NewSource:active ~ :global(.SearchSources) {
    display: block;
  }
  .NewSource {
    border: 1px solid #dde8ed;
    width: 34px;
    height: 34px;
    position: relative;
    float: left;
    background: var(--main-background-color);
    border-radius: 50%;
    margin-right: 10px;
  }
  .NewSource input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
  }
  span.NewSource.Empty::before,
  span.NewSource.Empty::after {
    content: "";
    width: 35%;
    height: 2px;
    background: var(--workspace-color);
    position: absolute;
    border-radius: 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  span.NewSource.Empty::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  span.NewSource.Empty {
    width: max-content;
    border-radius: 10px;
    padding: 0 10px 0 25px;
    display: grid;
    align-items: center;
    height: 30px;
  }
  span.NewSource.Empty p {
    color: var(--workspace-color);
  }
  span.NewSource.Empty::before,
  span.NewSource.Empty::after {
    width: 10px;
    left: 15px;
  }
  .Replace {
    border: 1px solid var(--workspace-color);
  }
  .Replace .deleteSource {
    opacity: 1;
  }
  .Remove {
    background: rgba(241, 245, 248, 1);
    border: 1px solid rgba(221, 232, 237, 1);
  }
  .Remove a {
    opacity: 0.5;
  }
  .Remove .deleteSource {
    opacity: 1;
  }
  .Replace .deleteSource :global(svg),
  .Remove .deleteSource :global(svg) {
    width: 15px;
    transform: translateY(2px);
  }
  .SourceCont .deleteSource span {
    display: block;
    width: 12px;
    height: 12px;
    position: relative;
    transform: rotate(45deg);
  }
  .SourceCont .deleteSource span::before,
  .SourceCont .deleteSource span::after {
    content: "";
    width: 80%;
    height: 2px;
    border-radius: 10px;
    position: absolute;
    background: var(--workspace-color);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .SourceCont .deleteSource span::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .EmptySource {
    height: 30px;
  }
</style>

<div class="Sources">
  {#if !replaceSource && sourceInfo}
    <div
      class="SourceCont {highlight ? 'Highlighted' : replaceSource ? 'Replace' : removeSource ? 'Remove' : ''}">
      <a href="sources/{sourceInfo.shortId}" class="Source">
        <NavSource />
        <p>{sourceInfo.name}</p>
      </a>
      {#if !highlight}
        {#if removeSource}
          <div class="deleteSource" on:click={revertAll}>
            <IcoRevert />
          </div>
        {:else}
          <div class="deleteSource" on:click={removeCurrentSource}>
            <IcoDelete />
          </div>
        {/if}
      {/if}
    </div>
  {:else if replaceSource}
    <div
      class="SourceCont Replace {highlight ? 'Highlighted' : replaceSource === 'remove' ? 'Remove' : ''}
      EmptySource">
      <a href="sources/{replaceSource.shortId}" class="Source">
        <NavSource />
        <p>
          {replaceSource === 'remove' ? sourceInfo.name : replaceSource.name}
        </p>
      </a>
      <div class="deleteSource" on:click={revertAll}>
        {#if sourceInfo}
          <IcoRevert />
        {:else}
          <span />
        {/if}
      </div>
    </div>
  {/if}
  {#if !highlight}
    <span class="NewSource {sourceInfo || replaceSource ? '' : 'Empty'}">
      <input type="text" readonly />
      {#if sourceInfo || replaceSource}
        <ArrowDropDown />
      {:else}
        <p>Add a source</p>
      {/if}
    </span>
  {/if}
  <ListAssigment
    itemsArr={sourceList}
    itemInfo={sourceInfo}
    bind:assignItem={replaceSource}
    type="source" />
</div>
