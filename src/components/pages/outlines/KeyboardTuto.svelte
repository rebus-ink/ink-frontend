<script>
  import IcoGoBack from "../../img/IcoGoBack.svelte";
  export let tuto = false;
  export let from;
</script>

<style>
  .Tuto {
    gap: 50px;
    position: fixed;
    z-index: 1;
    bottom: 20px;
    display: grid;
    left: 20px;
    padding: 20px 50px;
    border-radius: 20px;
    background: rgba(224, 245, 245, 0.9);
  }
  .Tuto .Keys {
    display: grid;
    gap: 10px;
    text-align: center;
    grid-template-rows: 34px max-content;
  }
  .Tuto .Tab span.Icon {
    width: 69px;
  }
  .Tuto span.Icon {
    background: var(--workspace-color);
    display: grid;
    align-items: center;
    border-radius: 10px;
    height: 34px;
    width: 34px;
    margin: 0 auto;
  }
  .Tuto .KeyUp span.Icon {
    transform: rotate(90deg);
  }
  .Tuto .KeyDown span.Icon {
    transform: rotate(-90deg);
  }
  .Tuto span.Icon p {
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }
  .Tuto span.Icon :global(svg) {
    margin: 0 auto;
    color: #ffffff;
    width: 14px;
    height: auto;
  }
  .Tuto .Keys > p {
    color: var(--workspace-color);
    font-size: 0.75rem;
    font-weight: 500;
    margin: 0;
  }
  .Tuto .CloseTuto {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid var(--workspace-color);
    background: transparent;
    position: absolute;
    top: 10px;
    right: 10px;
    transition: all 0.25s ease-out;
    transform: rotate(45deg);
  }
  .Tuto .CloseTuto:hover {
    background: var(--workspace-color);
  }
  .Tuto .CloseTuto::before,
  .Tuto .CloseTuto::after {
    content: "";
    background: var(--workspace-color);
    border-radius: 10px;
    width: 2px;
    height: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .Tuto .CloseTuto::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .Tuto .CloseTuto:hover::before,
  .Tuto .CloseTuto:hover::after {
    background: rgba(224, 245, 245, 0.9);
  }
</style>

<div
  class="Tuto"
  style={`grid-template-columns: repeat(${from === 'outline' ? 4 : 2}, max-content);`}>
  <div class="Keys Tab">
    <span class="Icon">
      <p>Tab</p>
    </span>
    <p>Pick next item</p>
  </div>
  {#if from === 'outline'}
    <div class="Keys KeyUp">
      <span class="Icon">
        <IcoGoBack />
      </span>
      <p>Move item up</p>
    </div>
    <div class="Keys KeyDown">
      <span class="Icon">
        <IcoGoBack />
      </span>
      <p>Move item down</p>
    </div>
  {/if}
  <div class="Keys KeyLeft">
    <span class="Icon">
      <IcoGoBack />
    </span>
    <p>{from === 'outline' ? 'Save change' : 'Move note to outline'}</p>
  </div>
  <span
    class="CloseTuto"
    on:click={() => {
      tuto = false;
    }} />
</div>
