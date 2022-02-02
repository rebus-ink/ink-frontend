<script>
    import { getToken } from "../../getToken";
    import { searchResults, notebooks, search,
      isEmpty, sourcesEmpty, notesEmpty,
      notebooksEmpty } from "../../stores"
    import ArrowDropDown from "../img/ArrowDropDown.svelte"
    import SearchResults from "./SearchResults.svelte"

    let notebookItems = [];
       $: if($notebooks.type !== "loading") {
           notebookItems = $notebooks.items
       }

      let includeNotes = true;
      let includeSources = true;
      let includeNotebooks = true;
  
      let includeHighlights = true;
      let includeComments = true;
  
      let name = true;
      let description = true;
      let abstract = true;
      let attributions = true;
      let keywords = true;
  
      let notebookName = true;
      let notebookDescription = true;
  
      let advancedOptions = false;
      let selectTypes = false;
      let selectedTypes = [];
      let selectedNotebook;
  
      let types = [
      "Article",
      "Blog",
      "Book",
      "Chapter",
      "Collection",
      "Comment",
      "Conversation",
      "Course",
      "Dataset",
      "Drawing",
      "Episode",
      "Manuscript",
      "Map",
      "MediaObject",
      "MusicRecordig",
      "Painting",
      "Photograph",
      "Play",
      "Poster",
      "PublicationIssue",
      "PublicationVolume",
      "Review",
      "ShortStory",
      "Thesis",
      "VisualArtwork",
      "WebContent"
    ];
  
      async function submit(e) {
          e.preventDefault();
  
          $isEmpty = false;
          $sourcesEmpty = false;
          $notesEmpty = false;
          $notebooksEmpty = false;

          let requestBody = {
              search: $search,
              includeNotes,
              includeSources,
              includeNotebooks
          }
  
          if (includeNotes) {
              requestBody.notes = {
                  highlights: includeHighlights,
                  comments: includeComments
              }
          }
  
          if (includeSources) {
              requestBody.sources = {
                  name,
                  description,
                  abstract,
                  attributions,
                  keywords
              }
  
              if (selectTypes && selectedTypes.length) {
                  requestBody.sources.types = selectedTypes
              }
          }

          if (includeNotebooks) {
              requestBody.notebooks = {
                  name: notebookName,
                  description: notebookDescription
              }
          }
  
        //   if (selectedNotebook && includeNotes) {
        //       requestBody.notes.notebook = selectedNotebook.shortId
        //   }
  
        //   if (selectedNotebook && includeSources) {
        //       requestBody.sources.notebook = selectedNotebook.shortId
        //   }
  
  
          const result = await window.fetch("/api/search", {
              method: "POST",
              credentials: "include",
              body: JSON.stringify(requestBody),
              headers: {
              "Content-Type": "application/json",
              "csrf-token": getToken(),
              },
          });
          $searchResults = await result.json()

          if ($searchResults && 
          (!$searchResults.sources || 
          $searchResults.sources.totalItems === 0)) {
            $sourcesEmpty = true;
          }
          if ($searchResults && 
          (!$searchResults.notes || 
          $searchResults.notes.totalItems === 0)) {
            $notesEmpty = true;
          }
          if ($searchResults && 
          (!$searchResults.notebooks || 
          $searchResults.notebooks.totalItems === 0)) {
            $notebooksEmpty = true;
          }
          if ($sourcesEmpty && $notesEmpty && $notebooksEmpty) {
            $isEmpty = true;
          }
      }
  
      function toggleAdvanced(e) {
          e.preventDefault();
          advancedOptions = !advancedOptions
  
      }
  
      function changeCheckbox(e) {
          let value = e.target.name;

          // notes

        if (value==="includeNotes") {
            includeNotes = !includeNotes
        }

          if (value==="includeNotes" && includeNotes) {
              includeHighlights = true;
              includeComments = true;
          }
          if (value==="includeNotes" && !includeNotes) {
              includeHighlights = false;
              includeComments = false;
          }
  
          if (value==="includeHighlights" && includeHighlights) {
              includeNotes = true;
          }
          if (value==="includeComments" && includeComments) {
              includeNotes = true;
          }
  
          // sources
          if (value==="includeSources") {
              includeSources = !includeSources;
          }
          if (value==="includeSources" && includeSources) {
              name = true;
              description = true;
              abstract = true;
              attributions = true;
              keywords = true;
              selectTypes = false;
          }
          if (value==="includeSources" && !includeSources) {
              name = false;
              description = false;
              abstract = false;
              attributions = false;
              keywords = false;
              selectTypes = false
          }
          if (
              (value==="name" && name) ||
              (value==="description" && description) ||
              (value==="abstract" && abstract) ||
              (value==="attributions" && attributions) ||
              (value==="keywords" && keywords)
          ) {
              includeSources = true;
          }
  
          if (value==="selectTypes" && selectTypes) {
              includeSources = true;
          }
          if(value==="selectTypes" && !selectTypes) {
              selectedTypes = [];
  
          }
  
          // notebooks
          if (value==="includeNotebooks") {
              includeNotebooks = !includeNotebooks
          }
          if (value==="includeNotebooks" && includeNotebooks) {
              notebookName = true;
              notebookDescription = true;
          }
          if (value==="includeNotebooks" && !includeNotebooks) {
              notebookName = false;
              notebookDescription = false;
          }
          if (
              (value==="notebookName" && notebookName) || 
              (value==="notebookDescription" && notebookDescription)
              ) {
              includeNotebooks = true;
          }
          
      }
  
      function closeSearch(e) {
          e.preventDefault()
          $search = "";
          includeNotes = true;
          includeSources = true;
          includeNotebooks = true;
  
          includeHighlights = true;
          includeComments = true;
  
          name = true;
          description = true;
          abstract = true;
          attributions = true;
          keywords = true;
  
          notebookName = true;
          notebookDescription = true;
  
          advancedOptions = false;
          $searchResults = null;
      }
  
      function selectType(e) {
          e.preventDefault()
          let type = e.target.value
          if(selectedTypes.indexOf(type) > -1) {
              selectedTypes = selectedTypes.filter(selected => selected !== type)
          } else {
              selectedTypes.push(type)
          }
      }
  
  
  
      function changeNotebook(input) {
        let value
        if (input && input.target) {
          value = input.target.value;
        }
        if (!value || value.label==="--no notebook--") {
          selectedNotebook = null;
        } else {
          const newNotebook = notebookItems.find(notebook => notebook.name === value)
          selectedNotebook = newNotebook
        }
  
      }
  
     
    </script>
    
    <style>

      .second-line {
          display: grid;
          padding: 0 20px 20px 0;
          grid-template-columns: 150px 150px 175px 175px;
      }
  
      .typesList {
          display: grid;
          grid-template-columns: 200px 200px 200px 200px;
      }
      .type {
          padding: 0 10px;
      }
  
      h3 {
          font-weight: 3;
      }
  
      form {
          margin: 20px;
          padding-bottom: 40px;
      }
      .SelectNotebook {
          padding: 20px 0;
      }
      .advancedOptions {
          display: grid;
          grid-template-columns: 200px 150px 150px 350px;
          background: white;
          padding: 20px 30px;
          border-radius: 20px;
      }
      .SearchBox {
    background-color: white;
    height: 60px;
    border-radius: 50px;
    width: 620px;
    position: relative;
    float: left;
    border-style: solid;
      border-color: rgba(0, 34, 48, 0.3);
  } 
  .SearchBox input {
    font-family: var(--sans-fonts);
    border: none;
    font-weight: 500;
    background: transparent;
    position: absolute;
    top: 50%;
    left: 50px;
    width: calc(100% - 50px);
    height: 60px;
    font-size: 180%;
    transform: translateY(-50%);
    color: var(--action);
    transition: all 0.25s ease-out;
    
  }
  .SearchBox input:focus {
    outline: none;
  }
  .SearchBox:focus-within {
    background: #e5ecf2;
  }
  .SearchBox input::placeholder {
    color: var(--action);
    opacity: 0.5;
    font-weight: 500;
  }
  .SearchBox svg {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    margin: 0;
    width: 30px;
    height: 30px;
  }
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }

  @media (max-width: 640px) {
    .SearchBox {
      left: 0.5rem;
      right: 0.5rem;
      position: absolute;
      width: calc(100% - 80px);
      left: 40px;
      top: 0;
    }
  }

  .Button {
    font-family: var(--sans-fonts);
    font-size: 0.9rem;
    flex: 0 1 auto;
    line-height: 1;

    display: inline-block;

    padding: 0.6rem 2.5rem 0.6rem;

    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    font-weight: 500;
    border-radius: 15px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    /* transition: box-shadow 0.15s ease-in-out; */
    text-decoration: none !important;
    transition: background-color 250ms cubic-bezier(0.075, 0.82, 0.165, 1);
    border: none;
  }
  .on {
      background: #68d6d499;
  }
  .off {
      background: #e5ecf2;
  }
  .submit-button {
      height: 60px;
      width: 200px;
      margin-left: 15px;
      font-size: 120%;
      border-radius: 50px;
      border-style: solid;
      border-color: rgba(0, 34, 48, 0.3);
  }

  h2 {
    font-weight: 600;
    padding: 40px 20px 0px 20px;
  }
  .first-line {
    display: grid;
    grid-template-columns: 650px 200px;
  }
  
    </style>
    <h2>Advanced Search</h2>
     <div>
         <form on:submit={submit}>
            <div class="first-line">

          <div class="SearchBox">

              <input 
                  type="search" 
                  placeholder="search"
                  class="search-field"   
                  bind:value={$search} />
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.9706 14C12.6971 14 12.4377 13.8936 12.2459 13.6987L8.40195
                    9.8592L8.23498 9.96556C7.38235 10.4973 6.39827 10.7774 5.38933
                    10.7774C2.41934 10.7774 0 8.35958 0 5.38871C0 2.41783 2.41934 0 5.38933
                    0C8.35932 0 10.7787 2.41783 10.7787 5.38871C10.7787 6.39554 10.498 7.38111
                    9.96511 8.2355L9.86208 8.40213L13.6989 12.238C14.1004 12.6422 14.1004
                    13.2945 13.6989 13.6987C13.5035 13.8936 13.2477 14 12.9706 14ZM5.38933
                    1.11319C3.03039 1.11319 1.11197 3.03115 1.11197 5.38871C1.11197 7.74626
                    3.03039 9.66422 5.38933 9.66422C7.74827 9.66422 9.66669 7.74626 9.66669
                    5.38871C9.66669 3.03115 7.74827 1.11319 5.38933 1.11319Z"
                    fill="currentColor" />
                </svg>

  
          </div>
          <input 
          type="submit"
          value="Search"
          class="Button submit-button" />
        </div>
          <br/><br/><br/>
              <div class="second-line">
 
                <div>
                    <input 
                    name="includeSources"
                      type="button"
                      class={includeSources ? "Button on" : "Button off"}
                      value="Sources"
                      on:click={changeCheckbox}
                  />
       
                  </div>

                  <div>
                      <input 
                        name="includeNotes"
                          type="button"
                          class={includeNotes ? "Button on" : "Button off"}
                          value="Notes"
                          on:click={changeCheckbox}
                      />
                  </div>

                  <div>
                    <input 
                        name="includeNotebooks"
                        type="button"
                        class={includeNotebooks ? "Button on" : "Button off"}
                        value="Notebooks"
                        on:click={changeCheckbox}
                    />
                  </div>
                  <div>
                    <input 
                        type="button"
                        class={advancedOptions ? "Button on" : "Button off"}
                        value="All Filters"
                        on:click={toggleAdvanced}
                    />
                  </div>
              </div>
  
              {#if advancedOptions}
  
              <div class="advancedOptions">
  
  
                  <!-- <div class="SelectNotebook">
                      <div>
                        <label>
                            Search in notebook: 
                          <ArrowDropDown />
                          <select name="pubType" on:blur={changeNotebook} id="select-defaultNotebook" value={selectedNotebook ? selectedNotebook.name : '--no notebook--'}>
                            {#each notebookItems as notebook}
                              <option value={notebook.name}>{notebook.name}</option>
                            {/each}
                          </select>
                        </label>
                      </div>
                  </div> -->

  
                    <div class="advanced-sources">
                      <h3>Sources</h3>
                      <input 
                          type="checkbox"
                          bind:checked={name}
                          value="name"
                          name="name"
                          on:change={changeCheckbox}
                      /> Title
                      <br/>
                      <input 
                          type="checkbox"
                          bind:checked={description}
                          value="description"
                          name="description"
                          on:change={changeCheckbox}
                      /> Description
                      <br/>
                      <input 
                          type="checkbox"
                          bind:checked={attributions}
                          value="attributions"
                          name="attributions"
                          on:change={changeCheckbox}
                      /> Authors, editors, etc.
                      <br/>
                      <input 
                          type="checkbox"
                          bind:checked={keywords}
                          value="keywords"
                          name="keywords"
                          on:change={changeCheckbox}
                      /> Keywords
                      <br/>
                      <input 
                          type="checkbox" 
                          bind:checked={selectTypes} 
                          value="selectTypes"
                          name="selectTypes"
                          on:change={changeCheckbox}
                      /> Select types

  </div>

  <div class="advanced-notes">
    <h3>Notes</h3>
        <input 
            type="checkbox"
            bind:checked={includeHighlights}
            value="includeHighlights"
            name="includeHighlights"
            on:change={changeCheckbox}
        /> Highlights
        <br/>
        <input 
            type="checkbox"
            bind:checked={includeComments}
            value="includeComments"
            name="includeComments"
            on:change={changeCheckbox}
        /> Comments
    </div>

  <div class="advanced-notebooks">
                      <h3>Notebooks:</h3>
                      <input 
                          type="checkbox"
                          bind:checked={notebookName}
                          value="notebookName"
                          name="notebookName"
                          on:change={changeCheckbox}
                      /> Name
                      <br/>
                      <input 
                          type="checkbox"
                          bind:checked={notebookDescription}
                          value="notebookDescription"
                          name="notebookDescription"
                          on:change={changeCheckbox}
                      /> Description
  </div>
                <div class="advanced-sourceTypes">
                    {#if selectTypes}
                    <h3>Source Types</h3>
                    <div class="typesList">
                        {#each types as type}
                            <span class="type"><input 
                                type="checkbox"
                                value={type}
                                on:change={selectType} />
                                {type}
                            </span>

                        {/each}
                        </div>
                    {/if}
                </div>
  
              </div>
              {/if}
  
  
          </form>

          <SearchResults />
     </div>
    
  