<script>
  import FlagFurtherRead from "../img/FlagFurtherRead.svelte";
  import FlagIdea from "../img/FlagIdea.svelte";
  import FlagImportant from "../img/FlagImportant.svelte";
  import FlagImpTerm from "../img/FlagImpTerm.svelte";
  import FlagQuestion from "../img/FlagQuestion.svelte";
  import FlagReference from "../img/FlagReference.svelte";
  import FlagRevisit from "../img/FlagRevisit.svelte";
  import FlagToDo from "../img/FlagToDo.svelte";
  import FlagUrgent from "../img/FlagUrgent.svelte";
  import NavSource from "../img/NavSource.svelte";
  import IcoNotebook from "../img/IcoNotebook.svelte"
  import {
    page,
    addSelected,
    removeSelected,
    selectedItems,
  } from "../../stores";
  export let selecting;
  export let selection = function() {};
  export let note = {};
  export let selectAll;
  let selectable = true;
  let selected = false;

  let noted, highlighed;
  $: if (note && note.body && note.body[0]) {
    noted = note.body.find((item) => item.motivation === "commenting");
    highlighed = note.body.find((item) => item.motivation === "highlighting");
  }

  $: flags = note.tags
    ? note.tags.filter((flag) => !flag.name.startsWith("colour"))
    : "";
  $: colour = note.tags
    ? note.tags.find((flag) => flag.name.startsWith("colour"))
    : "";

  $: notebooks = note.notebooks || [];

  function assignIco(icon) {
    switch (icon) {
      case "further reading":
        return FlagFurtherRead;
      case "idea":
        return FlagIdea;
      case "important":
        return FlagImportant;
      case "important term":
        return FlagImpTerm;
      case "question":
        return FlagQuestion;
      case "reference":
        return FlagReference;
      case "revisit":
        return FlagRevisit;
      case "to do":
        return FlagToDo;
      case "urgent":
        return FlagUrgent;
    }
  }
  /*
  $: pagination =
    $page.query && $page.query.page
      ? `/notes/all/all/${note.shortId}?${new URLSearchParams({
          page: $page.query.page,
        }).toString()}`
      : false;*/
  $: symbol = $page.path.startsWith("/notebooks/") ? "&" : "?";
  $: pagination =
    $page.query && $page.query.page
      ? `${symbol}${new URLSearchParams({
          page: $page.query.page,
        }).toString()}`
      : "";

  $: if (!selecting && selected) selected = false;
  $: if (selected && note.id) addSelected(note);
  else removeSelected(note);

  $: if (selectAll) {
    selected = true;
    selection();
  }

  
  $: if ($selectedItems.size) {
    $selectedItems.forEach((obj) => {
      selectable =
        !obj.noteContexts &&
        ($page.path === "/notes/all/all" ||
          $page.path === "/notes/all/all/" ||
          ($page.path.startsWith("/notebooks/") && !$page.params.noteId))
          ? true
          : false;
    });
  } else {
    selectable =
      $page.path === "/" ||
      ($page.path.startsWith("/notebooks/") && $page.params.noteId) ||
      ($page.path.startsWith("/notes/") && $page.params.id) || $page.path.startsWith("/sources/") || $page.path.startsWith("/search")
        ? false
        : true;
  }
</script>

