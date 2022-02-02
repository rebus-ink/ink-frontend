<script>
  import IcoEdit from "../../img/IcoEdit.svelte";

  export let itemEdit;
  export let currentCover;
  export let newValue;
  export let submit;
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

  if (!newValue) newValue = currentCover;
</script>

<style>
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
    border: none;
    padding: 8px 35px;
    border-radius: 10px;
    background: none;
    border: 2px solid var(--main-background-color);
    color: var(--main-background-color);
  }
  .NotebookModal .Select {
    background: var(--main-background-color);
    color: var(--workspace-color);
    border: none;
    padding: 10px 35px;
    margin-left: 20px;
  }
  .NotebookModal .Select:hover {
    text-decoration: inherit;
  }
  @media (max-width: 720px) {
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

<div class="NotebookModal">
  <section>
    <p>Select a cover for your notebook :</p>
    <ul>
      {#each coverImgs as img}
        <li
          on:click={() => {
            newValue = img;
          }}
          class={img === newValue ? 'active' : ''}
          alt={img}
          style={`background-image: url("/img/NotebookImg/${img}.jpg")`} />
      {/each}
    </ul>
  </section>
  <div class="footer">
    <button
      class="Closer Select"
      on:click={(e) => {
        submit(e);
        itemEdit = false;
        document.querySelector('nav').classList.remove('ntbkModal');
      }}>
      Select
    </button>
    <button
      class="Closer"
      on:click={() => {
        itemEdit = false;
        document.querySelector('nav').classList.remove('ntbkModal');
      }}>
      Cancel
    </button>
  </div>
</div>
