<script>
  import { publication } from "../../../stores";
  import { fetch } from "../../../stores/fetch.js";
  import Card from "../../library/Card.svelte";

  let stacks = [];
  $: if ($publication && $publication.tags) {
    stacks = $publication.tags.filter(tag => {
      if (tag.type === "stack") return tag;
    });
  }

  let sources = [],
    fetched;
  $: if (stacks && stacks.length > 0 && !fetched) {
    for (let i = 0; i < stacks.length; i++) {
      fetch(`/api/library?stack=${stacks[i].name}`)
        .then(resp => {
          resp.items.map((item) => {
            if (
              item.shortId !== $publication.shortId &&
              !sources.find(arr => arr.shortId === item.shortId)
            )
              sources = [...sources, item];
            // sources.push(item);
            //console.log(item);
          });

          fetched = true;
        })
        .catch(err => {
          console.error(err);
        });
      //console.log(source);
    }
  }
</script>

<style>
  h5 {
    padding: 0;
    margin: 0 0 20px 0;
    font-size: 1rem;
    position: relative;
    font-weight: bold;
  }
  h5::after {
    width: calc(100% - 145px);
    height: 1px;
    background: #ddd;
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .Sources {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: 20px;
  }
  .Sources :global(.Item > input) {
    display: none;
  }
</style>

<h5>Related sources</h5>
<div class="Sources">
  {#if sources}
    {#each sources as item}
      <Card {item} selecting={false} />
    {/each}
  {/if}
</div>
