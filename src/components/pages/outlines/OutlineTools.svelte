<script>
  import OutlineIcoHeader from "../../img/OutlineIcoHeader.svelte";
  import OutlineIcoThought from "../../img/OutlineIcoThought.svelte";
  import Export from "../../img/OutlineIcoExport.svelte";
  import NewOutlineNote from "./NewOutlineNote.svelte";
  import { page } from "../../../stores";

  export let addNewNote;
  export let disabled;

  // NOTE FROM MARIE: don't know why the api-server is wrong on production, but hard coding seems to fix it for now.
  let server
  if ($page && $page.host === 'app.rebus.ink' ) {
    server = "https://ink-api-dev-dot-thematic-cider-139815.appspot.com/" 
  } else {
    server = 'https://ink-server-dev-dot-thematic-cider-139815.appspot.com' 
  }

  let downloadDocx = async () => {
    const url = `${server}/outlines/${$page.params.outlineId}/docx`;
    window.location.replace(url);
  }
</script>

<style>
  .Tools,
  li.Tool :global(ul) {
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    list-style: none;
    margin: 0;
    gap: 1px;
    cursor: default;
    -webkit-box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.1);
  }
  li.Tool :global(ul) {
    position: absolute;
    padding: 7px 0;
    right: 0;
    top: 0;
    min-width: 190px;
    transform: translateX(calc(100% + 5px));
    display: none;
  }
  li.Tool :global(li:hover ul) {
    display: grid;
  }
  .Tools li,
  .Tools :global(li) {
    margin: 0 2px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }
  .Tools :global(li.Children:hover::before),
  .Tools :global(li.Children ul:hover:before) {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
  }
  .Tools :global(li.Children ul:hover:before) {
    left: 5px;
  }
  li.Tool ul li,

  li.Tool :global(.Current),
  li.Tool :global(li:hover) {
    background: var(--main-background-color);
  }
  li.Tool :global(li svg.Check) {
    color: var(--action);
    opacity: 0;
    transition: all 0.2s ease-out;
  }
  ul.Tools {
    position: fixed;
    left: 30px;
    top: 50%;
    transform: translateY(-50%);
    padding: 6px 0 0;
    display: grid;
  }
  ul.Tools > li {
    text-align: center;
    padding: 5px;
    border-radius: 10px;
  }
  ul.Tools > li > p {
    font-size: 0.6rem !important;
  }
  ul.Tools > li:hover,
  li.NewNote.Active {
    background: #eeeeee;
  }
  ul.Tools p,
  ul.Tools :global(p) {
    font-size: 0.7rem;
    margin: 0;
    font-weight: 400;
  }
  ul.Tools :global(p.Preview),
  ul.Tools :global(p.Header) {
    color: #888888;
  }
  ul.Tools :global(p.Header) {
    text-align: left;
    padding-left: 30px;
    font-size: 0.55rem;
    text-transform: uppercase;
    font-weight: 600;
  }
  ul.Tools span.Division,
  ul.Tools :global(span.Division) {
    background: #eeeeee;
    height: 1px;
    cursor: default;
    position: relative;
  }
  ul.Tools span.Division.Short {
    width: 50%;
    margin: 10px auto;
  }
  ul.Tools :global(span.Division.Full) {
    width: 100%;
    margin: 4px auto;
  }
  span.Division.Last {
    margin-bottom: 0 !important;
  }
  .Tools .Tool.Export {
    background: #f6f6f6;
    border-radius: 0 0 10px 10px;
    padding: 15px 5px 11px;
    margin: 0;
  }
  .Tools :global(.Checkbox) {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    position: relative;
    border: 2px solid var(--action);
  }
  .Tools :global(.Checkbox::after) {
    content: "";
    width: 5px;
    height: 5px;
    background: var(--action);
    border-radius: 1px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .Tools :global(.Checkbox.Unchecked::after) {
    content: inherit;
  }
  .Tool :global(li.Flags > svg.arrow),
  .Tool :global(li.Colours > svg.arrow) {
    transform: rotate(-90deg);
    position: inherit;
    top: inherit;
    right: inherit;
    height: 9px;
    width: auto;
  }
  .NewItem {
    position: absolute;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
    border: none;
  }
</style>

<ul class="Tools">
  <li class="Tool NewNote {addNewNote === 'header' ? 'Active' : ''}">
    <button
      class="NewItem"
      on:click={() => {
        addNewNote = !addNewNote || addNewNote !== 'header' ? 'header' : false;
      }} />
    <OutlineIcoHeader />
    <p>Header</p>
    {#if addNewNote === 'header'}
      <NewOutlineNote type={'header'} bind:addNewNote bind:disabled />
    {/if}
  </li>
  <li class="Tool NewNote {addNewNote === 'note' ? 'Active' : ''}">
    <button
      class="NewItem"
      on:click={() => {
        addNewNote = !addNewNote || addNewNote !== 'note' ? 'note' : false;
      }} />
    <OutlineIcoThought />
    <p>Thought</p>
    {#if addNewNote === 'note'}
      <NewOutlineNote type={'note'} bind:addNewNote bind:disabled />
    {/if}
  </li>
  <span class="Division Short" />
  <!--<ListStyleList {addParams} bind:filters />
  <li class="Tool List Filter Children">
    {#if filters.colour.length || filters.flags.length || filters.type.length}
      <span class="Notification" />
    {/if}
    <Filter />
    <p>Filter</p>
    <ul class="Filters">
      <FilterOptions {checkAll} {addArrParams} {filters} />
      <span class="Division Long" />
      <p class="Header">Display notes</p>
      <ColourList {addArrParams} bind:filters />
      <span class="Division Long">
        <p class="Header And">and</p>
      </span>
      <FlagsListFilter {addArrParams} bind:filters />
    </ul>
  </li> -->
  <span class="Division Short Last" />
  <li class="Tool Export">
    <button
    class="NewItem"
    on:click={downloadDocx} />
    <Export />
    <p>Export</p>
  </li>
</ul>
