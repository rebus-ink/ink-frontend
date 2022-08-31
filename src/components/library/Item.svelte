<script>
  import { addSelectedSource, removeSelectedSource } from "../../stores";
  import ItemStacks from "./ItemStacks.svelte";
  export let item = {};
  export let selecting;
  let selected = false;
  $: if (!selecting && selected) {
    selected = false;
  }
  $: if (selected && item.id) {
    addSelectedSource(item);
  } else {
    removeSelectedSource(item);
  }
  let cover = {};
  $: if (item.resources) {
    cover = item.resources.find(
      (resource) => resource.rel.indexOf("cover") !== -1
    );
    if (!cover) {
      cover = {
        href: "/img/placeholder-cover.jpg",
        rel: ["cover"],
      };
    }
  } else {
    cover = {
      href: "/img/placeholder-cover.jpg",
      rel: ["cover"],
    };
  }

  let stacks;
  if (item.tags) {
    stacks = item.tags.filter((tag) => {
      if (tag.type === "stack") return tag;
    });
  }
  $: console.log(stacks)
</script>

<style>
  /* your styles go here */
  .title,
  .Authors {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: inherit;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
  }
  .title {
    font-size: 0.9rem;
    color: #333333;
    font-weight: 600;
    margin: 0;
  }
  .Stacks {
    position: relative;
    z-index: 2;
  }
  .Item {
    grid-template-columns: 55px 1fr;
    margin: 0;
    padding: 0 0 0 10px;
    min-height: calc(var(--base) * 4);
    display: grid;
    grid-gap: 30px;
    border-radius: 15px;
    align-items: center;
    position: relative;
    transition: background-color 250ms cubic-bezier(0.075, 0.82, 0.165, 1),
      box-shadow 250ms cubic-bezier(0.075, 0.82, 0.165, 1),
      transform 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .Overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;
    top: 0;
    left: 0;
  }
  .Image {
    display: block;
    border-radius: 10px;
    position: relative;
  }
  .Image::before {
    content: "";
    display: block;
    opacity: 0.6;
    background: #dde8ed;
    width: 75px;
    height: 75px;
    position: absolute;
    top: -5px;
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
  .Image img {
    height: auto;
    width: auto;
    object-fit: contain;
    border-radius: 10px;
    z-index: 1;
    position: relative;
  }
  .Name {
    font-size: var(--item-font-size);
    font-weight: 600;
    padding: calc(var(--base) * 0.5) 0;
    display: grid;
    grid-gap: 2px;
    grid-template-rows: repeat(3, max-content);
    grid-template-columns: 1fr;
    align-items: center;
    justify-content: left;
    z-index: 2;
    position: relative;
    padding: 0;
  }
  .Authors {
    color: #333333;
    font-weight: 400;
    font-size: 0.75rem;
  }
  .selected .Authors {
    color: white;
  }
  .selecting {
    box-shadow: 0 0 0 2px var(--light);
  }
  .selected {
    box-shadow: 15px 15px 15px rgba(0, 0, 0, 0.05);
    transform: translate(-5px, -5px);
    color: white;
    background-color: var(--workspace-color);
  }
  .Item.selected a {
    color: white;
  }
  @supports (-webkit-appearance: none) {
    input[type="checkbox"] {
      -webkit-appearance: none;
      width: 0.75rem;
      height: 0.75rem;
      border: 2px solid var(--workspace-color);
      border-radius: 4px;
    }
    .selected input[type="checkbox"] {
      border-color: white;
    }
    input[type="checkbox"]:checked {
      position: relative;
      /* Do a bug fix to keep iOS from adding dark background. */
      background: none;
    }
    input[type="checkbox"]:checked::after {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -0.2rem;
      margin-top: -0.2rem;
      content: "";
      width: 0.4rem;
      height: 0.4rem;
      background-color: var(--workspace-color);
      border-radius: 2px;
    }
    .selected input[type="checkbox"]:checked::after {
      background-color: white;
    }
  }
  .Item a {
    color: #333333;
    text-decoration: none;
  }
  .Item a:hover {
    color: var(--hover);
    text-decoration: underline;
  }
  .Stacks :global(ul:not(.ExtraStacks)) {
    line-height: 1;
  }
  @media (max-width: 1050px) {
    .Item {
      display: block;
      background-color: #fff;
      position: relative;
      border: 1px solid #eee;
      border-radius: 15px;
      padding: 28px 30px 20px;
      box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.03);
    }
    .Image {
      width: 68px;
      position: relative;
      margin: 0 auto 10px;
    }
    .Image::before {
      top: -10px;
      width: 95px;
      height: 95px;
    }
  }
</style>

<div class="Item" class:selecting class:selected>
  <a href={`/sources/${item.shortId}`} class="Overlay">_</a>
  <div class="Image">
    <img
      src={cover.href ? cover.href : `/img/placeholder-cover.jpg`}
      alt="Cover for {item.name}" />
  </div>
  <div class="Name">
    <a href={`/sources/${item.shortId}`} class="Overlay">_</a>
    <h5 class="title">{item.name}</h5>
    <div class="Authors">
      {#each item.author as author, i}
        <span class="Author">
          {author.name}{i !== item.author.length - 1 ? ',' : ''}
        </span>
      {/each}
    </div>
    <div class="Stacks">
      {#if stacks}
        <ItemStacks {item} {selected} />
      {/if}
    </div>
  </div>
</div>
