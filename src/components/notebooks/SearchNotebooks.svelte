<script>
  import { onMount } from "svelte";
  import { notebookSearched, page, searchNotebooks } from "../../stores";

  let input;
  function loadSearch() {
    if (
      $page.path.startsWith("/notes/all/all") ||
      $page.path.startsWith("/library/all/all")
    ) {
      $notebookSearched = input.value.trim();
    } else if ($page.path.startsWith("/notebooks")) {
      $searchNotebooks = input.value.trim();
    }
  }

  onMount(() => {
    $searchNotebooks = null;
  });
</script>

<style>
  .SearchBox {
    background-color: var(--main-background-color);
    height: 34px;
    border-radius: 50px;
    width: 225px;
    position: relative;
    float: left;
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
  .SearchBox svg {
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
    value=""
    placeholder="Search notebooks..."
    bind:this={input}
    on:input={loadSearch} />
  <svg
    width="34"
    height="34"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.9706 14C12.6971 14 12.4377 13.8936 12.2459 13.6987L8.40195
      9.8592L8.23498 9.96556C7.38235 10.4973 6.39827 10.7774 5.38933
      10.7774C2.41934 10.7774 0 8.35958 0 5.38871C0 2.41783 2.41934 0 5.38933
      0C8.35932 0 10.7787 2.41783 10.7787 5.38871C10.7787 6.39554 10.498 7.38111
      9.96511 8.2355L9.86208 8.40213L13.6989 12.238C14.1004 12.6422 14.1004
      13.2945 13.6989 13.6987C13.5035 13.8936 13.2477 14 12.9706 14ZM5.38933
      1.11319C3.03039 1.11319 1.11197 3.03115 1.11197 5.38871C1.11197 7.74626
      3.03039 9.66422 5.38933 9.66422C7.74827 9.66422 9.66669 7.74626 9.66669
      5.38871C9.66669 3.03115 7.74827 1.11319 5.38933 1.11319Z"
      fill="currentColor" />
  </svg>
</div>
