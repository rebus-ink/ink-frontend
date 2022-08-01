<script>
  import IcoRemove from "../../img/IcoRemove.svelte";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import IcoExport from "../../img/IcoExport.svelte"
  import DeletionModal from "../../widgets/DeletionModal.svelte";
  import RemoveItemsModal from "./RemoveItemsModal.svelte";
  import { goto } from "@sapper/app";
  import { getToken } from "../../../getToken";
  import { selectedItems, page } from "../../../stores";

  export let endSelection = function() {};
  export let notebook;
  export let typeOfItem;

  let exportActive = true;
  $: if ($selectedItems && onlyNotesSelected()) {
    exportActive = true;
  } else {
    exportActive = false;
  }


  let activeModal = false;
  async function remove() {
    const body = { items: Array.from($selectedItems) };
    if (typeOfItem !== "page") body["notebook"] = notebook;
    endSelection();

    try {
      await fetch(`/api/batch-notebook/remove-items`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });

      //refresh();
      goto($page.path);
    } catch (err) {
      console.error(err);
    }
  }

  let itemsList = [];
  $: if ($selectedItems) {
    itemsList = [];
    $selectedItems.forEach((obj) => {
      itemsList.push(obj);
    });
  }

  let menu = ["", "Export Notes", "Close"];
  menu[0] = typeOfItem === "page" ? "Delete" : "Remove";

  let react = (func) => {
    if (func === "Remove" || func === "Delete") activeModal = true;
    else if (func === "Export Notes") exportSelected()
    else endSelection();
  };

  function onlyNotesSelected() {
    let items = Array.from($selectedItems)
    let onlyNotes = true
    items.forEach(item => {
      if (!item.id.includes('notes')) {
        onlyNotes = false;
      }
    })
    return onlyNotes
   }

  async function exportSelected() {
    if (onlyNotesSelected()) {
const body = { items: Array.from($selectedItems) };
    try {
      await fetch('/export/notes', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });

      let server
      if ($page && $page.host === 'localhost:3000') {
        server = 'http://localhost:3000'
      } else {
        server = `https://${$page.host}` 
      }

      const url = `${server}/export/notes`;
      window.location.replace(url);

    } catch (err) {
      console.error(err);
    }
    }
    
  }

  function assignIco(icon) {
    switch (icon) {
      case "Remove":
        return IcoRemove;
      case "Delete":
        return IcoDelete;
      case "Export Notes":
        return IcoExport;
    }
  }
</script>

<style>
  .form {
    display: grid;
    grid-column: 1 / 3;
    grid-template-columns: 1fr 1fr;
    gap: 30px 20px;
  }
  .FooterButtons {
    display: grid;
    grid-gap: calc(var(--base) * 2);
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
  .FooterButtons :global(button) {
    height: 40px;
  }
  .FooterNumber {
    font-size: 1rem;
    font-style: italic;
    color: var(--medium);
    font-weight: 300;
  }
  .Footer {
    padding: 10px 50px;
    bottom: 20px;
    left: calc(50% + 40px);
    position: fixed;
    background: #fff;
    border: 1px solid #eee;
    transform: translateX(-50%);
    border-radius: 20px;
    z-index: 1;
    transition: all 0.2s ease;
    box-shadow: 0px 0px 30px 0px rgba(0, 34, 48, 0.2);
  }
  /*-----------------------------------*/
  .Footer ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 70px;
    gap: 50px;
  }
  .Footer li {
    cursor: pointer;
    border-radius: 15px;
    text-align: center;
    gap: 10px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    transition: all 0.25s ease;
  }

  .Footer li:hover {
    background: var(--main-background-color);
  }
  .Footer li.Remove:hover,
  .Footer li.Delete:hover {
    background: #fcf0f0;
  }
  .Footer li .Icon {
    width: 16px;
    height: 16px;
    display: block;
    margin: 0 auto;
  }
  .Footer li.Remove,
  .Footer li.Delete {
    color: #f05657;
    width: 100px;
  }
  .Footer li.Remove::after,
  .Footer li.Delete::after {
    content: "";
    background: #dddddd;
    width: 1px;
    height: 65%;
    right: -25px;
    position: absolute;
  }
  .Footer li.Remove .Icon,
  .Footer li.Delete .Icon {
    width: 25px;
  }
  .Footer li.Remove .Icon :global(svg),
  .Footer li.Delete .Icon :global(svg) {
    width: auto;
    height: 18px;
    transform: translateY(-1px);
  }
  .Footer li.Edit .Icon :global(svg) {
    transform: translate(-5px, -5px);
    height: 26px;
    width: auto;
  }
  .Footer li.Edit .Icon :global(svg path) {
    fill: var(--workspace-color);
  }
  .Footer li.Edit .Icon :global(svg rect) {
    height: 1px;
    width: 5px;
    x: 6;
    fill: #ffffff;
    stroke: none;
  }
  .Footer li.Close .Icon {
    position: relative;
  }
  .Footer li.Close .Icon::before,
  .Footer li.Close .Icon::after {
    content: "";
    width: 3px;
    height: 20px;
    background: var(--workspace-color);
    position: absolute;
    transform: translate(-50%, -50%) rotate(45deg);
    top: 50%;
    left: 50%;
    border-radius: 10px;
  }
  .Footer li.Close .Icon::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  .Footer li.Checkall .Icon {
    border-radius: 50%;
    border: 2px solid var(--workspace-color);
    position: relative;
  }
  .Footer li.Checkall .Icon::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: transparent;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    transition: all 0.35s ease;
  }
  .Footer li.Checkall.allChecked .Icon::after {
    background: #333333;
  }
  .Footer li.Inactive {
    color: #dddddd;
    fill: #dddddd;
  }
  .Footer li p {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
  }
  @media (max-width: 720px) {
    .Footer {
      left: 0;
      padding: var(--base) calc(var(--base) * 2);
      width: 100%;
      bottom: 0;
      z-index: 4;
      transform: translateX(0);
      border-radius: 20px 20px 0 0;
    }
    .form {
      grid-template-columns: 1fr;
    }
    .FooterButtons {
      display: grid;
      grid-gap: 0.5rem;
      grid-template-columns: 0.75fr 1fr;
    }
  }
</style>

{#if !activeModal}
  <form class="Footer">
    <ul>
      {#each menu as button}
      {#if !exportActive && button === "Export Notes"}
        <li
        class="Button Inactive Export_Notes"
        on:click={() => react(button)}>
        <span class="Icon">
          <svelte:component this={assignIco(button)} />
        </span>
        <p>{button}</p>
      </li>
      {:else}
        <li
          class="Button {button.replace(' ', '')}"
          on:click={() => react(button)}>
          <span class="Icon">
            <svelte:component this={assignIco(button)} />
          </span>
          <p>{button}</p>
        </li>
        {/if}
      {/each}
    </ul>
  </form>
{:else}
  {#if typeOfItem === 'page'}
    <DeletionModal type="page" {remove} bind:activeModal items={itemsList} />
  {:else}typeOfItem
    <RemoveItemsModal {remove} bind:activeModal items={itemsList} />
  {/if}
{/if}
