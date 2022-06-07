<script>
  import { page } from "../../stores";
  import { goto } from "@sapper/app";
  export let itemsLenght;
  export let totalItems;

  let changePage = (e) => {
    let queries = Object.assign({}, $page.query);
    let dir = e.target.value === "Next" ? 1 : -1;
    if (e.target.value === "First") queries["page"] = 1;
    else if (e.target.value === "Last") queries["page"] = numberOfPages || 1;

    else if (!queries.page) queries["page"] = 2;
    else if (dir < 1 && parseInt(queries.page) < 3) delete queries.page;
    else queries.page = parseInt(queries.page) + dir;

    let mark = Object.keys(queries).length ? "?" : "";
    goto(`${$page.path}${mark}${new URLSearchParams(queries).toString()}`);
  };

  $: console.log(totalItems, Math.ceil(totalItems / 50))

  $: numberOfPages = totalItems ? Math.ceil(totalItems / 50) : 100
  $: nextDisabled = itemsLenght === 50 ? false : true; //TODO: fix this to use the numberOfPages
  $: prevDisabled =
    $page.query.page || parseInt($page.query.page) < 2 ? false : true;
</script>

<style>
  .Pagination {
    text-align: center;
    display: grid;
    gap: 70px;
    justify-content: center;
    padding-bottom: 150px;
    grid-template-columns: repeat(5, max-content);
  }
  .Pagination button {
    background: var(--action);
    border: none;
    width: 30px;
    height: 30px;
    display: grid;
    text-align: center;
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 300;
    cursor: pointer;
    border-radius: 5px;
    padding: 0;
  }
  .Pagination button[aria-label="Prev"] {
    transform: rotate(180deg);
  }
  .Pagination button[aria-label="First"] {
    transform: rotate(180deg);
  }
  .Pagination button.nextDisabled,
  .Pagination button.prevDisabled {
    opacity: 0.3;
    cursor: default;
  }
  .Pagination p {
    margin: 0;
    line-height: 30px;
    font-weight: 500;
  }
</style>

<div class="Pagination">
  <button
    class:prevDisabled
    on:click={prevDisabled ? '' : changePage}
    aria-label="First" value="First">
    ››
  </button>
  <button
    class:prevDisabled
    on:click={prevDisabled ? '' : changePage}
    aria-label="Prev">
    ›
  </button>
  <p>{$page.query.page || 1} / {numberOfPages}</p>
  <button
    class:nextDisabled
    on:click={nextDisabled ? '' : changePage}
    aria-label="Next" value="Next">
    ›
  </button>
  <button
    class:nextDisabled
    on:click={nextDisabled ? '' : changePage}
    aria-label="Last" value="Last">
    ››
  </button>
</div>
