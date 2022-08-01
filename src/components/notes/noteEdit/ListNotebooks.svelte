<script>
  import { noteAddNotebooks } from "../../../stores/note/notebooks.js";
  import ListAssigment from "./ListAssigment.svelte";
  import IcoNotebook from "../../img/IcoNotebook.svelte";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import IcoRevert from "../../img/IcoRevert.svelte";
  import { page } from "../../../stores";

  export let noteTest;
  export let addNotebook;
  export let removeNotebook;

  $: notebookList = $noteAddNotebooks.items;

  let removeItem = (item) => {
    addNotebook.splice(addNotebook.indexOf(item), 1);
    addNotebook = addNotebook;
  };

  let removeCurrent = (item) => {
    removeNotebook = [...removeNotebook, item];
  };
  let revert = (item) => {
    removeNotebook.splice(removeNotebook.indexOf(item), 1);
    removeNotebook = removeNotebook;
  };

  if ($page.path && addNotebook) addNotebook = [];
</script>

<style>
  ul,
  ul p {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .Notebooks {
    position: relative;
    z-index: 2;
  }
  .currentNotebooks li {
    display: grid;
    grid-template-columns: 1fr max-content;
    float: left;
    max-width: 40%;
    border-radius: 10px;
    padding: 5px 10px;
    align-items: center;
    grid-gap: 10px;
    margin: 0 7px 7px 0;
  }
  .Notebook.colour1,
  :global(.SearchNotebooks .colour1 span),
  :global(.SearchNotebooks li.colour1:hover) {
    background: #f5d2d2;
  }
  .Notebook.colour2,
  :global(.SearchNotebooks .colour2 span),
  :global(.SearchNotebooks li.colour2:hover) {
    background: #d4ccea;
  }
  .Notebook.colour3,
  :global(.SearchNotebooks .colour3 span),
  :global(.SearchNotebooks li.colour3:hover) {
    background: #fae59b;
  }
  .Notebook.colour4,
  :global(.SearchNotebooks .colour4 span),
  :global(.SearchNotebooks li.colour4:hover) {
    background: #cceadf;
  }
  .currentNotebooks a {
    display: grid;
    grid-template-columns: 20px 1fr;
    align-items: center;
    text-decoration: none;
    grid-gap: 5px;
    cursor: pointer;
  }
  .currentNotebooks a:hover p {
    text-decoration: underline;
  }
  .Notebooks p,
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
  .currentNotebooks span,
  :global(.SearchNotebooks span),
  :global(.SearchSources span) {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    float: left;
    position: relative;
  }
  .currentNotebooks span :global(svg),
  :global(.SearchNotebooks span svg),
  :global(.SearchSources span svg) {
    width: 8px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .Notebook .deleteNotebook {
    opacity: 0.5;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .Notebook .deleteNotebook:hover {
    opacity: 1;
  }
  .NewNotebook:focus-within ~ :global(.SearchNotebooks),
  .NewNotebook:active ~ :global(.SearchNotebooks),
  .NewSource:focus-within ~ :global(.SearchSources),
  .NewSource:active ~ :global(.SearchSources) {
    display: block;
  }
  .NewNotebook,
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
  .NewNotebook input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
  }
  span.NewNotebook::before,
  span.NewNotebook::after {
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
  span.NewNotebook::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  span.NewNotebook.Empty {
    width: max-content;
    border-radius: 10px;
    padding: 0 10px 0 25px;
    display: grid;
    align-items: center;
    height: 30px;
  }
  span.NewNotebook.Empty p {
    color: var(--workspace-color);
  }
  span.NewNotebook.Empty::before,
  span.NewNotebook.Empty::after {
    width: 10px;
    left: 15px;
  }
  /*----- Colours -----*/
  .Notebook.colour1 span,
  :global(.SearchNotebooks .colour1:hover span) {
    background: #fcf8f8;
  }
  .Notebook.colour1 :global(svg),
  :global(.SearchNotebooks .colour1 svg) {
    color: #a43939;
  }
  .Notebook.colour2 span,
  :global(.SearchNotebooks .colour2:hover span) {
    background: #faf8fc;
  }
  .Notebook.colour2 :global(svg),
  :global(.SearchNotebooks .colour2 svg) {
    color: #6f4c9b;
  }
  .Notebook.colour3 span,
  :global(.SearchNotebooks .colour3:hover span) {
    background: #fdfaeb;
  }
  .Notebook.colour3 :global(svg),
  :global(.SearchNotebooks .colour3 svg) {
    color: #8f7000;
  }
  .Notebook.colour4 span,
  :global(.SearchNotebooks .colour4:hover span) {
    background: #f8fcfc;
  }
  .Notebook.colour4 :global(svg),
  :global(.SearchNotebooks .colour4 svg) {
    color: #4c9b92;
  }
  .Notebook.Adding {
    position: relative;
    height: 34px;
  }
  .Adding.colour1 {
    border: 1px solid #a43939;
  }
  .Adding.colour2 {
    border: 1px solid #6f4c9b;
  }
  .Adding.colour3 {
    border: 1px solid #8f7000;
  }
  .Adding.colour4 {
    border: 1px solid #4c9b92;
  }
  .Remove {
    width: 10px;
    height: 10px;
    float: left;
    transform: rotate(45deg);
    cursor: pointer;
    position: relative;
  }
  .Remove::before,
  .Remove::after {
    content: "";
    background: var(--workspace-color);
    width: 100%;
    height: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }
  .Remove::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .Removing a {
    opacity: 0.6;
  }
  .Removing .deleteNotebook {
    opacity: 1;
  }
  .Removing .deleteNotebook :global(svg) {
    width: 16px;
    transform: translateY(1px);
  }
  .Notebook.Removing.colour1 {
    background: rgba(245, 210, 210, 0.5);
  }
  .Notebook.Removing.colour2 {
    background: rgba(212, 204, 234, 0.5);
  }
  .Notebook.Removing.colour3 {
    background: rgba(239, 212, 69, 0.5);
  }
  .Notebook.Removing.colour4 {
    background: rgba(204, 234, 223, 0.5);
  }
</style>

<div class="Notebooks">
  <span
    class="NewNotebook {noteTest.notebooks.length || addNotebook.length ? '' : 'Empty'}">
    <input type="text" readonly />
    <p>
      {noteTest.notebooks.length || addNotebook.length ? '' : 'Add a notebook'}
    </p>
  </span>
  <ListAssigment
    itemsArr={notebookList}
    itemInfo={noteTest.notebooks}
    bind:assignItem={addNotebook}
    type="notebook" />
  <ul class="currentNotebooks">
    {#if noteTest.notebooks.length}
      {#each noteTest.notebooks as notebook}
        <li
          class="Notebook {notebook && notebook.settings && notebook.settings.colour}
          {removeNotebook.find((item) => item.shortId === notebook.shortId) ? 'Removing' : ''}">
          <a href={`notebooks/${notebook.shortId}`}>
            <span>
              <IcoNotebook />
            </span>
            <p>{notebook.name}</p>
          </a>
          {#if removeNotebook.find((item) => item.shortId === notebook.shortId)}
            <div class="deleteNotebook" on:click={revert(notebook)}>
              <IcoRevert />
            </div>
          {:else}
            <div class="Remove" on:click={removeCurrent(notebook)} />
          {/if}
        </li>
      {/each}
    {/if}
    {#each addNotebook as notebook}
      <li
        class="Notebook {notebook && notebook.settings && notebook.settings.colour}
        Adding">
        <a href={`notebooks/${notebook.shortId}`}>
          <span>
            <IcoNotebook />
          </span>
          <p>{notebook.name}</p>
        </a>
        <div class="Remove" on:click={removeItem(notebook)} />
      </li>
    {/each}
  </ul>
</div>
