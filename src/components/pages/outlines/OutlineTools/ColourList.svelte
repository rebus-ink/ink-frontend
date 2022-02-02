<script>
  import ArrowDropDown from "../../../img/ArrowDropDown.svelte";
  import IcoColor from "../../../img/IcoColor.svelte";
  import IcoChecked from "../../../img/OutlineIcoChecked.svelte";
  import { page } from "../../../../stores";

  export let addArrParams;
  export let filters;

  let colours = ["colour1", "colour2", "colour3", "colour4"];
</script>

<style>
  .Colours li {
    grid-template-columns: max-content 1fr 13px;
  }
  .Colours li :global(svg) {
    margin: 0 auto;
  }
  li.Colours > :global(svg:first-child) {
    width: 10px;
    opacity: 0.7;
  }
  :global(ul.Tools) .Checkbox.colour1 {
    border: 2px solid #d86801;
  }
  :global(ul.Tools) .Checkbox.colour1::after {
    background: #d86801;
  }
  :global(ul.Tools) .Checkbox.colour2 {
    border: 2px solid #c0004e;
  }
  :global(ul.Tools) .Checkbox.colour2::after {
    background: #c0004e;
  }
  :global(ul.Tools) .Checkbox.colour3 {
    border: 2px solid #0693b2;
  }
  :global(ul.Tools) .Checkbox.colour3::after {
    background: #0693b2;
  }
  :global(ul.Tools) .Checkbox.colour4 {
    border: 2px solid #589b4c;
  }
  :global(ul.Tools) .Checkbox.colour4::after {
    background: #589b4c;
  }
</style>

<li class="Children Colours">
  <IcoColor />
  <p>Colours</p>
  <p class="Preview">
    {!filters.colour.length ? 'All' : 4 - filters.colour.length}
  </p>
  <ArrowDropDown />
  <ul class="Colours">
    <li
      class:Current={!filters.colour.length}
      on:click={() => {
        filters.colour = [];
      }}>
      <IcoChecked />
      <p>All colours</p>
    </li>
    <span class="Division Full" />
    {#each colours as colour}
      <li
        on:click={() => {
          addArrParams('colour', colour);
        }}>
        <span
          class="Checkbox {colour}"
          class:Unchecked={filters.colour.find((item) => item === colour)} />
        <p>{colour}</p>
      </li>
    {/each}
  </ul>
</li>
