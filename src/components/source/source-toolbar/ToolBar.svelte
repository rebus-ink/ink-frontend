<script>
  import CloseSidebar from "../../img/IcoCloseColumn.svelte";
  import DefaultNotebookForm from "./DefaultNotebookForm.svelte"
  export let hidden = false;
  export let chapterTitle = "";
  export let sidebar;
</script>

<style>
  .ToolBar {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--reader-toolbar-background);
    border-bottom: 1px solid var(--reader-toolbar-border);
    color: var(--reader-toolbar-color);
    display: grid;
    grid-template-columns: 0.2fr 0.2fr 1fr 0.4fr;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    overflow: visible;
    z-index: 100;
    height: auto;
  }
  .section {
    display: flex;
  }
  .middle {
    margin: auto;
  }
  .left-center {
    margin-left: auto;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    padding: 0;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    padding: 0;
    align-items: center;
    padding: 0 0.75rem;
  }
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.125rem 0.25rem;
  }
  .left {
    display: flex;
    
  }
  .CloseSidebar {
    margin-left: auto;
  }
  .CloseSidebar :global(svg) {
    transform: rotate(180deg);
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .CloseSidebar.selected :global(svg) {
    transform: rotate(0deg);
  }
  .selected .Button {
    background-color: #dde8ed;
  }
  .Button,
  .Button:link {
    font-family: var(--sans-fonts);
    font-size: 0.75rem;
    flex: 0 1 auto;
    line-height: 1;

    display: inline-block;

    padding: 0;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    font-weight: 500;
    color: #002230;
    border-radius: 5px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    background-color: transparent;
    text-decoration: none !important;
    transition: background-color 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    border: none;
    line-height: 0.1;
    height: 2rem;
    width: 2rem;
    border-radius: 100%;
    padding: 0.25rem;
  }

  .Button:hover,
  .Button:link:hover,
  .Button:link:visited:hover,
  .Button:visited:hover,
  .Button:link:visited:hover {
    color: white !important;
    background-color: var(--rc-dark);
    box-shadow: none;
    text-decoration: none;
  }

  .Button:active,
  .Button:link:active {
    background-color: var(--active);
  }
  .Button:focus {
    outline: none;
    box-shadow: 0 0 0 3px #68d6d499;
  }

  @media (max-width: 720px) {
    .Button {
      font-size: 0.7rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
  .default-notebook-label {
    font-size:0.8rem;
  }
</style>

<nav class="ToolBar" {hidden} aria-labelledby="navigation-header">
  <div class="section left">
  <h2 class="visually-hidden" id="navigation-header" data-ink-private>
    Toolbar
  </h2>
  <ul style="transform: translateX(-10px);">

    <li class:selected={$sidebar.tab === 'toc' && !$sidebar.hidden}>
      <button
        class="Button"
        type="Button"
        aria-label="Show table of contents in sidebar"
        on:click={() => {
          const { hidden, tab } = $sidebar;
          $sidebar = { hidden, tab: 'toc' };
        }}
        aria-pressed={$sidebar.tab === 'toc' ? 'true' : 'false'}>
        <svg
          width="17"
          height="14"
          viewBox="0 0 17 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect x="3.5" width="13" height="1.5" rx="0.75" fill="currentColor" />
          <rect
            x="3.5"
            y="4"
            width="13"
            height="1.5"
            rx="0.75"
            fill="currentColor" />
          <rect
            x="6.5"
            y="8"
            width="10"
            height="1.5"
            rx="0.75"
            fill="currentColor" />
          <rect
            x="6.5"
            y="12"
            width="10"
            height="1.5"
            rx="0.75"
            fill="currentColor" />
          <circle cx="1.25" cy="0.75" r="0.75" fill="currentColor" />
          <circle cx="1.25" cy="4.75" r="0.75" fill="currentColor" />
          <circle cx="4.25" cy="8.75" r="0.75" fill="currentColor" />
          <circle cx="4.25" cy="12.75" r="0.75" fill="currentColor" />
        </svg>
      </button>
    </li>
    <li class:selected={$sidebar.tab === 'bookmarks' && !$sidebar.hidden}>
      <button
        class="Button"
        type="Button"
        aria-label="Show bookmarks in sidebar"
        on:click={() => {
          const { hidden, tab } = $sidebar;
          $sidebar = { hidden, tab: 'bookmarks' };
        }}
        aria-pressed={$sidebar.tab === 'bookmarks' ? 'true' : 'false'}>
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect
            x="1.25"
            y="0.75"
            width="11.5"
            height="14.5"
            rx="1.25"
            stroke="currentColor"
            stroke-width="1.5" />
          <path
            d="M9.49994 1H10.9999V7.25C10.9999 7.66421 10.6642 8 10.2499
            8C9.83573 8 9.49994 7.66421 9.49994 7.25V1Z"
            fill="currentColor" />
          <path
            d="M4.49994 1H5.99994V7.25C5.99994 7.66421 5.66415 8 5.24994
            8C4.83573 8 4.49994 7.66421 4.49994 7.25V1Z"
            fill="currentColor" />
          <rect
            x="7.75677"
            y="3.74329"
            width="1.5"
            height="4.93031"
            rx="0.75"
            transform="rotate(45 7.75677 3.74329)"
            fill="currentColor" />
          <rect
            width="1.5"
            height="4.9404"
            rx="0.75"
            transform="matrix(-0.707107 0.707107 0.707107 0.707107 7.76141
            3.73615)"
            fill="currentColor" />
        </svg>
      </button>
    </li>
  </ul>
</div>
<div class="section left-center">
  <ul>
    <li class="CloseSidebar" class:selected={$sidebar.hidden}>
      <button
        class="Button"
        type="Button"
        aria-label="Hide left sidebar"
        on:click={() => {
          const { hidden, tab } = $sidebar;
          $sidebar = { hidden: !hidden, tab };
        }}
        aria-pressed={$sidebar.hidden ? 'true' : 'false'}>
        <CloseSidebar />
      </button>
    </li>
  </ul>
  </div>
  <div class="section middle">
    {chapterTitle}
    </div>
    <div class="section right">
    <ol class="defaultNotebook">
      <li class="default-notebook-label">Default Notebook:</li>
      <li>
      <DefaultNotebookForm />
      </li>
    </ol>
    </div>

</nav>
