<style>
    .Loading {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 100%;
      background-color: transparent;
      box-shadow: 0 0 2px #f0f0f0, 0 0 2px var(--workspace-color);
      margin: 0.3rem 0.3rem;
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
        box-shadow: 0 0 1px #f0f0f0, 0 0 2px var(--workspace-color);
      }
      to {
        transform: scale(1.5);
        box-shadow: 0 0 0 3px var(--workspace-color), 0 0 0 10px #f0f0f0;
      }
    }
  </style>
  
  <div class="Loading" />
  