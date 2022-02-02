<script>
  import History from "../../widgets/History.svelte";
  import IcoDelete from "../../img/IcoDelete.svelte";
  import IcoEdit from "../../img/IcoEdit.svelte";
  import DeletionModal from "../../widgets/DeletionModal.svelte";
  import { page, refreshOutline } from "../../../stores";
  import { getToken } from "../../../getToken";
  import { goto } from "@sapper/app";
  import IcoGoBack from "../../img/IcoGoBack.svelte"

  export let outlineInfo;
  export let notebook;
  let activeModal = false;
  let nameEdit = false;
  let newValue,
    init = (e, current) => {
      e.focus();
      newValue = current;
    };

  let remove = async () => {
    goto(`notebooks/${notebook.shortId}`);

    try {
      await fetch(`/api/pages/${$page.params.pageId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  let submit = async (e) => {
    const payload = Object.assign({}, outlineInfo);
    payload.name = newValue;

    try {
      await fetch(
        `/api/pages/${$page.params.pageId}/outlines/${$page.params.outlineId}`,
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "csrf-token": getToken(),
          },
        }
      );

      nameEdit = false;
      newValue = "";
      $refreshOutline = { id: $page.params.outlineId, time: Date.now() };
    } catch (err) {
      console.error(err);
    }
  };
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
    cursor: pointer;
    grid-template-columns: max-content max-content;
  }
  header h1 {
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--workspace-color);
    margin: 0;
  }
  header .Delete {
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    width: 34px;
    display: grid;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease-out;
  }
  header .Delete:hover {
    background: rgba(239, 86, 87, 0.1);
    border: 1px solid #f05657;
  }
  header .Delete :global(svg) {
    color: #f05657;
    height: 60%;
    width: auto;
  }
  /*----- Name/description edition -----*/
  .NameCont {
    display: grid;
    gap: 10px;
    grid-template-columns: minmax(100px, 350px) repeat(3, max-content);
    grid-template-rows: 30px;
  }
  .NameEdit {
    padding: 5px 10px;
    font-size: 1rem;
    border-radius: 7px;
    border: 1px solid #dde8ed;
    background: var(--main-background-color);
    color: var(--action);
    font-weight: 600;
  }
  .Edition button {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9px;
    align-items: center;
    display: grid;
    padding: 0 10px;
    border: none;
    cursor: pointer;
  }
  .Edition button.Save {
    background: var(--action);
    color: #fff;
  }
  .Edition button.Cancel {
    background: #ffffff;
    color: var(--action);
    border: 2px solid var(--action);
  }
  .Name :global(svg) {
    position: absolute;
    margin-right: 0;
    width: 40px;
    opacity: 0;
    transition: all 0.25s ease-out;
  }
  .Name:hover :global(svg) {
    opacity: 1;
  }
/* back button */
a {
         text-decoration: none;
     }
    .breadcrumbs {
      margin-bottom: 10px;
      padding: 0;
      border: none;
      background: transparent;
      display: flex;
      grid-template-columns: max-content 1fr;
      text-align: left;
      align-items: center;
      cursor: pointer;
      width: max-content;
    }
    .breadcrumbs h5 {
      color: #888888;
      font-weight: 500;
      margin: 0;
      margin-left: 5px;
    }
    @media (max-width: 720px) {
      .breadcrumbs {
        margin-bottom: 0;
        margin-top: 3px;
        grid-template-columns: max-content;
      }
      .breadcrumbs h5 {
        display: none;
      }
    }

</style>

<header>
  {#if notebook && notebook.shortId}
  <a class="breadcrumbs" href={`/notebooks/${notebook.shortId}`}>
    <IcoGoBack />
    <h5>Back</h5>
  </a>
  {:else}
  <History />
  {/if}
  <div class="Title">
    {#if nameEdit}
      <div class="NameCont Edition">
        <input
          class="NameEdit"
          required
          type="text"
          use:init={outlineInfo.name}
          placeholder="Enter title"
          bind:value={newValue} />
        <button
          class="Cancel"
          on:click={() => {
            nameEdit = false;
          }}>
          Cancel
        </button>
        <button class="Save" on:click={submit}>Save</button>
        <div
          class="Delete"
          on:click={() => {
            activeModal = true;
          }}>
          <IcoDelete />
        </div>
      </div>
    {:else}
      <h1
        class="Name"
        on:click={() => {
          nameEdit = true;
        }}>
        {outlineInfo.name ? outlineInfo.name : '...'}
        <IcoEdit />
      </h1>
    {/if}
  </div>
</header>
{#if activeModal}
  <DeletionModal {remove} type={"outline"} bind:activeModal {outlineInfo} />
{/if}
