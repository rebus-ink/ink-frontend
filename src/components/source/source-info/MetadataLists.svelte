<script>
  import MetaLists from "./MetaLists.json";
  import ArrowDropDown from "../../img/ArrowDropDown.svelte";

  export let prop;
  export let itemValue;
  export let test;

  const bookFormats = [
    "AudiobookFormat",
    "EBook",
    "GraphicNovel",
    "Hardcover",
    "Paperback",
  ];

  let listArray =
    prop.prop === "Type"
      ? MetaLists.types
      : prop.prop === "Format"
      ? bookFormats
      : MetaLists.lang;

  let updateList = (item, prop, type) => {
    itemValue = type !== "Language(s)" ? item : [...itemValue, item];
    test(type === "Language(s)" ? itemValue : item, prop);
  };

  let remove = (prop, type, lang) => {
    if (type !== "Language(s)") {
      itemValue = "";
      test("", prop);
    } else {
      itemValue.splice(itemValue.indexOf(lang), 1);
      itemValue = prop.value = itemValue;
      test(itemValue, prop);
    }
  };

  let created = (input) => {
    input.focus();
  };
</script>

<style>
  p {
    font-size: 0.9rem;
    line-height: 1.1rem;
    position: relative;
    cursor: pointer;
    word-break: break-word;
  }
  input {
    outline: none;
    border: none;
    color: var(--action);
    cursor: auto;
    z-index: 1;
    position: relative;
    width: 100%;
  }
  .inputList {
    display: none;
    list-style: none;
    background: #ffffff;
    background-color: #fff;
    position: absolute;
    border: 1px solid #eee;
    border-radius: 15px;
    padding: 5px;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.03);
    transform: translateY(100%);
    max-height: 200px;
    overflow-y: scroll;
    max-height: 230px;
    bottom: -7px;
    margin: 0;
    z-index: 2;
    left: -6px;
    width: calc(100% + 13px);
  }
  .inputList li {
    font-size: 0.9rem;
    cursor: pointer;
    color: var(--all-workspace);
    font-weight: 500;
    border-radius: 8px;
    padding: 10px 20px;
  }
  .inputList li:hover {
    background: var(--main-background-color);
  }
  .inputList::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }
  .inputList::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  .inputList li em {
    color: var(--action);
    font-weight: 400;
  }
  .lists {
    position: absolute;
    top: 0;
    height: 100%;
    z-index: 1;
    left: 0;
    cursor: pointer;
    background: transparent;
  }
  .lists ~ :global(svg) {
    top: 50%;
    transform: translateY(-50%);
  }
  p.langValue {
    margin: 1px 4px 1px 0;
  }
  .typeValue {
    font-weight: 500;
    border: 1px solid #dde8ed;
    border-radius: 6px;
    padding: 2px 3px 2px 10px;
    line-height: 18px;
    background: var(--main-background-color);
    z-index: 2;
    float: left;
    font-size: 0.8rem;
    color: var(--workspace-color);
    margin: 0;
  }
  .typeValue span {
    width: 18px;
    height: 18px;
    float: right;
    margin-left: 1px;
    position: relative;
  }
  .typeValue span::before,
  .typeValue span::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    background: var(--workspace-color);
    border-radius: 10px;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .typeValue span::before {
    width: 50%;
    height: 2px;
  }
  .typeValue span::after {
    width: 2px;
    height: 50%;
  }
</style>

{#if prop.prop !== 'Language(s)'}
  <ul class="inputList">
    {#each listArray as li}
      {#if li !== itemValue}
        <li on:click={updateList(li, prop, prop.prop)}>{li}</li>
      {/if}
    {/each}
  </ul>
  {#if itemValue}
    <p class="typeValue">
      {itemValue}
      <span on:click={() => remove(prop, prop.prop, false)} />
    </p>
  {/if}
{:else}
  <ul class="inputList">
    {#each listArray as lang}
      {#if !itemValue.find((item) => {
        return item === lang.code;
      })}
        <li on:click={updateList(lang.code, prop, prop.prop)}>
          {lang.code} -
          <em>{lang.name}</em>
        </li>
      {/if}
    {/each}
  </ul>
  {#if itemValue.length}
    {#each itemValue as lang}
      <p class="typeValue langValue">
        {lang}
        <span on:click={() => remove(prop, prop.prop, lang)} />
      </p>
    {/each}
  {/if}
{/if}
<input class="lists" type="text" name={prop.key} readonly use:created={this} />
<ArrowDropDown />
