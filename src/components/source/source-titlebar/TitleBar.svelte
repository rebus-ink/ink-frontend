<script>
  import History from "../../widgets/History.svelte";
  import { onMount } from "svelte";
  export let name = "";
  export let source;
  let Info;
  onMount(async () => {
    const module = await import("./Info.svelte");
    Info = module.default;
  });
</script>

<style>
  .TitleBar {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--all-workspace);
    position: sticky;
    top: 0;
    z-index: 99;
  }
  .TitleBar * {
    color: #ffffff;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 1rem 0.4rem;
  }
  .TitleBar ol li a {
    color: var(--reader-toolbar-color);
  }
</style>

<nav class="TitleBar" aria-label="Publication">
  <ol>
    <li>
      <History />
      <!--
      <a href={returnLink}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect
            x="1.70688"
            y="5.29285"
            width="9"
            height="2"
            rx="0.999999"
            transform="rotate(45 1.70688 5.29285)"
            fill="currentColor"
            fill-opacity="0.8" />
          <rect
            x="1.99985"
            y="5.50012"
            width="12"
            height="2"
            rx="1"
            fill="currentColor"
            fill-opacity="0.8" />
          <rect
            x="7.77817"
            y="1.41418"
            width="9"
            height="2"
            rx="0.999999"
            transform="rotate(135 7.77817 1.41418)"
            fill="currentColor"
            fill-opacity="0.8" />
        </svg>
      </a>-->
    </li>
    <li>
      <span class="Title">{name}</span>
    </li>
    <li>
      <a
        class="modal_link"
        href="#id-source-info"
        rel="external"
        on:click={(event) => {
          if (!document.getElementById('id-source-info')) {
            event.preventDefault();
          }
        }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="8"
            cy="8"
            r="7.25"
            stroke="currentColor"
            stroke-opacity="0.8"
            stroke-width="1.5" />
          <rect
            x="7"
            y="6.5"
            width="2"
            height="6.5"
            rx="1"
            fill="currentColor"
            fill-opacity="0.8" />
          <circle
            cx="8"
            cy="4.5"
            r="1"
            fill="currentColor"
            fill-opacity="0.8" />
        </svg>
      </a>
    </li>
  </ol>
</nav>

<svelte:component this={Info} {source} />
