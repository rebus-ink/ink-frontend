<style>
  .Loading {
    width: 2rem;
    height: 2rem;
    border-radius: 100%;
    background-color: transparent;
    box-shadow: 0 0 2px #f0f0f0, 0 0 4px var(--workspace-color);
    margin: 8rem auto;
    animation-duration: 1s;
    animation-name: loading;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    opacity: 0.5;
    grid-column: 1 / -1;
  }
  @keyframes loading {
    from {
      transform: scale(0.5);
      box-shadow: 0 0 2px #f0f0f0, 0 0 4px var(--workspace-color);
    }
    to {
      transform: scale(1.5);
      box-shadow: 0 0 0 3px var(--workspace-color), 0 0 0 20px #f0f0f0;
    }
  }
</style>

<div class="Loading" />
