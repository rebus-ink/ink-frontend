<script>
  import IcoDelete from "../../img/IcoDelete.svelte";
  import { page, refreshOutline } from "../../../stores";
  import { getToken } from "../../../getToken";
  import SmallLoader from '../../widgets/SmallLoader.svelte'
  export let item;
  export let editing = false;
  export let requesting = false;

  let header;
  let init = () => {
    header = item.body[0].content;
  };

  let Cancel = () => {
    editing = false;
  };

  let Save = async () => {
    requesting = true;
    const payload = Object.assign(
      {},
      {
        body: [{ content: header, motivation: "commenting", language: "null" }],
      }
    );
    payload["shortId"] = item.shortId;

    try {
      await fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}/notes`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          },
        }
      );
      $refreshOutline = { id: $page.params.outlineId, time: Date.now() };
      requesting = false;
      editing = false;
    } catch (err) {
      console.error(err);
    }
  };

  let Delete = async () => {
    requesting = true;
    try {
      await fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}/notes`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify({ shortId: item.shortId }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          },
        }
      );
      $refreshOutline = { id: $page.params.outlineId, time: Date.now() };
      requesting = false;
      editing = false;
    } catch (err) {
      console.error(err);
    }
  };
</script>

<style>
  .Item {
    padding: 0 40px 0 0;
  }
  .Item.editing {
    padding: 0;
  }
  .Item:not(.editing) {
    cursor: pointer;
  }
  .Item h3 {
    font-weight: 600;
    margin: 0;
    cursor: pointer;
  }
  :global(#dnd-action-dragged-el.header) {
    background: #ffffff !important;
    padding: 16px !important;
    border-radius: 20px !important;
  }
  :global(#dnd-action-dragged-el.Item.header),
  :global(#dnd-action-dragged-el.Card.header) {
    min-height: 60px;
    max-height: 230px;
    overflow: hidden;
    display: grid !important;
  }
  .editing {
    display: grid;
    grid-template-rows: repeat(3, max-content);
  }
  .editing input {
    font-size: 1.1rem;
    font-weight: 500;
    background: var(--main-background-color);
    padding: 10px;
    border: 1px solid #dde8ed;
    border-radius: 10px;
  }
  .Cancel {
    border: 1px solid var(--workspace-color);
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    /* Never assume that the default padding is always going to be zero, either
     use a reset stylesheet or always reset it in your styles */
    padding: 0;
    cursor: pointer;
    transform: translateX(120%) rotate(45deg);
    background: none;
    transition: all 0.25s ease-out;
  }
  .Cancel:hover {
    background: var(--workspace-color);
  }
  .Cancel::before,
  .Cancel::after {
    content: "";
    width: 50%;
    height: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    transition: all 0.25s ease-out;
    background: var(--workspace-color);
  }
  .Cancel::after {
    height: 50%;
    width: 2px;
  }
  .Cancel:hover::before,
  .Cancel:hover::after {
    background: var(--main-background-color);
  }
  .Counter {
    color: #888888;
    font-size: 0.65rem;
    margin: 0;
    float: left;
    margin-bottom: 10px;
    font-style: italic;
    width: 100%;
    text-align: left;
  }
  footer {
    display: flex;
    justify-content: space-between;
  }
  button.Save {
    background: var(--action);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    height: 34px;
    font-weight: 500;
    padding: 0 25px;
    cursor: pointer;
  }
  button.Delete {
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    width: 34px;
    height: 34px;
    position: relative;
    cursor: pointer;
    padding: 0;
    transition: all 0.25s ease-out;
  }
  button.Delete:hover {
    background: rgba(239, 86, 87, 0.1);
    border: 1px solid #f05657;
  }
  button.Delete :global(svg) {
    color: #f05657;
    height: 60%;
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

{#if editing === item.shortId}
  <main class="Item NewHeader editing">
    <input type="text" maxlength="100" bind:value={header} use:init />
    <p class="Counter">
      {header ? 100 - header.length : 100} character{header && header.length === 99 ? '' : 's'}
      left
    </p>
    <button class="Cancel" on:click={Cancel} />
    <footer>
      <button class="Delete" on:click={Delete}>
        <IcoDelete />
      </button>
      <button class="Save" on:click={Save}>Save</button>
    </footer>
  </main>
{:else}
  <main
    class="Item NewHeader"
    on:click={() => {
      editing = item.shortId;
    }}>
        {#if item.display === 'pending'}
        <div class="loader"><SmallLoader /></div>
        {/if}
        {#if item.display === 'error'}
        ERROR!!!
        {/if}
    <h3>{item.body[0].content}</h3>
  </main>
{/if}
