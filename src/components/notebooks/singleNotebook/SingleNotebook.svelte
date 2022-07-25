<script>
  import AddItems from "../../addItems/AddItemsInNotebook.svelte";
  import SingleNotebookList from "./SingleNotebookList.svelte";
  import NavNotebook from "../../img/NavNotebook.svelte";
  import IcoEdit from "../../img/IcoEdit.svelte";
  import IcoGoBack from "../../img/IcoGoBack.svelte";
  import { notebook, refreshNotebook, page, refreshNotebooks } from "../../../stores";
  import DeletionModal from "../../widgets/DeletionModal.svelte";
  import EditCoverImage from "./EditCoverImage.svelte";
  import NoteEdit from "../../notes/noteEdit/NoteEdit.svelte";
  import { getToken } from "../../../getToken";

  let activeModal = false;
  let clickPage = false;
  let error = false;
  async function remove() {

    try {
      await fetch(`/api/notebooks/${$notebook.shortId}`, {
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
    $refreshNotebooks = Date.now()
    window.history.back()

  }
  $: if (newValue === "" && itemEdit === "name") {
    error = true;
  } else {
    error = false;
  }

  let itemEdit,
    newValue,
    init = (e, current) => {
      e.focus();
      newValue = current;
    };

  $: characters = newValue ? 150 - newValue.length : 150;

  async function submit(e) {
    e.preventDefault();
    if (itemEdit !== "description" && !newValue) return;

    try {
      const payload = Object.assign({settings: {}}, $notebook);
      if (itemEdit === "cover") payload["settings"]["coverImg"] = newValue;
      else payload[itemEdit] = newValue;

      await window.fetch(`/api/notebooks/${$notebook.shortId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "csrf-token": getToken(),
        },
      });

      itemEdit = false;
      newValue = "";
      $refreshNotebook = { id: notebook, time: Date.now() };
    } catch (err) {
      console.error(err);
    }
  }
</script>

<style>
  .Toolbar {
    display: grid;
    top: 0;
    position: relative;
    grid-template-columns: 1fr max-content;
    grid-gap: 20px;
    background-color: #ffffff;
    z-index: 3;
    padding: 20px calc(var(--base) * 2);
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
  .Toolbar > section {
    display: grid;
    grid-gap: 10px;
    margin: 0;
  }
  .Toolbar section * {
    float: left;
  }
  .Header {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 20px;
  }
  .Title {
    display: grid;
    grid-template-columns: 34px 1fr;
    grid-gap: 10px;
    align-items: center;
  }
  .Title :global(svg) {
    width: 16px;
    margin-right: 5px;
    float: left;
  }
  .library {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 130px 1fr;
  }
  .library h3 {
    font-weight: 600;
    margin: 0;
    cursor: pointer;
  }
  .Img {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 10px;
  }
  .Description {
    margin: 0;
    cursor: pointer;
    background: #ffffff;
    font-size: 0.9rem;
  }
  .Info {
    display: grid;
    grid-gap: 10px;
  }
  .Icon {
    border-radius: 50%;
    width: 34px;
    height: 34px;
    position: relative;
    background: var(--main-background-color);
  }
  .Icon :global(svg) {
    width: 15px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .Delete {
    color: #f05657;
    text-decoration: underline;
    cursor: pointer;
  }
  /*----- Name/description edition -----*/
  .NameCont {
    display: grid;
    gap: 10px;
    grid-template-columns: minmax(100px, 350px) max-content max-content;
  }
  .NameEdit {
    padding: 5px 10px;
    font-size: 1rem;
    border-radius: 7px;
    border: 1px solid #dde8ed;
    background: var(--main-background-color);
    color: var(--action);
    font-weight: 500;
  }
  .error {
      color: red !important;
      border: 1px solid red;
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
  .Name :global(svg),
  .Description :global(svg) {
    position: absolute;
    margin-right: 0;
    width: 40px;
    opacity: 0;
    transition: all 0.25s ease-out;
  }
  .Name:hover :global(svg),
  .Description:hover :global(svg) {
    opacity: 1;
  }
  .Edition textarea {
    resize: none;
    padding: 5px 10px;
    font-size: 0.8rem;
    border-radius: 7px;
    border: 1px solid #dde8ed;
    background: var(--main-background-color);
    color: var(--action);
    font-weight: 500;
  }
  .DescCont {
    display: grid;
    gap: 10px;
    grid-template-columns: minmax(100px, 350px);
  }
  .DescCont .DescButtons {
    display: grid;
    align-items: flex-start;
    gap: 10px;
    grid-template-columns: 1fr repeat(2, max-content);
  }
  .DescCont .DescButtons button {
    padding: 7px 15px;
    border: 2px solid var(--action);
  }
  .DescCont .Characters {
    font-style: italic;
    opacity: 0.7;
    color: #888888;
    margin: 0;
    font-size: 0.75rem;
  }
  /*----- Cover image edition -----*/
  .library .Img {
    overflow: hidden;
    position: relative;
  }
  .CoverCont {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0);
    transition: all 0.25s ease-out;
    border: none;
    cursor: pointer;
  }
  .CoverCont:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .CoverCont :global(svg) {
    border-radius: 50%;
    transition: all 0.25s ease-out;
    background: rgba(255, 255, 255, 0.7);
    padding: 5px;
    width: 38px;
    opacity: 0;
    height: auto;
  }
  .CoverCont:hover :global(svg) {
    opacity: 1;
  }
  /*-------- Notes editor --------------*/
  .NotesEditor {
    grid-template-columns: 300px 1fr;
    grid-gap: 20px;
    display: grid;
  }
  .NotesEditor :global(.CardHeader) {
    display: none;
  }
  .NotesEditor :global(.Cards) {
    padding: 20px 20px 0 20px;
    height: 100vh;
    overflow-y: scroll;
    position: sticky;
    top: 0;
  }
  .NotesEditor :global(.Cards:last-child::after) {
    content: "";
    background: transparent;
    width: 100%;
    height: 1px;
    float: left;
  }

  @media (max-width: 720px) {
    nav.Toolbar::before {
      content: none;
    }
    .Toolbar {
      position: relative;
      padding: calc(var(--base) * 1.5) calc(var(--base) * 2);
      grid-template-columns: 1fr;
    }
    .Toolbar:first-child:nth-last-child(5) :global(.new-button) {
      display: none;
    }
    .library {
      grid-template-columns: 1fr;
    }
    .Img {
      width: 100%;
      height: 100px;
    }
    .NotesEditor {
      grid-template-columns: 1fr;
    }
    .NotesEditor .notesList {
      display: none;
    }

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

{#if !$page.params.noteId}
  <nav class="Toolbar">
    <section>
      <div class="Header">
        <a class="breadcrumbs" href={`/notebooks`}>
          <IcoGoBack />
          <h5>Back</h5>
        </a>
                <h5
          class="Delete"
          on:click={() => {
            activeModal = true;
          }}>
          Delete notebook
        </h5>
      </div>
      <div class="library">
        {#if $notebook.shortId}
          <div
            class="Img"
            style={`background-image: url("/img/NotebookImg/${$notebook.settings ? $notebook.settings.coverImg : 'mike-c-s-7HlJkjH3k60'}.jpg")`}>
            <button
              class="CoverCont"
              on:click={() => {
                itemEdit = 'cover';
                document.querySelector('nav').classList.remove('ntbkModal');
              }}>
              <IcoEdit />
            </button>
          </div>
          <div class="Info">
            <div class="Title">
              <div class="Icon">
                <NavNotebook />
              </div>
              {#if itemEdit === 'name'}
                <div class="NameCont Edition">
                  <input
                    class={error ? "error NameEdit" : "NameEdit"}
                    type="text"
                    use:init={$notebook.name}
                    placeholder="Name is required"
                    bind:value={newValue} />

                  <button
                    class="Cancel"
                    on:click={() => {
                      itemEdit = false;
                    }}>
                    Cancel
                  </button>
                  <button
                    class="Save"
                    on:click={(e) => {
                      submit(e);
                    }}>
                    Save
                  </button>
                </div>
              {:else}
                <h3
                  class="Name"
                  on:click={() => {
                    itemEdit = 'name';
                  }}>
                  {$notebook.name}
                  <IcoEdit />
                </h3>
              {/if}
            </div>
            {#if itemEdit === 'description'}
              <div class="DescCont Edition">
                <textarea
                  class="DescEdit"
                  use:init={$notebook.description}
                  placeholder="Add a description (optional)"
                  bind:value={newValue}
                  maxlength="150" />
                <div class="DescButtons">
                  <p class="Characters">{characters} characters left</p>
                  <button
                    class="Cancel"
                    on:click={() => {
                      itemEdit = false;
                    }}>
                    Cancel
                  </button>
                  <button
                    class="Save"
                    on:click={(e) => {
                      submit(e);
                    }}>
                    Save
                  </button>
                </div>
              </div>
            {:else}
              <div
                class="Description"
                on:click={() => {
                  itemEdit = 'description';
                }}>
                {#if $notebook.description}
                  {$notebook.description}
                {:else}Add description...{/if}
                <IcoEdit />
              </div>
            {/if}
          </div>
        {:else}
          <div class="Title">
            <div class="Icon">
              <NavNotebook />
            </div>
            <h3>...</h3>
          </div>
        {/if}
      </div>
    </section>
    <AddItems notebook={$notebook} bind:clickPage />
  </nav>
{/if}
<div class="CardsContent" class:NotesEditor={$page.params.noteId}>
  <div class="notesList">
    <SingleNotebookList notebook={$notebook} bind:clickPage />
  </div>
  {#if $page.params.noteId}
    <NoteEdit />
  {/if}
</div>
{#if activeModal}
  <DeletionModal
    {remove}
    bind:activeModal
    type="notebook"
    name={$notebook.name}
    items={[$notebook]} />
{/if}
{#if itemEdit === 'cover'}
  <EditCoverImage
    bind:itemEdit
    currentCover={$notebook.settings ? $notebook.settings.coverImg : ''}
    bind:newValue
    {submit} />
{/if}
