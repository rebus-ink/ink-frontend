<script lang="ts">
    export let source;
    export let pages = true;
    import NotesCard from "../../notes/NotesCard.svelte"
    import EmptySourceNewNote from "./EmptySourceNewNote.svelte"
    import ArrowDropDown from "../../img/ArrowDropDown.svelte"

    import { sourceNotes, notebooks, defaultNotebook } from "../../../stores"
   let items;
    $: items = $notebooks ? $notebooks.items : [];
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
  let notes = [];
  $: if ($sourceNotes.items) notes = $sourceNotes.items
  </script>
  
  <style>
    .EmptySourceNotes {
      position: relative;
      display: grid;
      padding: calc(var(--base) * 2);
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      grid-gap: var(--base);
      z-index: 0;
      grid-auto-rows: max-content;
    }
    .AddNoteForm {
      padding: 20px calc(var(--base) * 2) 0 calc(var(--base) * 2);
    }

    .DefaultNotebook {
      padding: 10px 45px;
    }
  </style>
  
  <div>
    <div class="DefaultNotebook">
      <div>
        <label>
          <div class="LabelText">
            <slot />
            default notebook: 
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
  <div class="AddNoteForm">
  <EmptySourceNewNote ntbkClose={true} {source} {pages} />
</div>
<div class="EmptySourceNotes">

  {#each notes as note }
     <NotesCard {note} selecting={false} selectAll={false} />
  {/each}
</div>
</div>
  