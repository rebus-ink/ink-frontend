<script>
  import HighlightColours from "./HighlightColours.svelte";
  import HighlightFlags from "./HighlightFlags.svelte";
  import HighlightButton from "./HighlightButton.svelte";
  import HighlightNoteField from "./HighlightNoteField.svelte";
  import HighlightNotebooks from "./HighlightNotebooks.svelte";
  import HighlightNoteButton from "./HighlightNoteButton.svelte";
  import { assignIco } from "../source-margin/assignIco.js";
  import IcoNotebook from "../../img/IcoNotebook.svelte";
  import IcoFlag from "../../img/IcoFlag.svelte";
  import CloseIcon from "./CloseIcon.svelte";
  import { onDestroy } from "svelte";
  import { defaultNotebook } from "../../../stores"
  import { notebooks$, source$, chapter$ } from "../../../../state/state";
  import { chapterURL$, notebooksURL$ } from "../../../../state/state-urls";
  import { refresh } from "../../../../state/refresh";
  import { createPopper } from "@popperjs/core";
  import { selectionHighlight$ } from "../../../../state/models/Selection";
  import { tags$ } from "../../../../state/tags";
  import { setColour } from "./setColour.js";
  import { getToken } from "../../../getToken";
  export let root = null;
  // $: if (root) {
  //   root.addEventListener("click", handleClick, false);
  // }
  // function getId(id) {
  //   const parts = id.split("/");
  //   return parts[parts.length - 1];
  // }
  // function handleClick(event) {
  //   if (
  //     event.target.matches("mark[data-annotation-id]") ||
  //     event.target.matches("tspan[data-annotation-id]")
  //   ) {
  //     document
  //       .getElementById(`id-${getId(event.target.dataset.annotationId)}`)
  //       .open();
  //   }
  // }

  // If selection has range, then we use that for positioning.
  // Else if we have a highlight, then we use that for positioning.
  // A function for making a highlight, this is called at any interaction with the toolbar
  // That way we can stop using the onmousedown hack.
  // Clear flags on hiding.

  let toolbar;
  let hidden;
  let range;
  const virtual = {
    getBoundingClientRect() {
      if (range) {
        return range.getBoundingClientRect();
      } else {
        return document.body.getBoundingClientRect();
      }
    },
  };
  let popperInstance;
  $: if (toolbar) {
    popperInstance = createPopper(virtual, toolbar, {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 15],
          },
        },
        {
          name: "flip",
          options: {
            padding: { top: 50 },
          },
        },
      ],
    });
  }
  $: if (range) {
    hidden = false;
    popperInstance.update();
  } else {
    hidden = true;
  }
  onDestroy(() => {
    if (popperInstance) {
      popperInstance.destroy();
    }
    root.removeEventListener("click", handleClick);
  });
  let colour;
  let selectedFlags;
  let selectedNotebooks = [$defaultNotebook];
  let flagMenu;
  let noteBookMenu;
  let highlight;
  let plaintext;
  $: if ($selectionHighlight$ && !$selectionHighlight$.selection.isCollapsed) {
    range = $selectionHighlight$.range;
  } else if (
    $selectionHighlight$ &&
    $selectionHighlight$.selection.isCollapsed &&
    range &&
    !highlight
  ) {
    // console.log($selectionHighlight$);
    highlight = $selectionHighlight$.tempHighlight(
      range,
      $source$.id,
      `/${$source$.shortId}/${$chapter$.resource.url.replace(".json", "")}`
    );
    // console.log(range);
  }
  $: if (
    ((selectedFlags && selectedFlags.length !== 0) ||
      (selectedNotebooks && selectedNotebooks.length !== 0) ||
      colour) &&
    !highlight
  ) {
    // console.log($selectionHighlight$);
    highlight = $selectionHighlight$.tempHighlight(
      range,
      $source$.id,
      `/${$source$.shortId}/${$chapter$.resource.url.replace(".json", "")}`
    );
    // console.log(range);
  }
  $: if (colour) {
    setColour(colour, toolbar);
  } else if (toolbar) {
    toolbar.style.setProperty("--toolbar-colour", "#dddddd");
    toolbar.style.setProperty("--toolbar-text", "#999");
  }
  function hasState() {
    if (
      plaintext ||
      colour ||
      selectedFlags.length !== 0 ||
      selectedNotebooks.length !== 0
    ) {
      return true;
    } else {
      return false;
    }
  }
  // function hasSelection() {
  //   return $selectionHighlight$ && $selectionHighlight$.selection.isCollapsed;
  // }
  let openNote = false;
  // $: console.log(plaintext);
  let createdNotebooks = [];
  function createNotebook(name) {
    if (!createdNotebooks.find((item) => item.name === name.toLowerCase())) {
      createdNotebooks = createdNotebooks.concat({ name: name.toLowerCase() });
    }
  }
  let createdFlags = [];
  function createFlag(name) {
    if (!createdFlags.find((item) => item.name === name.toLowerCase())) {
      createdFlags = createdFlags.concat({ name: name.toLowerCase() });
    }
  }
  async function createHighlight() {
    const json = {
      tags: createdFlags.concat(selectedFlags),
      notebooks: createdNotebooks.concat(selectedNotebooks),
    };
    let body;
    if (plaintext) {
      const content = await window
        .fetch("/api/markdown", {
          method: "POST",
          headers: {
            "Content-Type": "text/html",
            "csrf-token": getToken(),
          },
          body: plaintext,
        }) 
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return { content: "" };
          }
        })
        .then((json) => {

          return json.content;
        });
      json.body = [
        {
          format: "text/html",
          motivation: "commenting",
          type: "TextualBody",
          content: content,
        },
      ];
    }
    if (colour) {
      json.tags = json.tags.concat(colour);
    } else {
      const colour = $tags$.find((tag) => tag.type === "colour");
      json.tags = json.tags.concat(colour);
    }
    hidden = true;
    await $selectionHighlight$.highlight($source$, $chapter$, json);
    refresh($chapterURL$);
    // reset state
  }
