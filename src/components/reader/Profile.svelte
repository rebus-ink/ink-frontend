<script>
  import { getToken } from "../../getToken";
  import IcoAvatar from "../img/IcoAvatar.svelte";
  import NavNotebook from "../img/NavNotebook.svelte";
  import NavNotes from "../img/NavNotes.svelte";
  import NavSource from "../img/NavSource.svelte";
  import IcoStack from "../img/IcoStack.svelte";
  import IcoEdit from "../img/IcoEdit.svelte";
  import IcoCanvas from "../img/IcoCanvas.svelte";
  import Loader from "../widgets/Loader.svelte";
  import { stores } from "@sapper/app";
  import {
    profileNotes,
    profileNotebooks,
    profileSources,
    refreshReader,
    reader,
  } from "../../stores";
  const { session } = stores();

  let activities = ["notes", "sources", "notebooks", "stacks"];
  function assignIco(icon) {
    switch (icon) {
      case "notes":
        return NavNotes;
      case "sources":
        return NavSource;
      case "notebooks":
        return NavNotebook;
      case "canvas":
        return IcoCanvas;
      case "stacks":
        return IcoStack;
    }
  }

  $: update = {
    notes: isNumber($profileNotes),
    sources: isNumber($profileSources.totalItems),
    notebooks: isNumber($profileNotebooks),
    canvas: 0,
    stacks: $profileSources.tags
      ? $profileSources.tags.filter((item) => {
          if (item.type === "stack") return item;
        }).length
      : 0,
  };

  let isNumber = (n) => {
    return typeof n === "number" ? n : 0;
  };

  $: user = $session.user;
  $: isUser = user.nickname;
  $: institution =
    $reader.profile && $reader.profile.institution
      ? $reader.profile.institution
      : "";

  let inputLoad = false;

  let editInst = false;

  async function submit() {
    editInst = false;
    inputLoad = true;
    try {
      const payload = Object.assign({}, $reader);
      if (!payload.profile) payload.profile = {};
      payload.profile["institution"] = sendValue;

      await window.fetch(`/api/readers/${user.profile.shortId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "csrf-token": getToken(),
        },
      });

      $refreshReader = { id: $reader, time: Date.now() };
      inputLoad = false;
    } catch (err) {
      console.error(err);
    }
  }

  let sendValue;
  let created = (input, inst) => {
    input.focus();
    sendValue = inst ? inst : "";
  };
</script>

<style>
  .Profile {
    width: 100%;
    padding: 30px;
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    gap: 40px;
    grid-template-columns: 0.35fr 0.65fr;
  }
  .Profile * {
    margin: 0;
    padding: 0;
  }
  h4 {
    font-size: 1rem;
    font-weight: 700;
  }
  .User,
  .Activity,
  .Right {
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 30px;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.03);
  }
  /*---------- Left column ----------*/
  .Left {
    display: grid;
    gap: 30px;
    grid-template-rows: max-content max-content max-content;
  }
  .User {
    padding: 50px 30px;
    text-align: center;
    display: grid;
    gap: 3px;
  }
  .Image {
    margin-bottom: 20px;
  }
  .Image :global(svg),
  .Image img {
    width: 100px;
    height: auto;
    border-radius: 50%;
  }
  .Image img {
    border: 1px solid #eeeeee;
  }
  .User p {
    font-size: 0.9rem;
    color: #888888;
  }
  .Activity {
    padding: 30px;
    display: grid;
    gap: 15px;
  }
  .Activity section {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    gap: 10px;
    align-items: center;
  }
  .Activity h4,
  .Right h4 {
    margin-bottom: 10px;
  }
  .Activity .Icon {
    background: var(--main-background-color);
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 1px solid #dde8ed;
    position: relative;
  }
  .Activity :global(svg) {
    color: var(--workspace-color);
    height: 50%;
    width: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .Activity .stacks :global(svg) {
    height: 60%;
    transform: translate(-50%, calc(-50% - 1px));
  }
  .Activity .Item {
    font-size: 0.9rem;
    font-weight: 500;
  }
  .Activity .Quantity {
    font-size: 1rem;
    font-weight: 600;
    color: var(--action);
  }
  .Profile form {
    text-align: center;
  }
  .Profile form button {
    background: var(--action);
    color: #ffffff;
    padding: 10px 40px;
    border-radius: 10px;
  }
  /*---------- Right column ----------*/
  .Right {
    padding: 50px 60px;
    display: grid;
    gap: 80px;
    grid-auto-rows: max-content;
  }
  .Right h4 {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 20px;
    align-items: center;
  }
  .Right h4::after {
    background: #dddddd;
    content: "";
    height: 1px;
    width: 100%;
    display: block;
  }
  .Right p {
    font-size: 0.9rem;
    font-weight: 500;
  }
  .Right p.Value {
    font-weight: 400;
  }
  .Right p.Value.Saving {
    max-height: 20px;
    transform: scale(0.7, 0.7);
  }
  .Right p.Value :global(.Loading) {
    margin: 0 auto;
  }
  .Right section {
    display: grid;
    gap: 15px;
  }
  label {
    display: grid;
    grid-template-columns: 150px 1fr;
    grid-gap: 10px;
    align-items: center;
  }
  label[for="institution"] .Value {
    cursor: pointer;
    position: relative;
  }
  label[for="institution"] .Value :global(svg) {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  label.Delete {
    grid-template-columns: 1fr;
  }
  .Inputs {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr max-content;
  }
  .Profile label input {
    border: 1px solid #dde8ed;
    border-radius: 8px;
    background: var(--main-background-color);
    color: var(--action);
    padding: 7px 12px;
    font-weight: 500;
    outline: none;
  }
  .Profile label input::placeholder {
    color: var(--workspace-color);
    opacity: 0.6;
  }
  .Inputs span {
    background: var(--action);
    color: #fff;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9px;
    align-items: center;
    display: grid;
    padding: 0 10px;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .Left {
      grid-template-columns: 1fr 1fr;
    }
    .Profile {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .Profile form {
      text-align: right;
      grid-column: 1/3;
      order: -1;
    }
  }
  @media (max-width: 640px) {
    .Left > div {
      grid-column: 1/3;
    }
    .Profile {
      gap: 30px;
    }
    label {
      grid-template-columns: 1fr;
      gap: 3px;
    }
  }
</style>

<div class="Profile">
  <div class="Left">
    <div class="User">
      <div class="Image">
        {#if isUser}
          <img src={user.picture} alt="Avatar" />
        {:else}
          <IcoAvatar />
        {/if}
      </div>
      <h4>
        {isUser ? `${user.name.givenName} ${user.name.familyName}` : 'Nickname'}
      </h4>
      <p class="Email">{isUser ? user.email : 'Email'}</p>
    </div>
    <div class="Activity">
      <h4>Activity</h4>
      {#each activities as activity}
        <section>
          <div class="Icon {activity}">
            <svelte:component this={assignIco(activity)} />
          </div>
          <p class="Item">{activity}</p>
          <p class="Quantity">{update[activity]}</p>
        </section>
      {/each}
    </div>
    <form action="/logout" method="POST">
      <button class="GenericButton">Logout</button>
    </form>
  </div>

  <div class="Right">
    <section>
      <h4>User profile</h4>
      <label for="fullName">
        <p>Full Name</p>
        <p class="Value">
          {isUser ? `${user.name.givenName} ${user.name.familyName}` : 'Full name'}
        </p>
      </label>
      <label for="Nickname">
        <p>Nickname</p>
        <p class="Value">{isUser ? user.nickname : 'Nickname'}</p>
      </label>
      <label for="institution">
        <p>Institution</p>
        {#if editInst}
          <div class="Inputs">
            <input
              placeholder="Add an institution"
              use:created={institution}
              bind:value={sendValue} />
            <span on:click={submit}>Save</span>
          </div>
        {:else}
          <p
            class="Value {inputLoad || $reader.type === 'loading' ? 'Saving' : ''}"
            on:click={() => (editInst = true)}>
            {#if inputLoad || $reader.type === 'loading'}
              <Loader />
            {:else}
              {$reader.profile && $reader.profile.institution ? $reader.profile.institution : 'Add an institution'}
              <IcoEdit />
            {/if}
          </p>
        {/if}
      </label>
      <label for="Creation">
        <p>Creation date</p>
        <p class="Value">
          {new Date(user.profile.published).toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </p>
      </label>
    </section>
    <section>
      <h4>Login information</h4>
      <label for="Email">
        <p>Email</p>
        <p class="Value">{isUser ? user.email : 'Email'}</p>
      </label>
      <label for="UserId">
        <p>User ID</p>
        <p class="Value">{user.profile.shortId}</p>
      </label>
    </section>
    <section>
      <h4>Delete account</h4>
      <label class="Delete" for="Delete">
        <p class="Value">Delete</p>
      </label>
    </section>
  </div>
</div>