<style>
  .Item * {
    margin: 0;
    font-weight: 500;
  }
  .Top {
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    padding: 16px;
    display: grid;
    grid-gap: 19px;
    /*grid-template-rows: auto 1fr auto;*/
    grid-template-rows: 1fr;
    height: 200px;
    position: relative;
  }
  .Top.two {
    grid-template-rows: auto 1fr;
  }
  /* -------------- Input -------------- */
  .BulkSelector {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    -webkit-appearance: none;
    /* You need to set border to none as well as inputs in Mobile Safari's default stylesheet have a border */
    border: none;
    outline: none;
    cursor: pointer;
  }
  .BulkSelector::before,
  .BulkSelector::after {
    content: "";
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    border-radius: 50%;
    position: absolute;
    transition: all 0.25s ease-out;
  }
  .BulkSelector::before {
    width: 14px;
    height: 14px;
    border: 1px solid #888888;
    background: #ffffff;
  }
  .BulkSelector::after {
    width: 8px;
    height: 8px;
    background: transparent;
  }
  .BulkSelector:checked::after {
    background: #888888;
  }
  .colour1 .BulkSelector::before {
    border: 1px solid #fea95b;
  }
  .colour2 .BulkSelector::before {
    border: 1px solid #ff8ebe;
  }
  .colour3 .BulkSelector::before {
    border: 1px solid #57cfea;
  }
  .colour4 .BulkSelector::before {
    border: 1px solid #81d173;
  }
  .colour1 .BulkSelector:checked::after {
    background: #fea95b;
  }
  .colour2 .BulkSelector:checked::after {
    background: #ff8ebe;
  }
  .colour3 .BulkSelector:checked::after {
    background: #57cfea;
  }
  .colour4 .BulkSelector:checked::after {
    background: #81d173;
  }
  /* -------------- Highlight -------------- */
  header {
    display: grid;
    grid-template-columns: 4px 1fr;
    grid-gap: 8px;
  }
  header .info {
    display: grid;
    grid-gap: 4px;
  }
  a {
    outline: none;
  }
  .Page {
    font-size: 0.6rem;
    float: left;
    width: max-content;
    padding: 0 8px;
    border-radius: 5px;
    align-items: center;
    display: flex;
    color: #ffffff;
  }
  .Highlight {
    font-size: 0.75rem;
    line-height: 0.9rem;
    color: #333333;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .noNote {
    -webkit-line-clamp: 8;
  }
  .Source {
    display: grid;
    align-items: center;
    grid-template-columns: 10px 1fr;
    grid-gap: 5px;
  }
  .Source :global(svg) {
    width: 10px;
    height: auto;
    color: var(--workspace-color);
  }
  .Source[href],
  .Highlight[href],
  .Note[href] {
    text-decoration: none;
  }
  .Source[href]:hover,
  .Highlight[href]:hover,
  .Note[href]:hover,
  .Page:hover {
    text-decoration: underline;
  }
  .Source p {
    font-size: 0.7rem;
    font-weight: 400;
    color: #333333;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  /* -------------- Note -------------- */
  .Note {
    overflow: hidden; /*
    text-overflow: ellipsis;
    white-space: nowrap;*/
  }
  .Note :global(*),
  .Highlight :global(*) {
    font-size: 0.75rem !important;
    line-height: 0.9rem;
    margin: 0;
    color: #333333;
  }
  .empty {
    color: #888888;
    font-weight: 400;
  }
  /* -------------- Tags -------------- */
  .Tags {
    list-style: none;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .Tags li {
    border-radius: 10px;
    display: inline-table;
    margin-right: 5px;
    padding: 2px 10px;
  }
  .Tags p {
    font-size: 0.7em;
  }
  /* -------------- Botom -------------- */
  .Bottom {
    border-radius: 0 0 20px 20px;
    padding: 6px 16px;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 7px;
  }
  .Flags,
  .Bottom section {
    padding: 0;
    list-style: none;
  }
  .Flags {
    line-height: 0.8rem;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .Flags li {
    display: inline-table;
    margin-right: 7px;
  }
  .Bottom section {
    display: flex;
    justify-content: flex-end;
  }
  .Bottom p {
    font-size: 0.7rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .Flags :global(svg) {
    float: left;
    margin-right: 3px;
    height: 16px;
  }
  /* ------------ No colour ------------ */
  .Item .Top {
    border: 1px solid #cccccc;
    border-bottom: none;
  }
  .Item header .column {
    background: #999999;
  }
  .Item .Tags li {
    background: #f6f6f6;
  }
  .Item .Bottom {
    border: 1px solid #cccccc;
    border-top: 1px solid #dddddd;
    background: #f6f6f6;
  }
  .Item .Tags p,
  .Item .Bottom * {
    color: #999999;
  }
  /* ------------ Colour 1 ------------ */
  .colour1 .Top {
    border: 1px solid #ffe4cb;
    border-bottom: none;
  }
  .colour1 header .column {
    background: #fea95b;
  }
  .colour1 .Tags li {
    background: #ffebda;
  }
  .colour1 .Bottom {
    border: 1px solid #ffe4cb;
    border-top: 1px solid #fcf3ed;
    background: #fffcfa;
  }
  .colour1 .Tags p,
  .colour1 .Bottom * {
    color: #d86801;
  }
  /* ------------ Colour 2 ------------ */
  .colour2 .Top {
    border: 1px solid #fcd5e5;
    border-bottom: none;
  }
  .colour2 header .column {
    background: #ff8ebe;
  }
  .colour2 .Tags li {
    background: #ffe4f0;
  }
  .colour2 .Bottom {
    border: 1px solid #fcd5e5;
    border-top: 1px solid #f9eaf0;
    background: #fffafd;
  }
  .colour2 .Tags p,
  .colour2 .Bottom * {
    color: #c0004e;
  }
  /* ------------ Colour 3 ------------ */
  .colour3 .Top {
    border: 1px solid #7de8f8;
    border-bottom: none;
  }
  .colour3 header .column {
    background: #57cfea;
  }
  .colour3 .Tags li {
    background: #def8fe;
  }
  .colour3 .Bottom {
    border: 1px solid #7de8f8;
    border-top: 1px solid #dff2f5;
    background: #fafeff;
  }
  .colour3 .Tags p,
  .colour3 .Bottom * {
    color: #0693b2;
  }
  /* ------------ Colour 4 ------------ */
  .colour4 .Top {
    border: 1px solid #d3eacc;
    border-bottom: none;
  }
  .colour4 header .column {
    background: #81d173;
  }
  .colour4 .Tags li {
    background: #e6f8e4;
  }
  .colour4 .Bottom {
    border: 1px solid #d3eacc;
    border-top: 1px solid #eaf5e6;
    background: #f8fcf8;
  }
  .colour4 .Tags p,
  .colour4 .Bottom * {
    color: #589b4c;
  }
  .pageNumber {
    text-align: right;
    font-size: 0.7rem;
  }
</style>

<div
  class="Item {colour ? colour.name.replace(' ', '') : ''}"
  class:Selected={note.selected}>
  <div class="Top {note.document || highlighed || note.source ? 'two' : ''}">
    {#if selectable}
      <input
        class="BulkSelector"
        type="checkbox"
        bind:checked={selected}
        on:click={() => selection()} />
    {/if}
    {#if note.document || highlighed || note.source}
      <header>
        <div class="column" />
        <div class="info">
          {#if highlighed}
            {#if note && note.target && note.target.source}
            <a
              class="Highlight {noted && noted.content ? '' : 'noNote'}"
              href={`/target${note.target.source}`}>
              <p>{note.target.selector.exact}</p>
            </a>
            {:else} 
            <p class="Highlight">{highlighed.content}</p>
            {/if}
          {/if}
          {#if note.source && note.source.name}
            <a href={`/sources/${note.source.shortId}`} class="Source">
              <NavSource />
              <p>{note.source.name}</p>
            </a>
          {/if}
        </div>
      </header>
    {/if}
    <!--pagination ? pagination : `/notes/all/all/${note.shortId}`}></a>-->
    <a
      class="Note"
      href={$page.path.startsWith('/notebooks/') ? `/notebooks/${$page.params.id}/note/${note.shortId}?notebook=${$page.params.id}${pagination}` : `/notes/all/all/${note.shortId}${pagination}`}>
      {#if noted && noted.content}
        {#if !noted.content.startsWith('<p>') || !noted.content.startsWith('<span>')}
          <p>
            {@html noted.content}
          </p>
        {:else}
          {@html noted.content}
        {/if}
      {:else}
        <p class="empty">Add note...</p>
      {/if}
    </a>
    {#if note.json && note.json.pages}
    <div class="pageNumber">p.{note.json.pages}</div>
    {/if}
  </div>
  <div class="Bottom">
    <ul class="Flags">
      {#each flags as flag}
        <li>
          <svelte:component this={assignIco(flag.name)} />
          <p>{flag.name}</p>
        </li>
      {/each}
    </ul>
    <section>
      <p>
        <strong>Modified:</strong>
        {new Date(note.updated).toLocaleString(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      </p>
    </section>
    <ul class="Flags">
      {#each notebooks as notebook}
        <li>
          <IcoNotebook/>
          <p>{notebook.name}</p>
        </li>
      {/each}
    </ul>
  </div>
</div>
