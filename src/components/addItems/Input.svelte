<script>
  export let name;
  export let placeholder = "";
  export let dark = false;
  export let type = "text";
  export let list = false;
  export let fullWidth = false;
  export let change = () => {};
</script>

<style>
  .LabelText {
    font-size: 0.8rem;
    font-weight: 500;
  }
  .dark {
    color: white;
  }
  input {
    width: 100%;
    float: left;
    font-size: 0.85rem;
    padding: calc(var(--base) * 0.5);
    margin: calc(var(--base) * 0.25) 0;
    border-radius: 10px;
    background-color: white;
    border: 1px solid #eeeeee;
  }

  .dark input {
    border-color: transparent;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.125);
  }
  input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(104, 214, 212, 0.6);
  }
  .dark input:focus {
    box-shadow: 0 0 2px 2px white;
  }
  .dark input::placeholder {
    color: rgb(255, 255, 255, 0.5);
  }
  @media (max-width: 720px) {
    .LabelText {
      font-size: 0.85rem;
    }
  }
  .fullWidth {
    width: 100%;
  }
</style>

<label class:dark>
  <div class="LabelText">
    <slot />
  </div>
  <input
    {type}
    {name}
    id="input-{name}"
    {placeholder}
    autocomplete="off"
    {list}
    on:change={change}
    class:fullWidth />
</label>
