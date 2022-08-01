<script>
  import AboutCard from "./About.svelte";
  import DescriptionCard from "./Description.svelte";
  import InfoMenu from "./InfoMenu.svelte";
  import RelatedSources from "./RelatedSources.svelte";
  import Cover from "./Cover.svelte";
  let state = "About";
  let navState = section => {
    state = section;
  };
</script>

<style>
  .Reader {
    background-color: var(--reader-info-background);
    display: grid;
    grid-template-columns: minmax(350px, 1fr) minmax(auto, 800px);
    grid-gap: 3rem;
    padding: 2rem;
  }
  .Body {
    height: 100%;
    background-color: transparent;
  }
  .LeftSidebar {
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-gap: 40px;
  }

  @media (max-width: 900px) {
    .LeftSidebar {
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
    }
    .Reader {
      grid-template-columns: 150px 1fr;
    }
  }
  @media (max-width: 720px) {
    .Reader {
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
    }
  }
</style>

<div class="Reader">
  <div class="LeftSidebar">
    <InfoMenu {state} {navState} />
    <Cover />
  </div>
  <div class="Body">
    {#if state === 'About'}
      <DescriptionCard />
    {:else if state === 'Metadata'}
      <AboutCard />
    {:else}
      <RelatedSources />
    {/if}
  </div>
</div>
