<script>
  import { page } from "../../../stores";
  export let colour;

  let colours = ["colour1", "colour2", "colour3", "colour4"];
</script>

<style>
  .colours {
    float: left;
    margin: 6px 40px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, 15px);
    grid-column-gap: 20px;
  }
  .colours input {
    width: 15px;
    height: 15px;
    -webkit-appearance: none;
    border-radius: 50%;
    position: relative;
    padding: 0;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
  .colours input:checked::after {
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  input.colour1 {
    background: #fea95b;
  }
  input.colour1::after {
    background: #d86801;
  }
  input.colour2 {
    background: #ff8ebe;
  }
  input.colour2::after {
    background: #c0004e;
  }
  input.colour3 {
    background: #6fe1fa;
  }
  input.colour3::after {
    background: #0693b2;
  }
  input.colour4 {
    background: #9fe793;
  }
  input.colour4::after {
    background: #589b4c;
  }
</style>

<ul class="colours">
  {#each colours as theColour}
    <li>
      <input
        name="noteColour"
        type="radio"
        class={theColour}
        bind:group={colour}
        value={theColour} />
    </li>
  {/each}
</ul>
