<script>
  import IcoNewNotebook from "../img/IcoNewNotebook.svelte";
  import IcoEdit from "../img/IcoEdit.svelte";

  import Button from "../widgets/Button.svelte";
  import Closer from "../widgets/Closer.svelte";
  import WhiteButton from "../widgets/WhiteButton.svelte";
  import { tick } from "svelte";
  import { getToken } from "../../getToken";
  import { refreshNotebooks, refreshInNtbk } from "../../stores";

  let modal = false;
  let open = false;
  let newToggle;

  function click() {
    open = !open;
    coverImg = coverImgs[~~(Math.random() * coverImgs.length)];
    title = "";
    description = "";
  }

  async function close() {
    open = false;
    await tick();
    newToggle.querySelector("button").focus();
  }
  let title, description;
  $: characters = description ? 150 - description.length : 150;

  let inputBody = {
    name: "",
    description: "",
    status: "active",
    settings: {
      colour: "",
      coverImg: "",
    },
  };

  let coverImgs = [
    "andrew-buchanan-s6GmUf009os",
    "ashkan-forouzani-B8j1vlRod0s",
    "ashkan-forouzani-JaWG0bWG8qM",
    "dustin-humes-SaWLpkDK_AI",
    "guillaume-lebelt-GNyy-D-SNN8",
    "henrik-donnestad-HO1Evlp1p1o",
    "jason-leung-UHR-NVbzBSA",
    "josep-martins-9lGNHu1FMvM",
    "mika-baumeister-MnUiMZ2fr7U",
    "mike-c-s-7HlJkjH3k60",
    "pawel-czerwinski-jJi1bjfBWYo",
    "photos-hobby-F7X3ADFWeNM",
    "steve-johnson-4ZD1g5oxwTo",
    "tools-for-motivation-KvTOwKoji7g",
    "wengang-zhai-ywfKB54yidY",
  ];
  let coverImg;
  let selection;

  async function submit(event) {
    event.preventDefault();
    close();

    if (title) {
      try {
        const payload = Object.assign({}, inputBody);
        payload.name = title;
        payload.description = description;
        payload.settings.coverImg = `${coverImg}`;

        await window.fetch(`/api/notebooks`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "csrf-token": getToken(),
          },
        });
        $refreshInNtbk = Date.now();
        $refreshNotebooks = Date.now();
      } catch (err) {
        console.error(err);
      }
    }
  }
</script>

