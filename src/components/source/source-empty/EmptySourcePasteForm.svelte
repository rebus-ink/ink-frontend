<script>
  import Button from "../../widgets/Button.svelte";
  import EmptySourcePaster from "./EmptySourcePaster.svelte";
  import { getToken } from "../../../getToken";
  import { goto } from "@sapper/app";
  import DOMPurify from "dompurify";
  export let source;
  export let pasting = false;
  const commentConfig = {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "i",
      "em",
      "strong",
      "a",
      "b",
      "ul",
      "li",
      "ol",
      "blockquote",
      "img",
      "pre",
      "code",
    ],
    FORBID_ATTR: ["style"],
  };
  let textType = "htmlType";
  if (process.browser) {
    textType = "richText";
  }
  let richtext = "";
  let plaintext = "";
  let processing = false;
  async function submit(event) {
    event.preventDefault();
    if (processing) return;
    processing = true;
    const url = `/api/upload-small-file?filePath=${source.name}`;
    let file;
    let fileType;
    // So because most pasted rich text and HTML is a bit rubbish semantically,
    // we need to clean it up before submitting
    function clean(html) {
      return DOMPurify.sanitize(html, commentConfig);
    }
    if (textType === "richText") {
      file = clean(richtext);
      fileType = "text/html";
    } else if (textType === "htmlType") {
      file = clean(plaintext);
      fileType = "text/html";
    } else {
      file = plaintext;
      fileType = "text/markdown";
    }
    const body = file;
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": fileType,
        "csrf-token": getToken(),
      },
      body,
    });
    const payload = await response.json();
    const uploadPublication = payload.publication;
    const type = payload.type;
    const storageId = payload.storageId;
    const original = payload.original;
    const updatedSource = {
      storageId,
      uploadType: type,
      uploadURL: original,
      uploadPublication,
    };
    try {
      await fetch(`/api/publication/${source.shortId}/attach-file`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "csrf-token": getToken(),
        },
        body: JSON.stringify(updatedSource),
      });
    } catch (err) {
      console.error(err);
    }
    pasting = false;
    processing = false;
    return goto(`/sources/${source.shortId}/${storageId}`);
  }
</script>

<style>
  h3 {
    margin: 0;
    font-weight: bold;
  }

  .Text {
    margin: 2rem;
  }
  .pasting .Text {
    margin-bottom: 0;
  }

  .Pane {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 5%;
    height: 100%;
    transition: opacity 100ms cubic-bezier(0.39, 0.575, 0.565, 1);
    background-color: #ecf1f4;
  }
  .Pane.pasting {
    display: grid;
    grid-template-rows: min-content 1fr 5rem;
    padding-top: 0;
    justify-content: stretch;
    align-items: stretch;
    padding: 1rem;
    grid-gap: 1rem;
    padding-bottom: 10rem;
  }
  .ButtonRow {
    padding-top: 2rem;
  }
  .text-area {
    width: 80%;
  }
  .Pane :global(.Editor) {
    background-color: white;
  }
  .Pane :global(.Editor.ql-container.ql-snow) {
    border: none;
    display: grid;
  }
  .Pane :global(.ql-editor) {
    border: 1px solid #ccc;
  }
</style>

<div class="Pane" class:pasting>
  <!-- {#if pasting} -->
    <div class="Text">
      <h3>Paste text to your source</h3>

      <input
        type="radio"
        id="htmlType"
        name="textType"
        value="htmlType"
        bind:group={textType} />
      <label for="htmlType">HTML</label>
      <input
        type="radio"
        id="markdownType"
        name="textType"
        value="markdownType"
        bind:group={textType} />
      <label for="markdownType">Markdown</label>
      <input
        type="radio"
        id="richText"
        name="textType"
        value="richText"
        bind:group={textType} />
      <label for="richText">Rich Text</label>
    </div>
    <div class="text-area">
    {#if textType === 'richText'}
      <div>
        <EmptySourcePaster bind:richtext />
      </div>
    {:else}
      <textarea
        name="html"
        id="html"
        cols="40"
        rows="10"
        bind:value={plaintext} />
    {/if}
  </div>
    <div class="ButtonRow">
      <Button click={submit}>Save</Button>
    </div>
  <!-- {:else}
    <div class="Icon">
      <svg
        width="58"
        height="71"
        viewBox="0 0 58 71"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.5816 4.31569C14.0796 2.8322 16.1026 2 18.2109 2H48C52.4183 2 56
          5.58172 56 10V61C56 65.4183 52.4183 69 48 69H10C5.58172 69 2 65.4183 2
          61V18.1313C2 15.9961 2.85358 13.9495 4.37074 12.447L12.5816 4.31569Z"
          stroke="currentColor"
          stroke-width="4" />
        <path
          d="M17 12V0L1 17H12C14.7614 17 17 14.7614 17 12Z"
          fill="currentColor" />
      </svg>
    </div>
    <div class="Text">
      <h3>Paste text to your source</h3>
      <p>Click to paste and edit your text.</p>
    </div>

    <Button click={() => (pasting = true)}>Paste &amp; Edit</Button>
  {/if} -->
</div>
