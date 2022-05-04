<script>

    export let menu;
    export let itemState;
  </script>
  
  <style>
    .tabsSection {
      display: grid;
      grid-template-columns: repeat(3, max-content);
      grid-gap: 40px;
      margin-bottom: 30px;
      margin-left: 9px;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(2, max-content);
      width: 50%;
      grid-gap: 35px;
      position: relative;
    }
    ul.itemType .source:hover ~ span {
      left: -9px !important;
    }
    ul.itemType .notes:hover ~ span {
      left: 91px !important;
    }
    ul.itemType .notes.active ~ span {
      left: 91px;
    }
    li {
      display: grid;
      grid-gap: 5px;
      align-items: center;
      cursor: pointer;
      grid-template-columns: max-content 1fr;
    }
    li :global(svg) {
      height: 12px;
      width: auto;
    }
    p {
      font-size: 0.9rem;
      font-weight: 500;
      margin: 0;
    }
    .itemState span {
      width: 12px;
      height: 12px;
      border: 1px solid var(--main-background-color);
      border-radius: 50%;
      position: relative;
    }
    .itemState .active span::after {
      content: "";
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      display: block;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: var(--main-background-color);
    }
    @media (max-width: 720px) {
      .tabsSection {
        grid-template-columns: 1fr;
      }
    }
  </style>
  
  <div class="tabsSection">
    <ul class="itemState">
      <li
        class="new {itemState === 'new' ? 'active' : ''}"
        on:click={() => menu('new')}>
        <span />
        <p>Note Editor</p>
      </li>
      <li
        class="existing {itemState === 'upload' ? 'active' : ''}"
        on:click={() => menu('upload')}>
        <span />
        <p>Upload</p>
      </li>

    </ul>
  </div>