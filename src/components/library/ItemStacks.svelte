<script>
  import IcoStack from "../img/IcoStack.svelte";
  export let item = {
    tags: [],
  };
  export let selected = false;
  const spaces = ["Research", "Public_Scholarships", "Teaching", "Personal"];

  function getName(name) {
    const space = name.split("/")[0].replace(" ", "_");
    if (spaces.includes(space)) {
      return name.replace(space + "/", "");
    } else {
      return name;
    }
  }
  $: stackLength = item.tags.filter((tag) => {
    if (tag.type === "stack") return tag;
  });
</script>

<style>
  .hash {
    font-size: var(--item-font-size);
    color: black;
  }
  ul {
    display: grid;
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
    font-size: var(--item-font-size);
    padding: 0;
  }
  a:link {
    display: block;
    padding: 0;
    text-decoration: none;
    font-weight: 600;
    border-radius: 0px 50px 50px 0px;
  }
  .linkText {
    color: #333;
    font-size: 0.7rem;
  }

  li a:hover {
    color: #333;
  }
  li a:hover .linkText {
    color: var(--link);
  }
  .More {
    background: var(--main-background-color);
    border-radius: 50%;
    color: #333333;
    font-size: 0.6rem;
    cursor: pointer;
    position: absolute;
    border: 1px solid #dde8ed;
    right: 0;
    bottom: 0;
    font-weight: 600;
    text-align: center;
    align-items: center;
    width: 20px;
    height: 20px;
    transform: translateY(2px);
  }
  .More,
  .More:hover ~ .ExtraStacks,
  .ExtraStacks:hover {
    display: grid;
  }
  .ExtraStacks {
    display: none;
    background: rgba(0, 34, 48, 0.9);
    font-size: 0.7rem;
    padding: 5px 10px;
    font-weight: 500;
    bottom: 0;
    margin: 0;
    right: 0;
    position: absolute;
    border-radius: 5px;
    transform: translateY(calc(100% + 10px));
    width: 100%;
  }
  .ExtraStacks::before {
    content: "";
    top: -8px;
    right: 4px;
    width: 0;
    height: 0;
    border-radius: 3px;
    position: absolute;
    transform: translateY(3px) rotate(45deg);
    border-color: rgba(0, 34, 48, 0.9) transparent transparent
      rgba(0, 34, 48, 0.9);
    border-style: solid;
    border-width: 6px;
  }
  .ExtraStacks::after {
    content: "";
    width: 100%;
    height: 13px;
    position: absolute;
    top: 0;
    transform: translateY(-100%);
  }
  .ExtraStacks * {
    color: #ffffff;
    font-weight: 400;
  }
</style>

<ul>
  {#each item.tags as tag, i}
    {#if i < 3}
      <li class:selected>
        <a href="/library/all/{encodeURIComponent(tag.name)}">
          <span class="hash">
            <IcoStack />
          </span>
          <span class="linkText">{getName(tag.name)}</span>
        </a>
      </li>
    {/if}
  {/each}
</ul>

{#if item.tags.length > 3}
  <span class="More">+{stackLength.length - 3}</span>
  <ul class="ExtraStacks">
    {#each item.tags as tag, i}
      {#if i > 2}
        <li class:selected>
          <a href="/library/all/{encodeURIComponent(tag.name)}">
            <span class="hash">
              <IcoStack />
            </span>
            <span class="linkText">{getName(tag.name)}</span>
          </a>
        </li>
      {/if}
    {/each}
  </ul>
{/if}
