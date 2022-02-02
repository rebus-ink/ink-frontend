<script>
  import Card from "../../widgets/Card.svelte";
  import Loader from "../../widgets/Loader.svelte";
  import { source$ } from "../../../../state/state";
  import { refresh } from "../../../../state/refresh";
  import IcoEdit from "../../img/IcoEdit.svelte";
  import { getToken } from "../../../getToken";
  let editing = false;
  //let text = $source$.description || "";
  async function save() {
    const pub = Object.assign({}, $source$, { description: text });
    await window.fetch(`/api/publication/${$source$.shortId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "csrf-token": getToken(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pub)
    });
    editing = false;
    refresh(`/api/sources/${$source$.shortId}`)
  }
  let textarea;
  $: if (editing && textarea) {
    textarea.focus();
  }

  let text;
  $: if (!editing) {
    text = $source$.description;
    //if ($source$.description !== undefined) updating = true;
  }

  $: textLength = text ? 500 - text.length : 500;
</script>

<style>
  .Description {
    font-size: var(--item-font-size);
  }
  textarea {
    width: 100%;
    border-radius: 15px;
    border: 1px solid #ddd;
    background-color: #ffffff;
    padding: 1rem;
    resize: none;
    font-size: 0.9rem;
  }
  h5 {
    padding: 0;
    margin: 0 0 20px 0;
    font-size: 1rem;
    position: relative;
    font-weight: bold;
  }
  h5::after {
    width: calc(100% - 100px);
    height: 1px;
    background: #ddd;
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .placeholder,
  .counter {
    color: #888888;
    float: left;
  }
  .counter {
    font-style: italic;
  }
  .Description p {
    position: relative;
    font-size: 0.9rem;
    line-height: 1.1rem;
    width: calc(100% - 40px);
    margin: 0 auto;
  }
  .Description p:not(.counter) {
    cursor: pointer;
  }
  .Description p:hover:not(.counter)::before {
    content: "";
    border: 1px solid #ddd;
    display: block;
    position: absolute;
    width: calc(100% + 30px);
    height: calc(100% + 20px);
    top: 50%;
    left: 50%;
    border-radius: 10px;
    transform: translate(-50%, -50%);
  }
  .ico {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-100%, -2px);
  }
  .Description:hover .ico,
  .Description.active .ico {
    display: block;
  }
</style>

<Card id="Description" tab="About" bind:editing {save}>
  <h5>Description</h5>
  {#if $source$.type === 'loader'}
    <Loader />
  {:else}
    <div class="Description {editing ? 'active' : ''}">
      {#if editing}
        <textarea
          name="DescriptionEdit"
          id="PublicationDescriptionEdit"
          cols="30"
          rows="10"
          maxlength="500"
          bind:value={text}
          bind:this={textarea} />
        <p class="counter">{textLength} characters left</p>
      {:else if $source$.description}
        <p on:click={() => (editing = true)}>{$source$.description}</p>
      {:else}
        <p class="placeholder" on:click={() => (editing = true)}>Empty...</p>
      {/if}
      <div class="ico">
        <IcoEdit />
      </div>
    </div>
  {/if}
</Card>
