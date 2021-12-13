<script>
  import { send, receive } from "./_crossfade.js";
  import { innote, insource, inntbk, searchResults } from "../stores";
  import NotesCard from "../components/notes/NotesCard.svelte";
  import NotebookCard from "../components/notebooks/NotebookCard.svelte";
  import NewNote from "../components/notes/NewNote.svelte";
  import NewNotebook from "../components/notebooks/NewNotebook.svelte";
  import NewItem from "../components/workspace/NewItem.svelte";
  import NoNotes from "../components/img/NoNotes.svelte";
  import NoNotebooks from "../components/img/NoNotebooks.svelte";
  import NoSources from "../components/img/NoSources.svelte";
  import Item from "../components/workspace/Item.svelte";
  import Loader from "../components/Loader.svelte";
  import Search from "../components/search/Search.svelte"
  import { stores } from "@sapper/app";
  const { session } = stores();

  let items = [],
    itemsNotes = [],
    itemsNtbk = [];
  $: if ($innote) itemsNotes = $innote.items;
  $: if ($insource) items = $insource.items;
  $: if ($inntbk) itemsNtbk = $inntbk.items;

  let date = new Date(),
    weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  let day = weekday[date.getDay()];
  
</script>

<style>
  :root {
    --color: var(--workspace-color);
  }
  h1 {
    color: var(--color);
    float: left;
    margin-bottom: 0;
  }
  .index {
    display: grid;
    grid-template-columns: 1fr calc(var(--base) * 14);
    height: 100vh;
    padding: 20px;
    grid-gap: 30px;
  }
  .Toolbar {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-template-rows: max-content;
    align-items: center;
  }
  .Toolbar .Buttons {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 15px;
    max-height: 38px;
    height: 100%;
  }
  .Toolbar h1 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .Cards:not(.align) {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: var(--base);
    grid-auto-rows: max-content;
  }
  h5 {
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--workspace-color);
  }
  .Sources h5 {
    margin-bottom: 0;
  }
  .Sources {
    background: #ffffff;
    border-radius: 30px;
    display: grid;
    gap: 30px;
    padding: 30px 20px;
    margin-top: 30px;
  }
  .align {
    background: #f9fbfc;
    border-radius: 30px;
    min-height: 165px;
    position: relative;
  }
  .align :global(svg) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .index .left {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .indexNotes :global(.Top) {
    height: 146px;
    grid-gap: 7px;
  }
  .indexNotes :global(.Highlight) {
    -webkit-line-clamp: 3;
  }
  .indexNotes :global(.Highlight.noNote) {
    -webkit-line-clamp: 5;
  }
  .notebooks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    grid-gap: 20px;
  }
  .index .notebooks :global(.Item) {
    grid-template-rows: 100px auto;
  }
  .notebooks :global(.Info) {
    padding: 10px 15px;
  }
  .contNotebooks.align h5 {
    transform: translateY(-22px);
  }
  @media (max-width: 1289px) {
    .Cards:not(.align) {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }
  @media (min-width: 1051px) {
    .notebooks {
      max-height: 170px;
      overflow: hidden;
    }
    .notebooks > :global(a .Item) {
      grid-template-rows: 110px auto;
    }
    .Cards.indexNotes.align {
      min-height: 360px;
    }
    .Cards:not(.align) {
      max-height: 375px;
      overflow: hidden;
    }
    .Sources :global(.Item:nth-child(n + 7)) {
      display: none;
    }
  }
  @media (max-width: 1050px) {
    .index .Toolbar :global(.new-button) {
      position: inherit;
    }
    .index {
      grid-template-columns: 1fr;
      grid-gap: 70px;
      height: inherit;
    }
    .left {
      display: grid !important;
      grid-template-columns: 1fr;
      grid-gap: 20px;
    }
    .Cards:not(.align) {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .Cards :global(.Item:nth-child(n + 7)) {
      display: none;
    }
    .contNotebooks {
      margin-top: 30px;
    }
    .Sources:not(.align) {
      display: grid;
      grid-gap: var(--base);
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      position: relative;
      background: transparent;
      padding: 0;
    }
    .Sources h5 {
      margin-bottom: 0;
      position: absolute;
      top: -25px;
    }
    .notebooks :global(a:nth-child(n + 3)) {
      display: none;
    }
  }
  @media (max-width: 720px) {
    .Cards :global(.Item:nth-child(n + 5)),
    .Sources :global(.Item:nth-child(n + 6)) {
      display: none;
    }
    .Toolbar .Buttons {
      max-height: inherit;
    }
    .Toolbar .Buttons :global(span.new-button button.Button) {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .Toolbar .Buttons :global(button.Button svg) {
      transform: scale(0.8);
    }
  }
  .Sources :global(.Loading) {
    margin: auto;
  }
  @media (min-width: 721px) {
    .Toolbar .Buttons :global(button.Button) {
      padding: 0 20px !important;
      height: 40px;
      border-radius: 15px !important;
    }
  }
</style>

<div class="index">
  <div class="left">
    <nav class="Toolbar">
      <h1 out:send={{ key: 'h1' }} in:receive={{ key: 'h1' }}>
        Happy {day}
      </h1>
      <div class="Buttons">
        <NewItem ntbkOpen={false} />
        <NewNote ntbkOpen={false} />
        <NewNotebook />
      </div>
    </nav>


    <div class="contNotes">
      <h5>Recent notes</h5>
      <div
        class="Cards indexNotes {!itemsNotes.length && $innote.type !== 'loading' ? 'align' : null}">
        {#if $innote.type === 'loading'}
          <Loader />
        {:else if itemsNotes}
          {#each itemsNotes as note, i}
            {#if i < 8}
              <NotesCard
                {note}
                selecting={false}
                selection={false}
                selectAll={false} />
            {/if}
          {:else}
            <NoNotes />
          {/each}
        {/if}
      </div>
    </div>
    <div
      class="contNotebooks {!itemsNtbk.length && $inntbk.type !== 'loading' ? 'align' : null}">
      <h5>Recent notebooks</h5>
      <div class="notebooks">
        {#if $inntbk.type === 'loading'}
          <Loader />
        {:else if itemsNtbk}
          {#each itemsNtbk as notebook, i}
            {#if i < 3}
              <NotebookCard
                {notebook}
                selecting={false}
                selection={false}
                selectAll={false} />
            {/if}
          {:else}
            <NoNotebooks />
          {/each}
        {/if}
      </div>
    </div>
  </div>
  <div class="right-column">
    <Search />

  <div
    class="Sources {!items.length && $insource.type !== 'loading' ? 'align' : null}"
    style={`grid-template-rows: repeat(${items.length > 5 ? 5 : items.length + 1}, max-content);`}>    
    <h5>Recent sources</h5>
    {#if $insource.type === 'loading'}
      <Loader />
    {:else if items}
      {#each items as item, i}
        {#if i < 6}
          <Item {item} selecting={false} />
        {/if}
      {:else}
        <NoSources />
      {/each}
    {/if}
  </div>
  </div>
</div>
