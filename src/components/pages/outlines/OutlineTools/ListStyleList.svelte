<script>
  import IcoChecked from "../../../img/OutlineIcoChecked.svelte";
  import List from "../../../img/OutlineIcoList.svelte";
  import { page } from "../../../../stores";

  export let addParams;
  export let filters;

  let items = ["alpha", "roman", "decimal", "bPoint"];

  function assignItem(item) {
    switch (item) {
      case "alpha":
        return "A, B, C, ...";
      case "roman":
        return "I, II, III, ...";
      case "decimal":
        return "1, 2, 3, ...";
    }
  }
</script>

<style>
  li.Tool ul {
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    list-style: none;
    margin: 0;
    gap: 1px;
    cursor: default;
    -webkit-box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.25);
    box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.25);
  }
  li.Tool ul {
    position: absolute;
    padding: 7px 0;
    right: 0;
    top: 0;
    min-width: 190px;
    transform: translateX(calc(100% + 5px));
    display: none;
  }
  li.Tool:hover > ul {
    display: grid;
  }
  li.Tool {
    margin: 0 2px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }
  li.Children:hover::before,
  li.Children ul:hover:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
  }
  li.Children ul:hover:before {
    left: 5px;
  }
  li.Tool ul li {
    display: grid;
    padding: 5px 10px;
    text-align: left;
    align-items: center;
    gap: 7px;
    border-radius: 7px;
    grid-template-columns: max-content 1fr max-content;
  }
  li.Tool .Current,
  li.Tool li:hover {
    background: var(--main-background-color);
  }
  li.Tool li :global(svg.Check) {
    color: var(--action);
    opacity: 0;
    transition: all 0.2s ease-out;
  }
  .Tool.List li.Current :global(svg.Check) {
    opacity: 1;
  }
  li.Tool {
    text-align: center;
    padding: 5px;
    border-radius: 10px;
  }
  li.Tool > p {
    font-size: 0.6rem !important;
  }
  li.Tool:hover {
    background: #eeeeee;
  }
  li.Tool ul p {
    font-size: 0.7rem;
    margin: 0;
    font-weight: 400;
  }
  p.Type {
    font-weight: 500;
  }
  p.Preview {
    color: #888888;
  }
  p.Type {
    text-transform: capitalize;
  }
  span.Preview {
    background: #aaaaaa;
    border-radius: 50%;
    width: 7px;
    height: 7px;
    cursor: default;
  }
</style>

<li class="Tool List Children">
  <List />
  <p>List</p>
  <ul class="ListOptions">
    <li
      class:Current={!filters.list}
      on:click={() => {
        addParams(false);
      }}>
      <IcoChecked />
      <p>None</p>
      <span />
    </li>
    {#each items as item}
      <li
        class:Current={filters.list === item}
        on:click={() => {
          addParams(item);
        }}>
        <IcoChecked />
        <p class="Type">{item === 'bPoint' ? 'Bullet point' : item}</p>
        {#if item === 'bPoint'}
          <span class="Preview" />
        {:else}
          <p class="Preview">{assignItem(item)}.</p>
        {/if}
      </li>
    {/each}
  </ul>
</li>
