<script>
    import { page } from "../../../stores"
    import { goto } from "@sapper/app";
    export let chapter;

    $: nextDisabled = !(chapter && chapter.navigation && chapter.navigation.next)
    // note: previous can be the cover image, which means the link will fail
    $: previousDisabled = !(
    chapter && chapter.navigation && chapter.navigation.previous && 
    chapter.navigation.previous.url ) || chapter.navigation.index === 0

  function goPrevious() {
    if (!previousDisabled) {
      let url = $page.path
      let storage = $page.params.storage
      const lastIndex = url.indexOf(storage) + storage.length;
      url = url.substring(0, lastIndex);
      console.log(url)
      goto(url + "/" + chapter.navigation.previous.url)
    }

  }

  function goNext() {
    if (!nextDisabled) {
      let url = $page.path
      let storage = $page.params.storage
      const lastIndex = url.indexOf(storage) + storage.length;
      url = url.substring(0, lastIndex);
      goto(url + "/" + chapter.navigation.next.url)
    }

  }

  function backToTop() {
    document.body.scrollIntoView();
  }
  </script>
  
  <style>


.NavigationBar {
    margin-top: 10px;
    position: sticky;
    text-align: center;
    display: grid;
    gap: 150px;
    height: 50px;
    justify-content: center;
    padding-bottom: calc(var(--base) * 2);
    grid-template-columns: repeat(3, max-content);
    width: 100%;
    padding: 10px;
    background-color: var(--reader-toolbar-background);
    position: sticky;
      bottom: 0;
      z-index: 99;
  }
  .NavigationBar button {
    background: var(--action);
    border: none;
    padding: 0 10px;
    display: grid;
    text-align: center;
    color: #ffffff;

    cursor: pointer;
    border-radius: 5px;
    font-family: var(--sans-fonts);
    font-size: 0.9rem;
    font-weight: 500;
    height: 30px;
  }
  .NavigationBar .nav-button {
    width: 100px;
    padding: 5px;
    margin: 5px auto;
  }
  .disabled {
    opacity: 0.3;
    cursor: default;
  }
  .NavigationBar p {
    margin: 0;
    line-height: 15px;
  }


  #top {
    height: 30px;
    align-items:center;
    
  }

  </style>
  
  <nav class="NavigationBar" aria-label="Publication">
        <button
        on:click={goPrevious} 
        aria-label="Prev" 
        class={previousDisabled ? "nav-button disabled" : "nav-button"}>
        &lt; &#32; &#32; Previous
        </button>
 
        <p>    
          <button id="top" on:click={backToTop}>Back to Top</button>
        </p>

        <button
        on:click={goNext} 
        aria-label="Next" 
        class={nextDisabled ? "nav-button disabled": "nav-button"}>
        
        Next &#32; &#32; &gt;
        </button>

  </nav>
    