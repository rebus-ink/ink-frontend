<script>
  import NotesFound from "../../addItems/Tools/NotesFound.svelte";
  import NoDeletion from "../../img/NoDeletion.svelte";
  import IcoNotebook from "../../img/IcoNotebook.svelte";
  import NavSource from "../../img/NavSource.svelte";

  export let remove;
  export let activeModal;
  export let items;
</script>

<style>
  .Modal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    top: 0;
    left: 0;
    z-index: 5;
  }
  .Modal section {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--main-background-color);
    border-radius: 30px;
    margin: 0;
    padding: 40px;
    width: 60vw;
    display: grid;
    gap: 30px;
  }
  .Modal section :global(svg) {
    margin: 0 auto;
  }
  .Modal p {
    margin: 0;
    font-size: 0.9rem;
  }
  .Modal section ul {
    padding: 0;
    margin: 0;
    overflow-y: scroll;
    max-height: 35vh;
    display: grid;
    gap: 10px;
  }
  .Modal .Footer {
    display: grid;
    gap: 30px;
    grid-template-columns: max-content max-content;
    justify-content: flex-end;
  }
  .Modal .Footer .Button {
    width: 130px;
    max-height: 40px;
    padding: 10px 0;
    text-align: center;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0;
  }
  .Modal .Footer .Button.Deletion {
    color: #ffffff;
    background: #f05657;
  }
  .Modal .Footer .Button.Deletion:hover {
    background: #dd3d3d;
  }
  .Modal .Footer .Button.Cancel {
    padding: 8px 0;
    color: var(--workspace-color);
    border: 2px solid var(--workspace-color);
    background: var(--main-background-color);
  }
  .Modal .Footer .Button.Cancel:hover {
    color: var(--main-background-color);
    background: var(--workspace-color);
  }
  /*------------------------------------------------*/
  /*------------- Styles for notes list ------------*/
  /*------------------------------------------------*/
  .Modal.Remove ul :global(li[class*="colour"]) {
    padding: 10px 20px;
    border-radius: 10px;
    grid-gap: 3px;
    cursor: default;
    border-radius: 15px;
  }
  .Modal.Remove ul :global(li[class*="colour"]:hover) {
    background: #ffffff;
  }
  .Modal ul :global(.Found),
  .Modal ul :global(.Found:last-child) {
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 10px;
    border-bottom: 1px solid #dddddd !important;
  }
  .Modal :global(.Found.colour1),
  .Modal ul :global(li.colour1:last-child) {
    border: 1px solid #ffe4cb;
    border-bottom: 1px solid #ffe4cb !important;
  }
  .Modal :global(.Found.colour2),
  .Modal ul :global(li.colour2:last-child) {
    border: 1px solid #fcd5e5;
    border-bottom: 1px solid #fcd5e5 !important;
  }
  .Modal :global(.Found.colour3),
  .Modal ul :global(li.colour3:last-child) {
    border: 1px solid #7de8f8;
    border-bottom: 1px solid #7de8f8 !important;
  }
  .Modal :global(.Found.colour4),
  .Modal ul :global(li.colour4:last-child) {
    border: 1px solid #d3eacc;
    border-bottom: 1px solid #d3eacc !important;
  }
  .Modal :global(li.Found p) {
    font-size: 0.75rem;
  }
  .Modal section ul :global(.Highlight),
  .Modal section ul :global(.Note) {
    -webkit-line-clamp: 1;
  }
  .Modal section ul :global(.Highlight.noNote),
  .Modal section ul :global(li .noHighlight:not(:only-child)) {
    -webkit-line-clamp: 2;
  }
  .Modal section ul :global(.noHighlight) {
    -webkit-line-clamp: 3;
  }
  li.Source {
    display: grid;
    grid-template-columns: max-content 1fr;
    float: left;
    border-radius: 10px;
    align-items: center;
    grid-gap: 10px;
    padding: 10px 20px;
    background: #dde8ed;
  }
  li.Source p {
    text-overflow: ellipsis;
    font-size: 0.8rem;
    font-weight: 500;
    color: #333;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: inherit;
  }
  li.Source span {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    float: left;
    position: relative;
    background: #ffffff;
  }
  li.Source :global(svg) {
    width: 8px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  @media (max-width: 640px) {
    .Modal section {
      top: 0;
      left: 0;
      transform: translate(0, 0);
      border-radius: 0;
      width: 100vw;
      height: 100vh;
      grid-template-rows: repeat(4, max-content);
    }
  }
</style>

<div class="Modal Remove">
  <section>
    <NoDeletion />
    <p>
      You are about to remove {items.length} item{items.length > 1 ? 's' : ''}
      from your noteboook. This element{items.length > 1 ? 's' : ''} wont be
      deleted but you wont be able to acces {items.length > 1 ? 'them' : 'it'}
      frmo this notebook.
      <br />
      <strong>Are you sure you want to continue?</strong>
    </p>
    <ul>
      {#each items as item}
        {#if item.body}
          <NotesFound {item} addThis={false} itemType="note" />
        {:else if item.author}
          <li class="Source">
            <span>
              <NavSource />
            </span>
            <p>{item.name}</p>
          </li>
        {/if}
      {/each}
    </ul>
    <div class="Footer">
      <h5
        class="Button Cancel"
        on:click={() => {
          activeModal = false;
        }}>
        Cancel
      </h5>
      <h5 class="Button Deletion" on:click={() => remove()}>Remove</h5>
    </div>
  </section>
</div>
