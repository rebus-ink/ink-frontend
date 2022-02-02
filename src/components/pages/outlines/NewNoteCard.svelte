<script>
  import IcoDelete from "../../img/IcoDelete.svelte";
  import { page, refreshOutline } from "../../../stores";
  import { getToken } from "../../../getToken";
  import NoteEditor from "../../widgets/NoteEditor.svelte";
  import SmallLoader from "../../widgets/SmallLoader.svelte"
  export let item;
  export let editing = false;
  export let requesting = false;

  let thought;
  $: if (editing === item.shortId && !thought) thought = item.body[0].content;

  let Cancel = () => {
    editing = false;
  };

  let Save = async () => {
    requesting = true;
    const payload = Object.assign(
      {},
      {
        body: [
          { content: thought, motivation: "commenting", language: "null" },
        ],
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
      editing = false
    } catch (err) {
      console.error(err);
    }
  };
</script>

<style>
  .Item,
  :global(#dnd-action-dragged-el.note) {
    background: var(--main-background-color);
    border-radius: 20px;
    display: grid;
    position: relative;
    overflow: hidden;
  }
  .Item {
    padding: 16px 40px 16px 16px;
  }
  :global(#dnd-action-dragged-el.note) {
    max-height: 230px;
    padding: 16px !important;
  }
  .Item.OutlineEdit {
    padding: 16px;
  }
  :global(#dnd-action-dragged-el.Item.note),
  :global(#dnd-action-dragged-el.Card.note) {
    background: #ffffff !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    max-height: 230px;
    min-height: 100px;
  }
  .Item :global(*),
  :global(#dnd-action-dragged-el.note *) {
    font-size: 0.75rem;
    line-height: 0.9rem;
    margin: 0;
    color: #333 !important;
    background: transparent !important;
  }
  .Item :global(strong),
  :global(#dnd-action-dragged-el.note strong) {
    font-weight: 700;
  }
  .Item:not(.OutlineEdit) {
    cursor: pointer;
  }
  .Cancel {
    border: 1px solid var(--workspace-color);
    border-radius: 50%;
    position: absolute;
    top: 15px;
    right: 15px;
    width: 20px;
    height: 20px;
    /* Never assume that the default padding is always going to be zero, either
     use a reset stylesheet or always reset it in your styles */
    padding: 0;
    cursor: pointer;
    transform: rotate(45deg);
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
  footer {
    display: flex;
    margin-top: 10px;
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
  .OutlineEdit :global(.Editor .ql-editor) {
    padding: 12px 2px;
  }
</style>

{#if editing === item.shortId}
  <div class="Item OutlineEdit">
    <NoteEditor bind:richtext={thought} html={thought} />
  </div>
  <button class="Cancel" on:click={Cancel} />
  <footer>
    <button class="Delete" on:click={Delete}>
      <IcoDelete />
    </button>
    <button class="Save" on:click={Save}>Save</button>
  </footer>
{:else}
  <div
    class="Item"
    on:click={() => {
      editing = item.shortId;
    }}>
        {#if item.display === 'pending'}
        <div class="loader"><SmallLoader /></div>
        {/if}
        {#if item.display === 'error'}
        ERROR!!!
        {/if}
    <p class="Note">
      {@html item.body[0].content}
    </p>
  </div>
{/if}
