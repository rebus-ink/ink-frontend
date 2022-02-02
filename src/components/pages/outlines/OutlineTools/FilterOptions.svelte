<script>
  import IcoChecked from "../../../img/OutlineIcoChecked.svelte";
  import { page } from "../../../../stores";

  export let checkAll;
  export let addArrParams;
  export let filters;

  let filtersOf = ["header", "note"];
</script>

<style>
  p.StyleName {
    text-transform: capitalize;
  }
</style>

<li
  class:Current={!filters.type.length && !filters.colour.length && !filters.flags.length}
  on:click={checkAll}>
  <IcoChecked />
  <p>Default</p>
</li>
<span class="Division Full" />
{#each filtersOf as filter}
  <li
    on:click={() => {
      addArrParams('type', filter);
    }}>
    <span
      class="Checkbox"
      class:Unchecked={filters.type.find((item) => item === filter)} />
    <p class="StyleName">Enable {filter}</p>
    <span />
  </li>
{/each}
