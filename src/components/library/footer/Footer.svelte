<script>

  import {
    selectedItems,
    refreshDate,
    addedCollections,
    addedNotebooks,
    notebooks
  } from "../../../stores";
  // import RiskyButton from "../widgets/RiskyButton.svelte";
  import SecondaryButton from "../../widgets/SecondaryButton.svelte";
  import Button from "../../widgets/Button.svelte";
  import TypeSelect from "../../addItems/TypeSelect.svelte";
  import Input from "../../addItems/Input.svelte";
  import { getToken } from "../../../getToken";
  import AddCollections from "../../addItems/AddCollections.svelte";
  import AddNotebooks from "./AddNotebooks.svelte";

  export let endSelection = function() {};
  export let editing;

  async function submit(event) {
    event.preventDefault();
    editing = false;
    const { target } = event;
    const body = Object.fromEntries(
      new URLSearchParams(new FormData(target)).entries()
    );
    body.items = Array.from($selectedItems);
    body.addedCollections = $addedCollections;
    body.addedNotebooks = $addedNotebooks;
    $addedCollections = [];
    $addedNotebooks = [];

    endSelection();
    try {
      await fetch(target.action, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });
      $refreshDate = Date.now();
    } catch (err) {
      console.error(err);
    }
  }
  /*
  async function remove(event) {
    event.preventDefault();
    editing = false;
    const body = { items: Array.from($selectedItems) };
    endSelection();
    try {
      await fetch("/api/batch-update", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });
      $refreshDate = Date.now();
    } catch (err) {
      console.error(err);
    }
  }*/

  $: editSource = Array.from($selectedItems);
  let removeTag = [];
  let removeNotebooks = [];
  let test = async (id) => {
    if (removeTag.some((getId) => getId === id)) return;
    removeTag = [...removeTag].concat(id);
    const body = { publicationId: editSource[0].shortId, collectionId: id };

    try {
      await fetch(`/api/publication/${editSource[0].shortId}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });
      $refreshDate = Date.now();
    } catch (err) {
      console.error(err);
    }
  };

  let testNotebook = async (id) => {
    if (removeNotebooks.some((getId) => getId === id)) return;
    removeNotebooks = [...removeNotebooks].concat(id);
    const body = { publicationId: editSource[0].shortId, notebookId: id };
    try {
      await fetch(`/api/publication/${editSource[0].shortId}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(body),
      });
      $refreshDate = Date.now();
    } catch (err) {
      console.error(err);
    }
  };
</script>

<style>
  .FooterButtons {
    display: grid;
    grid-gap: calc(var(--base) * 2);
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
  .FooterButtons :global(button) {
    height: 40px;
  }
  .Footer {
    display: flex;
    justify-content: space-between;
    padding: var(--base) calc(var(--base) * 2) var(--base)
      calc(var(--base) * 2 + 40px);
    width: calc(100% - calc(var(--base) * 4 - 40px));
    align-items: center;
    font-size: var(--item-font-size);
    position: fixed;
    bottom: 0;
    left: 0;
    align-items: end;
    box-shadow: 0px -7px 15px rgba(0, 0, 0, 0.1);
  }
  .Footer.editing {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--base);
    width: 100%;
    padding: 40px;
    border-radius: 50px 50px 0 0;
    bottom: 0;
    border: none;
    background: #ffffff;
  }
  .Stacks {
    position: relative;
  }
  .RemoveStacks {
    padding: 0;
    margin: 0;
    list-style: none;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    left: 0;
    width: 100%;
    display: grid;
    gap: 12px;
  }
  .RemoveStacks li {
    display: grid;
    grid-template-columns: max-content 12px;
    gap: 8px;
    align-items: center;
  }
  .RemoveStacks span {
    width: 12px;
    height: 12px;
    background: var(--workspace-color);
    border-radius: 50%;
    cursor: pointer;
    display: block;
    position: relative;
    transform: rotate(45deg);
  }
  .RemoveStacks span::before,
  .RemoveStacks span::after {
    content: "";
    background: #ffffff;
    width: 1px;
    height: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .RemoveStacks span::after {
    width: 50%;
    height: 1px;
  }
  @media (max-width: 720px) {
    .Footer {
      left: 0;
      padding: var(--base) calc(var(--base) * 2);
      width: 100%;
    }
    .Footer.editing {
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: var(--base);
      padding: 40px 40px 20px;
      left: 0;
      max-width: 100vw;
      overflow-y: auto;
      max-height: calc(100vh - 53px);
    }
    .FooterButtons {
      display: grid;
      grid-gap: 0.5rem;
      grid-template-columns: 0.75fr 1fr;
    }
    .editing .FooterButtons {
      padding-bottom: 1rem;
    }
  }
</style>

<form
  class="Footer"
  class:editing
  action="/api/batch-update"
  on:submit={submit}>
  <!--
  {#if editing}-->
  <div>
    <Input placeholder="First Author, Second Author" name="updateAddAuthors">
      Add authors:
    </Input>
  </div>
  <div>
    <TypeSelect noDefault={true}>Change type:</TypeSelect>
  </div>

  <div class="Stacks">
    <AddCollections />
    {#if editSource.length === 1 && editSource[0].tags.some((tag) => tag.type === 'stack')}
      <ul
        class="RemoveStacks"
        style={`grid-template-columns: repeat(${editSource[0].tags.length}, max-content)`}>
        {#each editSource[0].tags as stack}
          {#if stack.type === 'stack' && !removeTag.some((getId) => getId === stack.shortId)}
            <li>
              {stack.name}
              <span on:click={() => test(stack.shortId)} />
            </li>
          {/if}
        {/each}
      </ul>
    {/if}
  </div>

  <div class="Notebooks">
    <AddNotebooks />
  </div>

  <span class="FooterButtons">
    <SecondaryButton
      click={() => {
        editing = false;
      }}>
      Cancel
    </SecondaryButton>
    <Button type="submit">Save</Button>
  </span>
</form>
<!--
  {:else}
    <span class="FooterNumber">
      <SecondaryButton
        click={() => {
          endSelection();
        }}>
        Cancel
      </SecondaryButton>
    </span>
    <span class="FooterButtons">
      <RiskyButton click={remove}>Delete</RiskyButton>
      <Button
        click={() => {
          editing = true;
        }}>
        Edit
      </Button>
    </span>
  {/if}
</form>-->
