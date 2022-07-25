
<script>
  // NOTE: collections are user-generated tags. They exist in some forms
  // such as the library footer, but do not show up elsewhere.
  // the goal was to make user-generated tags more useful, eventually.

  import {
    collections,
    addedCollections
  } from "../../stores";
  import Closer from "../widgets/Closer.svelte";
  import AutocompleteInput from "../widgets/AutocompleteInput.svelte";
  export let dark = false;
  let filteredCollections = $collections.map((collection) => collection.name);

  $: if ($addedCollections) {
    filteredCollections = filteredCollections.filter((collection) => {
      return !$addedCollections
        .map((coll) => coll.value)
        .includes(collection.value);
    });
  }
  function ids(arr) {
    return arr.map((item) => item.value);
  }
  function change(input, value) {
    if (value && ids(filteredCollections).includes(value.value)) {
      $addedCollections = Array.from(new Set($addedCollections.concat(value)));
      input.value = "";
    }
  }
  function removeTag(event) {
    const removedCollection = event.data.value;
    $addedCollections = $addedCollections.filter(
      (collection) => collection.value !== removedCollection
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
</style>

<!-- markup (zero or more items) goes here -->
{#if $addedCollections.length < 1}
  <div>
    <AutocompleteInput
      placeholder="Stack Name"
      {dark}
      name="new-collections"
      list={filteredCollections}
      {change}>
      Assign stacks
    </AutocompleteInput>
  </div>
{:else}
  <div class="Wide Tags" class:dark>
    <div class="LabelText svelte-rmvtnc">Assign stacks</div>
    {#each $addedCollections as collection}
      <span class="Collection">
        {collection.label}
        <Closer
          {dark}
          value={collection.value}
          click={removeTag}
          small={true} />
      </span>
    {/each}


  </div>

  
{/if}