<style>
  .new-button {
    justify-content: center;
    flex-direction: column;
    display: flex;
  }
  .new-button :global(.Button) {
    padding: 0.65rem 1.95rem 0.6rem;
  }
  .new-button :global(svg) {
    float: left;
  }
  .new-button :global(span) {
    float: left;
    margin-top: 2px;
    margin-left: 10px;
  }
  .NewBox {
    position: absolute;
    background-color: var(--workspace-color);
    color: #fff;
    left: 20px;
    width: calc(100% - 40px);
    top: 20px;
    z-index: 3;
    border-radius: 30px;
    padding: 30px 40px;
  }
  form {
    width: 100%;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr minmax(150px, 250px);
  }
  .left,
  .right {
    display: grid;
    grid-gap: 20px;
    position: relative;
  }
  .right {
    grid-template-rows: 15px 1fr;
  }
  .right .cover {
    cursor: pointer;
  }
  .right .cover :global(svg) {
    float: left;
    transform: translateY(-4px);
  }
  .right .cover h5 {
    float: left;
    margin: 0;
    transform: translateX(3px);
  }
  .right .img {
    border: 2px solid var(--main-background-color);
    border-radius: 10px;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .right .img:hover {
    opacity: 0.5;
  }
  .footer {
    grid-column: 1/3;
  }
  .Characters {
    position: absolute;
    bottom: -25px;
    left: 0px;
    font-style: italic;
    opacity: 0.7;
    color: #ffffff;
    margin: 0;
    font-size: 0.9rem;
  }
  /* ------ Editor ------ */
  input,
  textarea {
    outline: none;
    float: left;
    width: 100%;
    border: none;
    border-radius: 10px;
    color: var(--workspace-color);
  }
  input::placeholder,
  textarea::placeholder {
    color: rgba(0, 34, 48, 0.3);
  }
  input {
    height: 60px;
    font-size: 180%;
    padding: 0 20px;
  }
  textarea {
    height: 120px;
    resize: none;
    padding: 20px;
    font-size: var(--reader-font-size, 0.85rem);
  }
  /* ------ Footer btns ------ */
  :global(.Button) {
    float: right;
  }
  .newNote :global(button.Closer),
  .footer .Closer {
    width: 125px;
    height: 34px;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .newNote :global(.Closer::after) {
    content: "Cancel";
    color: var(--main-background-color);
  }
  :global(.Closer:hover::after),
  .footer .Closer:hover {
    text-decoration: underline;
  }
  :global(.Closer svg) {
    display: none;
  }
  /* ------ Modal ------ */
  .NotebookModal {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    top: 0;
    left: 0;
    z-index: 5;
  }
  .NotebookModal section {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .NotebookModal section {
    background: var(--main-background-color);
    border-radius: 10px;
    width: 50vw;
    height: 60vh;
    margin: 0;
    padding: 40px;
    overflow-y: scroll;
  }
  .NotebookModal ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 0;
    padding: 0;
    grid-gap: 20px;
  }
  .NotebookModal li {
    height: 70px;
    cursor: pointer;
    position: relative;
    border-radius: 10px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: all 0.25s ease;
  }
  .NotebookModal li:hover:not(.active) {
    opacity: 0.6;
  }
  .NotebookModal li.active::after {
    content: "";
    position: absolute;
    border: 2px solid var(--workspace-color);
    top: -7px;
    left: -7px;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    border-radius: 15px;
  }
  .NotebookModal p {
    margin: 0;
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
  .NotebookModal .footer {
    float: left;
    position: fixed;
    left: 50%;
    width: 50vw;
    transform: translateX(-50%);
    top: calc(80vh + 20px);
  }
  .NotebookModal .Closer {
    float: right;
    cursor: pointer;
    color: var(--main-background-color);
  }
  .NotebookModal .Accept {
    background: var(--main-background-color);
    color: var(--workspace-color);
    border-radius: 10px;
  }
  .NotebookModal .Accept:hover {
    text-decoration: inherit;
  }
  @media (max-width: 720px) {
    .new-button {
      position: fixed;
      right: var(--base);
      bottom: 50px;
    }
    .new-button :global(.Button) {
      box-shadow: 3px 1px 7px rgba(0, 0, 0, 0.2);
      padding: 0.65rem;
      border-radius: 100%;
      height: 60px;
      width: 60px;
      justify-content: center;
      align-items: center;
      display: flex;
    }
    .new-button :global(svg) {
      float: inherit;
      width: 25px;
      height: 25px;
    }
    .NewButtonLabel {
      display: none;
    }
    .NewBox {
      left: 0;
      top: 0;
      border-radius: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      position: fixed;
      align-items: center;
      display: flex;
    }
    :global(button.Closer),
    :global(button.Submit) {
      width: 50%;
      padding: 15px 0 !important;
      margin: 0 !important;
      font-size: 0.9rem;
      border-radius: 20px !important;
    }
    .left,
    .right {
      grid-column: 1/3;
    }
    .right {
      height: 150px;
    }
    .Characters {
      right: 0;
      left: inherit;
    }
    form {
      grid-gap: 40px;
      grid-template-columns: 1fr;
    }
    .footer :global(button.Submit) {
      max-width: 150px;
    }
    .NotebookModal section {
      width: 80vw;
      height: 70vh;
    }
    .NotebookModal .footer {
      top: calc(85vh + 20px);
      width: 80vw;
    }
    .NotebookModal ul {
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    }
    .NotebookModal li {
      height: 90px;
    }
  }
</style>

{#if open}
  {#if modal}
    <div class="NotebookModal">
      <section>
        <p>Select a cover for your notebook</p>
        <ul>
          {#each coverImgs as img}
            <li
              on:click={() => {
                selection = img;
              }}
              class={img === selection ? 'active' : ''}
              alt={img}
              style={`background-image: url("/img/NotebookImg/${img}.jpg")`} />
          {/each}
        </ul>
      </section>
      <div class="footer">
        <h5
          class="Closer Accept"
          on:click={() => {
            coverImg = selection;
            modal = false;
            document.querySelector('nav').classList.remove('ntbkModal');
          }}>
          Select
        </h5>
        <h5
          class="Closer"
          on:click={() => {
            modal = false;
            document.querySelector('nav').classList.remove('ntbkModal');
          }}>
          Cancel
        </h5>
      </div>
    </div>
  {/if}
  <div
    class="NewBox newNote">
    <form
      id="newform"
      class="newForm"
      action="/api/create-publication"
      on:submit={submit}>
      <div class="left">
        <input
          type="text"
          placeholder="Enter notebook title"
          required=true
          bind:value={title} />
        <textarea
          placeholder="Add a description (optional)"
          bind:value={description}
          maxlength="150" />
        <p class="Characters">{characters} characters left</p>
      </div>
      <div class="right">
        <div
          class="cover"
          on:click={() => {
            modal = true;
            selection = coverImg;
            document.querySelector('nav').classList.add('ntbkModal');
          }}>
          <IcoEdit />
          <h5>Cover image</h5>
        </div>
        <div
          class="img"
          on:click={() => {
            modal = true;
            selection = coverImg;
            document.querySelector('nav').classList.add('ntbkModal');
          }}
          style={`background-image: url("/img/NotebookImg/${coverImg}.jpg")`} />
      </div>
      <div class="footer">
        <WhiteButton>Create</WhiteButton>
        <Closer click={close} dark={true} />
      </div>
    </form>
  </div>
  <span />
{:else}
  <span
    class="new-button"
    bind:this={newToggle}>
    <Button {click}>
      <IcoNewNotebook />
      <span class="NewButtonLabel">Notebook</span>
    </Button>
  </span>
{/if}
