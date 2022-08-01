<script>
    import {
      notebooks,
      addedNotebooks,
      //addingNotebooks
    } from "../../../stores";
    import AutocompleteInput from "../../widgets/AutocompleteInput.svelte";
    export let dark = false;
    let items;
    $: items = $notebooks ? $notebooks.items : [];
    $addedNotebooks = [];
    function change(input, value) {
        const newNotebook = items.find(notebook => notebook.name === value.value)
        $addedNotebooks = Array.from(new Set($addedNotebooks.concat(newNotebook)));
        input.value = "";
    }
    function removeNotebook(event) {
      event.preventDefault()
      const removedNotebook = event.target.value;
      $addedNotebooks = []; $addedNotebooks.filter(
        (notebook) => notebook.name !== removedNotebook
      );
    }


  </script>
  
  <style>
    div {
      position: relative;
    }
    .Collection {
      width: auto;
      float: left;
      font-size: 0.7rem;
      padding: calc(var(--base) * 0.25);
      margin-right: calc(var(--base) * 0.25);
      margin-bottom: calc(var(--base) * 0.25);
      border-radius: 5px;
      color: black;
      background-color: white;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
    }
    .Tags {
      grid-column: 1;
      grid-gap: calc(var(--base) * 0.25);
      grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
    }
    .dark .Collection {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
    }
    .removeButton {
    font-family: var(--sans-fonts);
    font-size: 0.9rem;
    flex: 0 1 auto;
    line-height: 1;

    display: inline-block;

    padding: 0.5rem;
    margin: auto calc(var(--base) * 0.5);
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
    border-radius: 15px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    /* transition: box-shadow 0.15s ease-in-out; */
    background-color: transparent;
    text-decoration: none !important;
    transition: background-color 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    border: none;
  }
  </style>
  
  <!-- markup (zero or more items) goes here -->

  <div>
    {#if $notebooks.type === 'loading'}
        <div class="Loading" />
    {:else}
    {#if $addedNotebooks.length < 1}
      <div>
        <AutocompleteInput
          placeholder="Notebook Name"
          {dark}
          name="new-notebooks"
          list={items.map(item => item.name)}
          {change}>
          Assign notebooks  
        </AutocompleteInput>
      </div>
      {:else}
      <div class="Wide Tags" class:dark>
        <div class="LabelText svelte-rmvtnc">Assign notebooks</div>
        {#each $addedNotebooks as notebook}
          <span class="Collection">
            {notebook.name}
            <button
              value={notebook.name}
              on:click={removeNotebook}
              class="removeButton">x</button>
          </span>
        {/each}
      </div>
        {/if}
    {/if}
  </div>
  
  