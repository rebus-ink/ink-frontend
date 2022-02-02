<script>
  import IcoDelete from "../../img/IcoDelete.svelte";

  export let pageInfo;
  export let activeModal;
</script>

<style>
  header {
    display: grid;
    gap: 5px;
  }
  header h1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  header .Title {
    width: max-content;
    display: grid;
    gap: 15px;
    align-items: center;
    position: relative;
    margin: 0 auto;
    grid-template-columns: max-content max-content;
  }
  header .Title .DropDown {
    width: 28px;
    display: grid;
    height: 100%;
    text-align: center;
    align-items: center;
    border-radius: 7px;
    cursor: pointer;
    position: relative;
    border: 1px solid transparent;
    transition: all 0.2s ease-out;
  }
  header .Title .DropDown:hover {
    border: 1px solid #eeeeee;
  }
  header .DropDown:hover::after {
    content: "";
    width: calc(100% + 60px);
    top: 0;
    right: 0;
    height: calc(100% + 20px);
    position: absolute;
  }
  header .Title .DropDown :global(svg) {
    position: relative;
    right: inherit;
    top: inherit;
    margin: 0 auto;
    color: var(--workspace-color);
  }
  header h1 {
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--workspace-color);
    margin: 0;
  }
  header .DropDown:hover ~ .Delete,
  header .Delete:hover {
    display: grid;
  }
  header .Delete {
    border: 1px solid #eeeeee;
    border-radius: 10px;
    background: #ffffff;
    display: none;
    gap: 15px;
    grid-template-columns: max-content max-content;
    padding: 15px 30px;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 2;
    cursor: pointer;
    transform: translateY(calc(100% + 5px));
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
  .Delete::before {
    content: "";
    background: transparent;
    width: 90%;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
    height: 70%;
    position: absolute;
    z-index: -1;
    border-radius: 6px;
  }
  .Delete:hover::before {
    background: rgba(239, 86, 87, 0.1);
  }
  header .Delete p,
  header .Delete :global(svg) {
    color: #f05657;
  }
  header .Delete p {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
  }
</style>

<header>
  <div class="Title">
    <h1>{pageInfo.name}</h1>
    <!--
    <div class="DropDown">
      <ArrowDropDown />
    </div>-->
    <div
      class="Delete"
      on:click={() => {
        activeModal = true;
      }}>
      <IcoDelete />
      <p>Delete page</p>
    </div>
  </div>
</header>
