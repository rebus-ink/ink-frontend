<script>
    import {
      defaultNotebook
    } from "../../../stores/notebooks";
    import { notebooks$ } from "../../../../state/state";
    import ArrowDropDown from "../../img/ArrowDropDown.svelte"

    let items;
    $: items = $notebooks$ ? $notebooks$.items : [];
    $: if (!items.length || items[0].id !== 'none') items.unshift({id: 'none', name: '--no notebook--'})
    function change(input) {
      let value
      if (input && input.target) {
        value = input.target.value;
      }
      if (!value || value.label==="--no notebook--") {
        $defaultNotebook = null;
      } else {
        const newNotebook = items.find(notebook => notebook.name === value)
        $defaultNotebook = newNotebook
      }

    }

  </script>
  
  <style>
    div {
      position: relative;
    }
    .DefaultNotebook {
      z-index: 300;
      padding-left: 15px;
    }
    label,
  select,
  option {
    font-size: 0.85rem;
  }
  select {
    display: inline-block;
    color: rgb(0, 34, 48, 1);
    box-sizing: border-box;
    border: none;
    padding-right: 1.5rem;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: white;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2213%22%20height%3D%228%22%20viewBox%3D%220%200%2013%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6.5%208L0.00480908%200.5L12.9952%200.500001L6.5%208Z%22%20fill%3D%22%23002230%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(180deg, transparent 0, transparent);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 8px auto, 100%;
    position: relative;
    width: 100%;
    padding: calc(var(--base) * 0.5);
    margin: calc(var(--base) * 0.25) 0;
    border-radius: 10px;
    border: 1px solid #eeeeee;
    font-size: 0.85rem;
  }
  select::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 100px solid red;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: var(--rc-main);
    cursor: pointer;
  }
  .LabelText {
    font-weight: 500;
    font-size: 0.8rem;
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
  
  <!-- markup (zero or more items) goes here -->
  <div class="DefaultNotebook">
      <div>
        <label>
          <div class="LabelText">
            <slot />
          </div>
          <ArrowDropDown />
          <select name="pubType" on:blur={change} id="select-defaultNotebook" value={$defaultNotebook ? $defaultNotebook.name : '--no notebook--'}>
            {#each items as notebook}
              <option value={notebook.name}>{notebook.name}</option>
            {/each}
          </select>
        </label>
      </div>
  </div>
  
  