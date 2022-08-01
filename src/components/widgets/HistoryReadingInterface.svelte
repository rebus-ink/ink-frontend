<script>
    import IcoGoBack from "../img/IcoGoBack.svelte";
    import { page, defaultNotebook } from "../../stores";
  
    let url;
    $: url = $defaultNotebook ? `/notebooks/${$defaultNotebook.shortId}` : "/library/all/all"
    $: atSource = $page.path.startsWith("/sources/") ? true : false;
  </script>
  
  <style>
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
    .breadcrumbs.atSource {
      margin-bottom: 0;
    }
    .breadcrumbs h5 {
      color: #888888;
      font-weight: 500;
      margin: 0;
      margin-left: 5px;
    }
    .breadcrumbs.atSource h5,
    .breadcrumbs.atSource :global(*) {
      color: var(--reader-titlebar-color);
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
  <a class="breadcrumbs" class:atSource href={url}>
    <IcoGoBack />
    <h5>Back</h5>
  </a>
  