</script>

<style>
  .HighlightToolbar {
    padding: 0;
    margin: 0;
    background-color: white;
    padding: 0.5rem 0.65rem;
    border-radius: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--toolbar-colour, #dddddd);
  }
  .HighlightToolbar ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 1rem;
  }
  .HighlightToolbar li {
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }
  :global(#sapper
      .Chapter
      .Highlight[data-annotation-id="temporary-selection-highlight"]) {
    background-color: rgba(120, 120, 120, 0.2);
  }
  .ButtonBar {
    display: flex;
    justify-content: right;
  }
  /* your styles go here */
  .Flags {
    display: flex;
    flex-direction: row;
    padding-top: 0.5rem;
    flex-wrap: wrap;
  }
  .Flag {
    margin-right: 0.25rem;
    margin-top: 0.5rem;
    background: var(--toolbar-background, #ddd);
    box-sizing: border-box;
    border-radius: 5px;
    padding: 0.25rem 0.25rem;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    display: grid;
    grid-template-columns: 24px 1fr 24px;
  }
  .Flag :global(svg) {
    color: var(--toolbar-text, #000);
    margin-right: 0.5rem;
    width: 16px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 100%;
    height: 16px;
    padding: 3px;
  }
</style>

<svelte:body
  on:click={(event) => {
    if (!event.target.closest('nav.HighlightToolbar') && (!$selectionHighlight$ || $selectionHighlight$.selection.isCollapsed) && range) {
      range = null;
      selectedFlags = [];
      selectedNotebooks = [$defaultNotebook];
      plaintext = '';
      openNote = false;
      colour = '';
      if ($selectionHighlight$) {
        $selectionHighlight$.clearTemporaryHighlight();
      }
    }
  }} />

<nav
  class="HighlightToolbar"
  class:colour
  bind:this={toolbar}
  class:visually-hidden={hidden}
  on:mousedown={(event) => {
    if (event.target.matches('details *:not(label):not(input)') || event.target === event.currentTarget) {
      event.preventDefault();
    }
  }}
  on:click={(event) => {
    if (event.target.matches('input')) {
    }
  }}>
  <ol>
    <HighlightColours bind:colour tags={$tags$} />
    <li>
      <HighlightFlags
        {colour}
        tags={$tags$}
        bind:selectedFlags
        bind:flagMenu
        create={createFlag} />
    </li>
    <li>
      <HighlightNotebooks
        {colour}
        notebooks={$notebooks$ ? $notebooks$.items : []}
        bind:selectedNotebooks
        bind:noteBookMenu
        create={createNotebook} />
    </li>
    <li>
      <HighlightNoteButton
        {colour}
        tags={$tags$}
        click={() => {
          openNote = true;
        }} />
    </li>
    <!-- <li>
      <button
        class="Button"
        on:click={async () => {
          console.log($selectionHighlight$.highlight($source$.id, `/${$source$.json.storageId}/${$chapter$.url}`));
        }}>
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.2105 12.708C24.1769 12.8086 24.1516 12.9092 24.1095
            12.9931C22.569 15.8946 21.02 18.796 19.4711 21.7059C19.3616 21.9155
            19.2101 22.0497 18.9575 22.0749C17.9642 22.1671 17.055 22.5025 16.23
            23.056C16.1122 23.1315 16.0112 23.2237 15.9017 23.3159C15.7081
            23.4837 15.4556 23.5088 15.2451 23.3746C14.3023 22.7709 13.3678
            22.1671 12.425 21.5549C12.1893 21.404 12.0967 21.1608 12.2061
            20.9176C12.6018 20.0707 12.5344 19.2153 12.3071 18.3432C12.2482
            18.1252 12.1977 17.9071 12.1135 17.7059C11.9957 17.4292 12.063
            17.2111 12.2314 16.9931C12.787 16.2887 13.3426 15.5759 13.8982
            14.8715C15.3461 13.0266 16.8025 11.1818 18.2504 9.33691C18.5619
            8.94278 18.7723 8.90085 19.1933 9.17758C20.7506 10.1839 22.3164
            11.1985 23.8738 12.2048C24.0674 12.3222 24.2021 12.4648 24.2105
            12.708ZM18.8902 10.2258C17.0298 12.5906 15.1946 14.9218 13.351
            17.2782C15.1693 18.4522 16.9624 19.6178 18.7808 20.7918C20.1866
            18.1503 21.5925 15.5172 22.9983 12.8841C21.6093 11.9868 20.2624
            11.1063 18.8902 10.2258Z"
            fill="currentColor" />
          <path
            d="M14.5212 23.8609C14.3108 24.2047 14.1256 24.5317 13.9067
            24.8336C13.8394 24.9259 13.671 24.993 13.5447 24.993C12.8376 25.0013
            12.1305 24.993 11.4233 24.9846C11.0698 24.9762 10.8846 24.6156
            11.0782 24.3053C11.3896 23.8022 11.7095 23.3074 12.0294
            22.8043C12.1052 22.6785 12.1894 22.5611 12.282 22.4102C13.0312
            22.8965 13.7552 23.3661 14.5212 23.8609Z"
            fill="currentColor" />
        </svg>
      </button>
    </li>
    <li>&nbsp;</li>
    <li>&nbsp;</li> -->
  </ol>
  {#if (selectedFlags && selectedFlags.length !== 0) || (selectedNotebooks && selectedNotebooks.length !== 0) || createdNotebooks.length !== 0 || createdFlags.length !== 0}
    <div class="Flags">
      {#if selectedFlags}
        {#each selectedFlags as flag}
          <div class="Flag Item">
            <svelte:component this={assignIco(flag.name)} />
            <span class={flag.name}>
              {flag.name[0].toUpperCase()}{flag.name.slice(1)}
            </span>
            <CloseIcon
              click={() => {
                const index = selectedFlags.indexOf(flag);
                if (index !== -1) {
                  selectedFlags = selectedFlags.filter((old) => {
                    return old !== flag;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
      {#if createdFlags.length !== 0}
        {#each createdFlags as flag}
          <div class="Flag Item">
            <IcoFlag />
            <span class={flag.name}>
              {flag.name[0].toUpperCase()}{flag.name.slice(1)}
            </span>
            <CloseIcon
              click={() => {
                const index = createdFlags.indexOf(flag);
                if (index !== -1) {
                  createdFlags = createdFlags.filter((old) => {
                    return old !== flag;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
      {#if createdNotebooks.length !== 0}
        {#each createdNotebooks as notebook}
          <div class="Flag Item">
            <IcoNotebook />
            <span class={notebook.name}>{notebook.name}</span>
            <CloseIcon
              click={() => {
                const index = createdNotebooks.indexOf(notebook);
                if (index !== -1) {
                  createdNotebooks = createdNotebooks.filter((old) => {
                    return old !== notebook;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
      {#if selectedNotebooks}
        {#each selectedNotebooks as notebook}
          <div class="Flag Item">
            <IcoNotebook />
            <span class={notebook.name}>{notebook.name}</span>
            <CloseIcon
              click={() => {
                const index = selectedNotebooks.indexOf(notebook);
                if (index !== -1) {
                  selectedNotebooks = selectedNotebooks.filter((old) => {
                    return old !== notebook;
                  });
                }
              }} />
          </div>
        {/each}
      {/if}
    </div>
  {/if}
  {#if openNote}
    <HighlightNoteField bind:plaintext />
    <div class="ButtonBar">
      <HighlightButton click={() => createHighlight()}>Create</HighlightButton>
    </div>
  {/if}
</nav>
