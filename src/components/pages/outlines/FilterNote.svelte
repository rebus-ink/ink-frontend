<script>
  import ArrowDropDown from "../../img/ArrowDropDown.svelte";
  import FlagFurtherRead from "../../img/FlagFurtherRead.svelte";
  import FlagIdea from "../../img/FlagIdea.svelte";
  import FlagImportant from "../../img/FlagImportant.svelte";
  import FlagImpTerm from "../../img/FlagImpTerm.svelte";
  import FlagQuestion from "../../img/FlagQuestion.svelte";
  import FlagReference from "../../img/FlagReference.svelte";
  import FlagRevisit from "../../img/FlagRevisit.svelte";
  import FlagToDo from "../../img/FlagToDo.svelte";
  import FlagUrgent from "../../img/FlagUrgent.svelte";
  import IcoFlag from "../../img/IcoFlag.svelte";
  import IcoColor from "../../img/IcoColor.svelte";
  import { page, tags } from "../../../stores";
  import { goto } from "@sapper/app";
  import { noteAddNotebooks } from "../../../stores/note/notebooks.js";

  $: getNotebook = notebookArr.find(
    (item) => $page.query.notebook === item.shortId
  );
  $: notebookArr = $noteAddNotebooks.items;
  let notebookInput;

  let currentNotebook;
  $: if (getNotebook) currentNotebook = getNotebook;
  $: if (!$page.query.notebook) currentNotebook = undefined;
  /////////////////////////////////////////// Colour
  function assignCol(icon) {
    switch (icon) {
      case "colour1":
        return "Orange";
      case "colour2":
        return "Pink";
      case "colour3":
        return "Blue";
      case "colour4":
        return "Green";
    }
  }

  let colorArr = ["colour1", "colour2", "colour3", "colour4"];
  $: currentColor = $page.query.colour ? $page.query.colour : undefined;
  /////////////////////////////////////////// Flags
  function assignIco(icon) {
    switch (icon) {
      case "further reading":
        return FlagFurtherRead;
      case "idea":
        return FlagIdea;
      case "important":
        return FlagImportant;
      case "important term":
        return FlagImpTerm;
      case "question":
        return FlagQuestion;
      case "reference":
        return FlagReference;
      case "revisit":
        return FlagRevisit;
      case "to do":
        return FlagToDo;
      case "urgent":
        return FlagUrgent;
    }
  }

  $: flagsArr = $tags.items.filter((item) => item.type === "flag");
  $: currentFlag = $page.query.flag ? $page.query.flag : undefined;
  /////////////////////////////////////////// Flags

  let unFilterIt = (a) => {
    let queries = Object.assign({}, $page.query);
    delete queries[a];

    let mark = Object.keys(queries).length ? "?" : "";
    goto(`${$page.path}${mark}${new URLSearchParams(queries).toString()}`);
  };

  let filterIt = (a, b) => {
    let queries = Object.assign({}, $page.query);
    queries[a] = b;

    goto(`${$page.path}?${new URLSearchParams(queries).toString()}`);
  };
</script>

<style>
  .filter {
    position: relative;
  }
  .filter:nth-child(1) {
    z-index: 5;
  }
  .filter:nth-child(2) {
    z-index: 4;
  }
  .filter:nth-child(3) {
    z-index: 3;
  }
  .filter:nth-child(4) {
    z-index: 2;
  }
  .filter:nth-child(5) {
    z-index: 1;
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
    z-index: 1;
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
  }
  ul .Icon :global(svg) {
    width: 9px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  /*------------- Notes Colours ---------------*/
  .color .query {
    border: none;
  }
  .color .query.colour1 p {
    color: #d86801;
  }
  .color .query.colour2 p {
    color: #c0004e;
  }
  .color .query.colour3 p {
    color: #0693b2;
  }
  .color .query.colour4 p {
    color: #589b4c;
  }
  .color .Icon {
    width: 16px;
    height: 16px;
    margin: 0 auto;
  }
  .color .query .Icon {
    width: 10px;
    height: 10px;
  }
  .color .colour1 .Remove::before,
  .color .colour1 .Remove::after,
  .color .colour1 .Icon {
    background: #d86801;
  }
  .color li.colour1:hover {
    background: #ffebda;
  }
  .color .colour2 .Remove::before,
  .color .colour2 .Remove::after,
  .color .colour2 .Icon {
    background: #c0004e;
  }
  .color li.colour2:hover {
    background: #ffe4f0;
  }
  .color .colour3 .Remove::before,
  .color .colour3 .Remove::after,
  .color .colour3 .Icon {
    background: #0693b2;
  }
  .color li.colour3:hover {
    background: #e2f7fa;
  }
  .color .colour4 .Remove::before,
  .color .colour4 .Remove::after,
  .color .colour4 .Icon {
    background: #589b4c;
  }
  .color li.colour4:hover {
    background: #e6f8e4;
  }
  .color .colour1.query {
    background: #ffebda;
  }
  .color .colour2.query {
    background: #ffe4f0;
  }
  .color .colour3.query {
    background: #e2f7fa;
  }
  .color .colour4.query {
    background: #e6f8e4;
  }
  /*------------- Flags List ---------------*/
  .flag li {
    grid-gap: 10px;
  }
  .flag .Icon {
    border: 1px solid #dde8ed;
  }
  .flag li:hover .Icon {
    border: none;
  }
  .flag li p,
  .flag .query p {
    text-transform: capitalize;
  }
</style>

<div class="filter flag">
  <p>Flag</p>
  <input class="btn" readonly />
  <div class="inputs">
    {#if currentFlag}
      <div class="query">
        <svelte:component this={assignIco(currentFlag)} />
        <p>{currentFlag}</p>
        <span class="Remove" on:click={() => unFilterIt('flag')} />
      </div>
    {:else}
      <p class="placeholder">
        <IcoFlag />
        Choose flag
      </p>
    {/if}
    <ArrowDropDown />
  </div>
  <ul>
    {#each flagsArr as flag}
      {#if !currentFlag || currentFlag !== flag.name}
        <li on:click={() => filterIt('flag', flag.name)}>
          <span class="Icon">
            <svelte:component this={assignIco(flag.name)} />
          </span>
          <p class={flag.name}>{flag.name}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>

<div class="filter color">
  <p>Color</p>
  <input class="btn" readonly />
  <div class="inputs">
    {#if currentColor}
      <div class="query {currentColor}">
        <span class="Icon" />
        <p>{assignCol(currentColor)}</p>
        <span class="Remove" on:click={() => unFilterIt('colour')} />
      </div>
    {:else}
      <p class="placeholder">
        <IcoColor />
        Choose colour
      </p>
    {/if}
    <ArrowDropDown />
  </div>
  <ul>
    {#each colorArr as color}
      {#if !currentColor || currentColor !== color}
        <li class={color} on:click={() => filterIt('colour', color)}>
          <span class="Icon" />
          <p>{assignCol(color)}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>
