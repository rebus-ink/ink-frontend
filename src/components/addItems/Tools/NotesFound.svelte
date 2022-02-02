<script>
  import NavSource from "../../img/NavSource.svelte";

  export let item;
  export let addThis;
  export let itemType;

  let source, colour, highlight, comment, plainHighlight, plainComment;
  $: if (itemType === "note") {
    source = item.source;

    colour = item.tags.find((tag) => {
      if (tag.name.startsWith("colour")) return tag;
    });

    highlight = item.body.find((note) => note.motivation === "highlighting");
    comment = item.body.find((note) => note.motivation === "commenting");

    if (highlight)
      plainHighlight = new DOMParser()
        .parseFromString(highlight.content, "text/html")
        .querySelector("body").textContent;

    if (comment)
      plainComment = new DOMParser()
        .parseFromString(comment.content, "text/html")
        .querySelector("body").textContent;
  }
</script>

<style>
  li {
    color: #333;
    padding: 15px 30px;
    border-bottom: 1px solid #eee;
    display: grid;
    grid-gap: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  li:last-child {
    border-bottom: inherit !important;
  }
  li:hover {
    background: var(--main-background-color);
  }
  li.colour1 {
    background: #fff9f5;
    border-bottom: 1px solid #f5ece1;
  }
  li.colour1:hover {
    background: #fff4ec;
  }
  li.colour2 {
    background: #fdfafc;
    border-bottom: 1px solid #f9eaf0;
  }
  li.colour2:hover {
    background: #fcf5f9;
  }
  li.colour3 {
    background: #fafeff;
    border-bottom: 1px solid #a9e8ec;
  }
  li.colour3:hover {
    background: #eefcff;
  }
  li.colour4 {
    background: #fafffa;
    border-bottom: 1px solid #d3eacc;
  }
  li.colour4:hover {
    background: #eef8ee;
  }
  .Found p,
  .Found :global(p) {
    margin: 0;
    padding: 0;
    line-height: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
  /*------- Notes -------*/
  header {
    display: grid;
    grid-template-columns: 5px 1fr;
    grid-gap: 10px;
  }
  .column {
    float: left;
    background: #999999;
  }
  .colour1 .column {
    background: #fea95b;
  }
  .colour2 .column {
    background: #ff8ebe;
  }
  .colour3 .column {
    background: #57cfea;
  }
  .colour4 .column {
    background: #81d173;
  }
  .info,
  .Source {
    display: grid;
    grid-gap: 5px;
  }
  .Source {
    grid-template-columns: 11px 1fr;
    align-items: center;
  }
  .Source p,
  .SourceList h5,
  .SourceList p,
  .Authors {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .Source :global(svg) {
    width: 100%;
    height: auto;
    float: left;
  }
  .Highlight,
  .Note {
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .Highlight.noNote,
  .noHighlight {
    -webkit-line-clamp: 3;
  }
  /*------- Sources -------*/
  .SourceList {
    grid-template-columns: 40px 1fr;
    grid-gap: 20px;
    align-items: center;
  }
  img {
    width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #eeeeee;
  }
  .info {
    grid-gap: 0;
  }
  .SourceList h5 {
    font-size: 0.9rem;
    margin: 0;
    font-weight: 600;
  }
  .SourceList p {
    font-weight: 400;
    font-size: 0.8rem;
    margin: 0;
  }
</style>

{#if itemType === 'note'}
  <li
    class="Found {colour ? colour.name.replace(' ', '') : ''}"
    on:click={!addThis ? '' : addThis(item)}>
    {#if source}
      <header>
        <div class="column" />
        <div class="info">
          {#if highlight}
            <p class="Highlight {comment ? '' : 'noNote'}">{plainHighlight}</p>
          {/if}
          {#if source}
            <div class="Source">
              <NavSource />
              <p>{source.name}</p>
            </div>
          {/if}
        </div>
      </header>
    {/if}
    {#if comment}
      <p class="Note {highlight ? '' : 'noHighlight'}">{plainComment}</p>
    {/if}
  </li>
{:else}
  <li on:click={!addThis ? '' : addThis(item)} class="SourceList">
    <img src="/img/placeholder-cover.jpg" alt="Cover for {item.name}" />
    <div class="info">
      <h5>{item.name}</h5>
      <div class="Authors">
        <p>
          {#each item.author as author, index}
            {author.name}{index < item.author.length - 1 ? ', ' : ''}
          {/each}
        </p>
      </div>
    </div>
  </li>
{/if}
