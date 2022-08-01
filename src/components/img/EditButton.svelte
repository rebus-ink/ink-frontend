<script>
  export let click;
  export let label;
</script>

<style>
  .Button,
  .Button:link {
    font-family: var(--sans-fonts);
    font-size: var(--item-font-size);
    flex: 0 1 auto;
    line-height: 1;

    display: none;

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
    color: var(--workspace-color);
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    /* transition: box-shadow 0.15s ease-in-out; */
    background: transparent;
    border-radius: 3px;
    text-decoration: none !important;
    transition: background-color 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    border: 1px solid currentColor;
    position: absolute;
    top: 15px;
    right: 0; /*
    top: 0;
    transform: translateY(-50%);*/
    background-color: var(--reader-info-background);
  }
  .Button:hover {
    color: var(--hover);
  }
  .Button:active {
    color: var(--active);
  }
  @media (max-width: 720px) {
    .Button {
      display: flex;
    }
  }
</style>

<button class="Button" aria-label={label} type="button" on:click={click}>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.5509 5.6562C16.1367 5.07041 17.0864 5.07041 17.6722 5.65619L18.3793
      6.3633C18.9651 6.94909 18.9651 7.89884 18.3793 8.48462L8.9358
      17.9282L5.20914 18.8264L6.10737 15.0997L15.5509 5.6562Z"
      stroke="currentColor" />
    <rect
      x="6.70709"
      y="14.8535"
      width="3.68814"
      height="0.5"
      transform="rotate(45 6.70709 14.8535)"
      fill="#002230"
      stroke="currentColor"
      stroke-width="0.5" />
  </svg>
</button>
