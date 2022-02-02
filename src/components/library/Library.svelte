<script>
  import NewItem from "../addItems/NewItemInLibrary.svelte";
  import List from "./List.svelte";
  import History from "../widgets/History.svelte";
  import NavSource from "../img/NavSource.svelte";
</script>

<style>
  .Toolbar {
    display: flex;
    top: 0;
    position: relative;
    justify-content: space-between;
    background-color: #ffffff;
    z-index: 3;
    padding: 20px calc(var(--base) * 2) 0;
  }
  nav.Toolbar::before {
    content: "";
    background: #ffffff;
    width: 80px;
    height: 130px;
    position: absolute;
    top: 0;
    left: -80px;
  }
  .Toolbar section {
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  .Toolbar section * {
    float: left;
  }
  .library :global(svg) {
    width: 16px;
    margin-right: 5px;
    float: left;
  }
  .library h3 {
    font-weight: 600;
    margin: 0;
  }
  @media (max-width: 720px) {
    nav.Toolbar::before {
      content: none;
    }
    .Toolbar {
      position: relative;
      padding: calc(var(--base) * 1.5) calc(var(--base) * 2);
    }
    .Toolbar:first-child:nth-last-child(5) :global(.new-button) {
      display: none;
    }
    .Toolbar section {
      display: table;
      width: 100%;
      text-align: center;
    }
    .library {
      float: inherit !important;
      display: inline-table;
    }
  }
</style>

<nav class="Toolbar">
  <section>
    <History />
    <div class="library">
      <NavSource />
      <h3>Source library</h3>
    </div>
  </section>
  <NewItem ntbkClose={false} />
</nav>
<List />
