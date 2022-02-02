<script>
    import NotesFound from "../addItems/Tools/NotesFound.svelte";
    import NoDeletion from "../img/NoDeletion.svelte";
    import IcoNotebook from "../img/IcoNotebook.svelte";
    import NavSource from "../img/NavSource.svelte";
  
    export let remove;
    export let activeModal;
    export let type;
    export let items;
    export let name;
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
    .Modal section ul.Notes :global(li) {
      padding: 10px 20px;
      border-radius: 10px;
      grid-gap: 3px;
      cursor: default;
      border-radius: 15px;
    }
    .Modal section ul.Notes :global(.Found:hover) {
      background: #ffffff;
    }
    .Modal :global(.Found),
    .Modal ul.Notes :global(li:last-child) {
      background: #ffffff;
      border: 1px solid #dddddd;
      border-bottom: 1px solid #dddddd !important;
    }
    .Modal :global(.Found.colour1),
    .Modal ul.Notes :global(li.colour1:last-child) {
      border: 1px solid #ffe4cb;
      border-bottom: 1px solid #ffe4cb !important;
    }
    .Modal :global(.Found.colour2),
    .Modal ul.Notes :global(li.colour2:last-child) {
      border: 1px solid #fcd5e5;
      border-bottom: 1px solid #fcd5e5 !important;
    }
    .Modal :global(.Found.colour3),
    .Modal ul.Notes :global(li.colour3:last-child) {
      border: 1px solid #7de8f8;
      border-bottom: 1px solid #7de8f8 !important;
    }
    .Modal :global(.Found.colour4),
    .Modal ul.Notes :global(li.colour4:last-child) {
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
    /*------------------------------------------------*/
    /*------------- Styles for notebooks -------------*/
    /*------------------------------------------------*/
    .Notebooks,
    .Sources {
      position: relative;
      z-index: 2;
    }
    .Notebooks li,
    .Sources li {
      display: grid;
      grid-template-columns: max-content 1fr;
      float: left;
      border-radius: 10px;
      align-items: center;
      grid-gap: 10px;
      padding: 10px 20px;
      background: #dde8ed;
    }
    .Notebooks p,
    .Sources p {
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
    .Notebooks span,
    .Sources span {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      float: left;
      position: relative;
      background: #ffffff;
    }
    .Notebooks span :global(svg),
    .Sources :global(svg) {
      width: 8px;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    /*----- Colours -----*/
    .Notebook.colour1 {
      background: #f5d2d2;
    }
    .Notebook.colour2 {
      background: #d4ccea;
    }
    .Notebook.colour3 {
      background: #fae59b;
    }
    .Notebook.colour4 {
      background: #cceadf;
    }
    .Notebook.colour1 span {
      background: #fcf8f8;
    }
    .Notebook.colour1 :global(svg) {
      color: #a43939;
    }
    .Notebook.colour2 span {
      background: #faf8fc;
    }
    .Notebook.colour2 :global(svg) {
      color: #6f4c9b;
    }
    .Notebook.colour3 span {
      background: #fdfaeb;
    }
    .Notebook.colour3 :global(svg) {
      color: #8f7000;
    }
    .Notebook.colour4 span {
      background: #f8fcfc;
    }
    .Notebook.colour4 :global(svg) {
      color: #4c9b92;
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
  
  <div class="Modal">
    <section>
      <NoDeletion />
      <p>
        {#if type === 'notebook' && items.length === 1}
          This action will delete the entire notebook, and will automatically
          untag all notes and sources.
          <br />
          <strong>Are you sure you want to delete "{items[0].name}"?</strong>
        {:else if items.length === 1}
        <p>
            This action will delete your {type}. This action cannot be undone. This
            operation cannot be undone.
            <br />
            <strong>Are you sure you want to delete {name ? name : `this ${type}`}?</strong>
          </p>
        {:else}
          You are about to delete {items.length} {type}{items.length > 1 ? 's' : ''}.
          This operation cannot be undone.
          <br />
          <strong>Are you sure you want to continue?</strong>
        {/if}
      </p>
      <ul class="{type.charAt(0).toUpperCase()}{type.slice(1)}s">
        {#each items as item}
          {#if type === 'note'}
            <NotesFound {item} addThis={false} itemType="note" />
          {:else if type === 'source'}
            <li class="Source">
              <span>
                <NavSource />
              </span>
              <p>{item.name}</p>
            </li>
          {:else}
            <li class="Notebook {item && item.settings && item.settings.colour}">
              <span>
                <IcoNotebook />
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
        <h5 class="Button Deletion" on:click={() => remove()}>Delete</h5>
      </div>
    </section>
  </div>
  