<script>
  import { page, selectedItems } from "../../../stores";
  import { goto } from "@sapper/app";
  export let menuTabs;
  export let shortId;
  export let endSelection = function() {};

  let types = ["all", "sources", "notes", "pages"];

  let navigation = (type) => {
    endSelection();
    menuTabs = type;
    goto(menuTabs === "all" ? $page.path : `${$page.path}?notebook=${shortId}`);
  };

  $: if (!$page.query.notebook) menuTabs = "all";
  $: if ($page.params.noteId) menuTabs = "notes";
</script>

<style>
  ul.Menu {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    grid-gap: 10px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.Menu li {
    text-align: center;
    color: var(--action);
    text-transform: capitalize;
    font-size: var(--item-font-size);
    font-weight: 600;
    padding: 7px 0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  ul.Menu li.active {
    background: var(--action);
    color: #ffffff;
  }
  @media (max-width: 720px) {
    ul.Menu {
      order: inherit !important;
      grid-column: 1/3;
      grid-template-columns: repeat(3, 33.3%);
      grid-gap: 0;
    }
    ul.Menu li {
      font-size: 0.8rem;
      font-weight: 500;
      padding: 12px 0;
      border-radius: 15px;
    }
  }
</style>

<ul class="Menu">
  {#each types as type}
    <li
      class="{type}
      {menuTabs === type ? 'active' : ''}"
      on:click={() => navigation(type)}>
      {type === 'all' ? 'All Items' : type}
    </li>
  {/each}
</ul>
