<script>
  import ArrowDropDown from "../img/ArrowDropDown.svelte";
  import Awesomplete from "awesomplete";
  export let name;
  export let placeholder = "";
  export let dark = false;
  export let type = "text";
  export let list = false;
  export let value;
  export let change = () => {};
  let input;
  let awesomplete;
  $: if (input && list) {
    awesomplete = new Awesomplete(input, { list, minChars: 0 , sort: false});
    input.addEventListener("awesomplete-selectcomplete", (event) => {
      change(input, event.text);
    });
  }
  $: if (awesomplete && list) {
    awesomplete.list = list;
    
  }
</script>

<style>
  :global(.awesomplete [hidden]) {
    display: none;
  }

  :global(.awesomplete .visually-hidden) {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }

  :global(.awesomplete) {
    display: block;
    position: relative;
  }

  :global(.awesomplete > input) {
    display: block;
  }

  :global(.awesomplete > ul) {
    position: absolute;
    left: 0;
    z-index: 1;
    min-width: 100%;
    box-sizing: border-box;
    list-style: none;
    margin: 0;
    background: #fff;
    color: #000;
    padding: 0.5rem;
    box-shadow: 1px 1px 11px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  :global(.Footer .awesomplete > ul) {
    top: 0;
    transform: translateY(calc(-100% - 3px));
  }

  :global(.awesomplete > ul:empty) {
    display: none;
  }
  .LabelText {
    font-weight: 500;
    font-size: 0.8rem;
  }
  .dark {
    color: white;
  }
  input {
    width: 100%;
    font-size: 0.85rem;
    padding: calc(var(--base) * 0.5);
    margin: calc(var(--base) * 0.25) 0;
    border-radius: 10px;
    border: 1px solid #eeeeee;
    background-color: white;
  }
  .dark input {
    border-color: transparent;
    color: var(--all-workspace);
    background-color: hsla(0, 0%, 100%, 0.1);
  }
  input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(104, 214, 212, 0.6);
  }
  .dark input:focus {
    box-shadow: 0 0 2px 2px white;
  }
  .dark input::placeholder {
    color: #fff;
  }
  label > :global(svg) {
    right: 15px !important;
    top: inherit !important;
    color: #ffffff !important;
    bottom: 18px;
  }
  @media (max-width: 720px) {
    .LabelText {
      font-size: 0.85rem;
    }
  }
</style>

<label class:dark>
  <div class="LabelText">
    <slot />
  </div>
  <ArrowDropDown />
  <input
    data-minchars="0"
    {type}
    {name}
    id="input-{name}"
    {placeholder}
    {value}
    on:change={change}
    bind:this={input}
    on:focus={() => {
      if (awesomplete.ul.childNodes.length === 0) {
        awesomplete.minChars = 0;
        awesomplete.evaluate();
      }
      awesomplete.open();
    }} />
</label>
