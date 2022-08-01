<script>
  import IcoSearch from "../../img/IcoSearch.svelte";
  import { searchPageNotes, page } from "../../../stores";

  let inputValue;
  let loadSearch = () => {
    if ($page.path.startsWith("/pages/")) $searchPageNotes = inputValue;
  };

  let Clear = () => {
    inputValue = "";
    $searchPageNotes = "";
  };
</script>

<style>
  .SearchBox {
    background-color: #ffffff;
    height: 34px;
    border-radius: 50px;
    width: 100%;
    position: relative;
    float: left;
    border: 1px solid #dde8ed;
  }
  .SearchBox input {
    font-family: var(--sans-fonts);
    font-size: var(--item-font-size);
    border: none;
    font-weight: 700;
    background: transparent;
    position: absolute;
    top: 50%;
    left: 40px;
    width: calc(100% - 50px);
    height: 100%;
    transform: translateY(-50%);
    color: var(--action);
    transition: all 0.25s ease-out;
  }
  .SearchBox input:focus {
    outline: none;
  }
  .SearchBox:focus-within {
    background: #e5ecf2;
  }
  .SearchBox input::placeholder {
    color: var(--action);
    opacity: 0.5;
    font-weight: 500;
  }
  .SearchBox :global(svg) {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    margin: 0;
    width: 15px;
    height: 15px;
  }
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }
  .Clear {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    right: 8px;
    top: 50%;
    z-index: 1;
    background: #e5ecf2;
    cursor: pointer;
    transform: translateY(-50%) rotate(45deg);
  }
  .Clear::before,
  .Clear::after {
    content: "";
    position: absolute;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--workspace-color);
    width: 2px;
    height: 50%;
  }
  .Clear::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  @media (max-width: 640px) {
    .SearchBox {
      left: 0.5rem;
      right: 0.5rem;
      position: absolute;
      width: calc(100% - 80px);
      left: 40px;
      top: 0;
    }
  }
</style>

<div class="SearchBox">
  <input
    type="search"
    required
    name="search"
    id="search-input"
    class="search-field"
    bind:value={inputValue}
    placeholder="Search notes..."
    on:input={loadSearch} />
  <IcoSearch />
  {#if inputValue}
    <span on:click={Clear} class="Clear" />
  {/if}
</div>
