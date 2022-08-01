<script>
  import { page as pageStore, error } from "../stores";
  import { title } from "../stores/title.js";
  import Nav from "../components/widgets/Nav.svelte";
  import SignIn from "../components/Auth/SignIn.svelte";
  import NoteEditDialog from "../components/notes/noteEdit/NoteEditDialog.svelte";
  import { stores } from "@sapper/app";
  const { page, session } = stores();
  export let segment;
  let params;
  let publication = false;
  let betaNotice = true;
  $: if ($page) {
    pageStore.set($page);
    params = Object.assign({}, $page.params);
    if (segment) {
      params.segment = segment;
    } else {
      params.segment = "front";
    }
  }
  // Currently we get around issues surrounding creating derived stores from the $page store by manually assigning the value from that store to a new one in a component. We are going to migrate away from that method as it seems quite flaky. Instead we are going to trigger a page load event and use that to create our stores.
  //
  // One benefit here is that we could then reuse some of these stores in projects that aren't client-side routed.
  if (process.browser) {
    page.subscribe(({ path, params, query }) => {
      const loadEvent = new CustomEvent("synthetic-page-load", {
        detail: {
          path,
          params,
          query,
        },
        bubbles: true,
        cancelable: true,
      });
      document.documentElement.dataset.page = JSON.stringify({
        path,
        params,
        query,
      });
      document.dispatchEvent(loadEvent);
      // After the event has been dispatched you call refresh with the current path?
    });
  }

  let menu = true;
  $: if (segment === "library" && $page.query && $page.query.returnTo) {
    menu = true;
  } else {
    menu = false;
  }
  $: if (
    ($page.params && $page.params.publicationId) ||
    $page.path.startsWith("/sources")
  ) {
    publication = true;
  } else {
    publication = false;
  }
  // We need to create this CSS variable because mobile browsers
  // have a dynamic height
  let windowHeight;
  $: if (windowHeight) {
    document
      .querySelector(":root")
      .style.setProperty("--viewheight", windowHeight + "px");
  }
</script>

<style global>
  @import "../../styles/**/*.css";
  @import "quill/dist/quill.snow.css";
  main,
  .content {
    position: relative;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  /* .content {
  } */
  .grid {
    display: grid;
    grid-template-columns: calc(var(--base) * 4) 1fr;
    min-height: 100vh;
  }
  .grid.publication,
  .grid.pageWorkspace {
    grid-template-columns: 1fr;
  }
  @media (max-width: 720px) {
    .grid {
      display: flex;
      flex-direction: column;
    }
  }
  :root {
    --workspace-color: var(--all-workspace);
  }
  /* .content.publication {
    min-width: 100vw;
  } */
  .content.Personal {
    --workspace-color: var(--personal-workspace);
  }
  .content.Public_Scholarships {
    --workspace-color: var(--public-workspace);
  }
  .content.Teaching {
    --workspace-color: var(--teaching-workspace);
  }
  .content.Research {
    --workspace-color: var(--research-workspace);
  }
  .content.unfinished {
    grid-column: 2 / -1;
    padding: 0;
  }

  .BetaNotice {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
    z-index: 1200;
    background-color: #e0f5f5;
    padding: 1rem 2rem;
    grid-column-gap: 1rem;
    backdrop-filter: blur(10px);
  }
  .BetaNotice span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 720px) {
    .grid {
      display: flex;
      flex-direction: column;
    }
    .content {
      padding: 0;
    }
    .grid.publication .content {
      background-color: var(--workspace-color);
    }
  }
</style>

<svelte:head>
  <meta name="csrftoken" content={$session.csrfToken} />
  <title>{$title}</title>
</svelte:head>
<svelte:window bind:innerHeight={windowHeight} />
{#if $error}
  {#if $error.response.body}
    <h1>Something went wrong.</h1>
    <p>See the error object below.</p>
    <p>
      <a href="/logout">Signing out</a>
      and then signing back in might help.
    </p>
    <pre>
      <code>{JSON.stringify($error, null, 2)}</code>
    </pre>
  {:else}
    <pre>
      <code>{JSON.stringify($error, null, 2)}</code>
    </pre>
  {/if}
{:else if !$session.user && !$page.path.startsWith('/sign-')}
  <div class="content unfinished">
    <SignIn path={$page.path} />
  </div>
  <!-- {:else if !$session.user && $page.path === '/sign-up'}
  <div class="content unfinished">
  <SignUp />
  </div>
{:else if !$session.user && $page.path === '/sign-in'}
  <div class="content unfinished">
  <SignInPage />
  </div> -->
{:else}
  {#if betaNotice}
    <div class="BetaNotice">
      <p>
        <strong>NOTE: This is a beta version of Rebus Ink.</strong>
        There will be bugs and changes, both expected and unexpected! To ask for
        help, stay up to date with new features, provide feedback and keep in
        touch with the team, please go to
        <a href="https://support.rebus.ink/">support.rebus.ink</a>
      </p>
      <span>
        <button
          class="GenericButton"
          on:click={() => {
            betaNotice = false;
          }}>
          Dismiss
        </button>
      </span>
    </div>
  {/if}
  <main class="grid" class:publication >
    {#if !publication}
      <Nav {params} />
    {/if}
    <div class="content" class:publication>
      <slot />
    </div>
  </main>
  <div id="scratch" aria-hidden="true" class="visually-hidden" />
  <div id="positioner" aria-hidden="true" class="visually-hidden" />
  <NoteEditDialog />
{/if}
