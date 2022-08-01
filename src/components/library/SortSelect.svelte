<script>
  import { goto, stores } from "@sapper/app";
  const { page } = stores();
  export let query;
  export let path;
  let selectElement;
  let selectedOption;
  $: if ($page) {
    selectedOption = `${$page.query.orderBy}-${$page.query.dir}`;
  }
  function sortItems(type) {
    let dir;
    if (type.includes("asc")) {
      dir = "asc";
    } else if (type.includes("desc")) {
      dir = "desc";
    }
    const config = Object.assign({}, query, {
      orderBy: type.split("-")[0],
      dir,
    });
    config.page = 1;

    const url = `${path}?${new URLSearchParams(config).toString()}`;
    if (query.orderBy !== config.orderBy || query.dir !== config.dir) {
      goto(url);
    }
  }
  function changed(event) {
    //length(event);
    return sortItems(event.target.value);
  }

</script>

<style>
  label,
  select,
  option {
    color: var(--action);
    font-size: 0.85rem;
  }
  label {
    font-size: var(--item-font-size);
    position: relative;
    color: #333333;
    font-weight: 600;
  }
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 19px;
    color: var(--action);
  }
  select {
    background: var(--main-background-color);
    border-radius: 50px;
    padding: 11px 35px 11px 25px;
    font-weight: 700;
    display: inline-block;
    color: var(--action);
    box-sizing: border-box;
    margin: 0 0 0 5px;
    border: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    font-size: var(--item-font-size);
    outline: none;
    mix-blend-mode: multiply;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: var(--rc-main);
    cursor: pointer;
  }
</style>

<label>
  <slot />
  <svg
    width="7"
    height="11"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.3,8.2C6.7,8.9,5.6,8.9,5,8.2L0.3,2.4C-0.5,1.5,0.2,0,1.5,0l9.3,0c1.3,0,2,1.5,1.2,2.4L7.3,8.2z"
      fill="currentColor" />
  </svg>
  <select
    name="sort-select"
    id="sort-select"
    on:change={changed}
    on:blur={changed}
    bind:this={selectElement}>
    <option value="modified-asc" selected={selectedOption === 'modified-asc'}>
      Date, Asc
    </option>
    <option value="modified-desc" selected={selectedOption === 'modified-desc'}>
      Date, Desc
    </option>
    {#if !$page.path.startsWith('/notes/') && !$page.path.startsWith('/pages/')}
      <option value="title-asc" selected={selectedOption === 'title-asc'}>
        Title, A-Z
      </option>
      <option value="title-desc" selected={selectedOption === 'title-desc'}>
        Title, Z-A
      </option>
    {/if}
  </select>
</label>
