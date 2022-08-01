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
  import { tags } from "../../../stores";
  export let selectedFlags;

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

  $: flagsArr = $tags.items.filter(
    (item) => item.type === "flag" && !item.name.startsWith("colour")
  );

  let removeFlag = (flag) => {
    selectedFlags.splice(selectedFlags.indexOf(flag), 1);
    selectedFlags = selectedFlags;
  };

  let addFlag = (flag) => {
    selectedFlags = selectedFlags.concat(flag);
  };
</script>

<style>
  .filter {
    position: relative;
    float: left;
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
    top: 0;
    width: 100%;
    transform: translateY(calc(-100% + 13px));
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
    {#if selectedFlags.length}
      {#each selectedFlags as flagged}
        <div class="query">
          <svelte:component this={assignIco(flagged)} />
          <p>{flagged}</p>
          <span class="Remove" on:click={() => removeFlag(flagged)} />
        </div>
      {/each}
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
      {#if !selectedFlags.length || !selectedFlags.find((item) => item === flag.name)}
        <li on:click={() => addFlag(flag.name)}>
          <span class="Icon">
            <svelte:component this={assignIco(flag.name)} />
          </span>
          <p class={flag.name}>{flag.name}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>
