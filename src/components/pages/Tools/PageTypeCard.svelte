<script>

  import PageIcoOutline from "../../img/PageIcoOutline.svelte";
  import PageIcoMindmap from "../../img/PageIcoMindmap.svelte";
  import IcoStartArrow from "../../img/IcoStartArrow.svelte";
  import PageIcoGrouping from "../../img/PageIcoGrouping.svelte";

  export let type;
  export let submit;

  let assignIco = (icon) => {
    switch (icon) {
      case "outline":
        return PageIcoOutline;
      case "mindmap":
        return PageIcoMindmap;
      case "affinity map":
        return PageIcoGrouping;
    }
  };
</script>

<style>
  .PageCard {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    width: 100%;
    padding: 22px 0px;
    display: grid;
    position: relative;
    border: 1px solid #eeeeee;
    grid-template-rows: repeat(3, max-content);
    transition: all 0.2s ease-out;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.05);
  }
  .PageCard.outline {
    cursor: pointer;
  }
  .PageCard.outline:hover {
    background: rgba(255, 255, 255, 1);
  }
  .PageCard .Icon {
    background: var(--main-background-color);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 auto 10px;
    display: grid;
    align-items: center;
    justify-content: center;
  }
  .PageCard .Icon :global(svg) {
    color: var(--workspace-color);
    height: 15px;
    width: auto;
  }
  .PageCard.mindmap .Icon :global(svg) {
    height: 20px;
  }
  .PageCard h4,
  .PageCard p:not(.Unable) {
    margin: 0;
    font-weight: 600;
  }
  .PageCard h4 {
    color: var(--action);
    text-align: center;
    font-size: 0.9rem;
    text-transform: capitalize;
  }
  .PageCard p:not(.Unable) {
    color: #333;
    font-size: 0.7rem;
    display: grid;
    grid-template-columns: max-content max-content;
    align-items: center;
    gap: 8px;
    margin: 0 auto;
  }
  /*---- Empty ----*/
  .PageCard.Empty {
    box-shadow: inherit;
    border: 1px solid #dde8ed;
    background: var(--main-background-color);
  }
  .PageCard.Empty .Icon {
    background: #ffffff;
  }
  .PageCard.Empty .Icon :global(svg) {
    color: var(--action);
  }
  .PageCard.Empty p:not(.Unable) {
    color: var(--action);
  }
  .PageCard.Empty p span {
    width: 7px;
    height: 7px;
    position: relative;
  }
  .PageCard.Empty p span::before,
  .PageCard.Empty p span::after {
    content: "";
    width: 2px;
    height: 100%;
    background: var(--action);
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .PageCard.Empty p span::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .PageCard.Loader {
    overflow: hidden;
    height: 199px;
    padding: 0;
  }
  .PageCard.Loader :global(div.Loading) {
    margin: 5.5rem auto;
  }
  .PageCard:not(.outline) {
    border: 1px solid var(--workspace-color);
    background: rgb(255, 255, 255, 0.1);
  }
  .PageCard:not(.outline) .Icon {
    background: var(--workspace-color);
  }
  .PageCard:not(.outline) .Icon :global(svg),
  .PageCard:not(.outline) p {
    color: rgb(255, 255, 255, 0.3);
  }
  .PageCard:not(.outline) h4 {
    color: rgb(255, 255, 255, 0.5);
  }
</style>

<div class={`PageCard ${type}`} on:click={type === 'outline' ? submit : ''}>
  <div class="Icon">
    <svelte:component this={assignIco(type)} />
  </div>
  <h4>{type}</h4>
  <p>
    {#if type === 'outline'}
      Create & work
      <IcoStartArrow />
    {:else}
      <span />
      Coming soon!
    {/if}
  </p>
</div>
