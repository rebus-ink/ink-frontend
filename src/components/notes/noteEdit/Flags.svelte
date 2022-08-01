<script>
  import { page } from "../../../stores";
  import FlagFurtherRead from "../../img/FlagFurtherRead.svelte";
  import FlagIdea from "../../img/FlagIdea.svelte";
  import FlagImportant from "../../img/FlagImportant.svelte";
  import FlagImpTerm from "../../img/FlagImpTerm.svelte";
  import FlagQuestion from "../../img/FlagQuestion.svelte";
  import FlagReference from "../../img/FlagReference.svelte";
  import FlagRevisit from "../../img/FlagRevisit.svelte";
  import FlagToDo from "../../img/FlagToDo.svelte";
  import FlagUrgent from "../../img/FlagUrgent.svelte";

  export let colour;
  export let assignFlags;
  export let selectedFlags;
  export let noteTest;
  export let error = false;

  $: if (!selectedFlags && noteTest && noteTest.tags) assignFlags();
  $: if ($page.params.id) if (noteTest.tags) assignFlags();

  let flags = [
    "important",
    "question",
    "revisit",
    "to do",
    "idea",
    "important term",
    "further reading",
    "urgent",
    "reference",
  ];

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
</script>

<style>
  .flags {
    float: left;
    margin: 0;
    position: relative;
    list-style: none;
    border-top: none !important;
    width: 100%;
    border-radius: 0 0 10px 10px;
    padding: 5px 0 0 5px;
  }
  .flags::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    display: block;
    top: -2px;
    left: 0;
  }
  .flags li {
    float: left;
    position: relative;
    margin: 0 5px 5px 0;
  }
  .flags p {
    margin: 0;
    font-size: 0.65rem !important;
    color: #888888;
    background: #ffffff;
    border-radius: 20px;
    padding: 5px 10px;
    line-height: 10px;
    text-transform: capitalize;
  }
  .flags.colour1 p,
  .flags.colour2 p,
  .flags.colour3 p,
  .flags.colour4 p {
    background: #eeeeee;
  }
  .flags :global(svg) {
    height: 10px;
    float: left;
    margin-right: 3px;
  }
  .flags input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0;
  }
  .flags {
    border: 2px solid #999999;
    background: #f3f3f3;
  }
  .flags::after {
    background: #cccccc;
  }
  .flags.error {
    border: 2px solid red;
    background: #fffcfa;
  }
  .flags.colour1 {
    border: 2px solid #fea95b;
    background: #fffcfa;
  }
  .flags.colour1::after {
    background: #fcf3ed;
  }
  .flags.colour2 {
    border: 2px solid #ff8ebe;
    background: #fffafd;
  }
  .flags.colour2::after {
    background: #f9eaf0;
  }
  .flags.colour3 {
    border: 2px solid #6fe1fa;
    background: #fafeff;
  }
  .flags.colour3::after {
    background: #dff2f5;
  }
  .flags.colour4 {
    border: 2px solid #9fe793;
    background: #f8fcf8;
  }
  .flags.colour4::after {
    background: #eaf5e6;
  }
  .flags input:checked ~ p {
    color: #f6f6f6;
    border: none;
    background: #999999;
  }
  .flags.colour1 input:checked ~ p {
    color: #d86801;
    background: #ffebda;
  }
  .flags.colour2 input:checked ~ p {
    color: #c0004e;
    background: #ffe4f0;
  }
  .flags.colour3 input:checked ~ p {
    color: #0693b2;
    background: #e2f7fa;
  }
  .flags.colour4 input:checked ~ p {
    color: #589b4c;
    background: #e6f8e4;
  }
</style>

<div class="flags {error ? "error" : colour}">
  {#each flags as flag}
    <li>
      <input bind:group={selectedFlags} type="checkbox" value={flag} />
      <p class={flag}>
        <svelte:component this={assignIco(flag)} />
        {flag}
      </p>
    </li>
  {/each}
</div>
