<script>
  import {searchResults, sourceSearched,
    isEmpty, sourcesEmpty, notesEmpty, 
    notebooksEmpty} from "../../stores"
  import NotesCard from "../notes/NotesCard.svelte"
  import Card from "../library/Card.svelte"
  import NotebookCard from "../notebooks/NotebookCard.svelte"

</script>
  
  <style>
  .Cards {
    position: relative;
    display: grid;
    padding: calc(var(--base) * 2);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: var(--base);
    z-index: 0;
    align-items: center;
    grid-auto-rows: max-content;
  }
  h2 {
      padding-left: 20px;
  }
  .noResults {
      padding-left: 20px;
      padding-bottom: 40px;
  }
  </style>
  
<div>
    {#if $isEmpty}
    <div class="noResults" >No results found.</div>
    {:else}
    
    {#if $searchResults && $searchResults.sources}
    <h2 id="sources">Sources</h2>
        {#if $sourcesEmpty}
        <div class="noResults" >No results found.</div>
        {:else}
            <div class="Cards">
                {#each $searchResults.sources.items as source}
                    <Card item={source} selecting={false} selectAll={false} />
                {/each}
            </div>
        {/if}
    {/if}

    {#if $searchResults && $searchResults.notes}
    <h2 id="notes">Notes</h2>
        {#if $notesEmpty}
        <div class="noResults" >No results found.</div>
        {:else}
        <div class="Cards">
            {#each $searchResults.notes.items as note}
                <NotesCard {note} selecting={false} selectAll={false} />
            {/each}
        </div>
        {/if}
    {/if}


    {#if $searchResults && $searchResults.notebooks}
    <h2 id="notebooks">Notebooks</h2>
        {#if $notebooksEmpty}
        <div class="noResults" >No results found.</div>
        {:else}
        <div class="Cards">
            {#each $searchResults.notebooks.items as notebook}
                <NotebookCard {notebook} selecting={false} selectAll={false} />
            {/each}
        </div>
        {/if}
    {/if}
    {/if}
</div>
  