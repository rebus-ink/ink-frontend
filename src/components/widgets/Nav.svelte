<script>
  import { send, receive } from "../../routes/_crossfade.js";
  import NavSource from "../img/NavSource.svelte";
  import NavNotes from "../img/NavNotes.svelte";
  import NavSearch from "../img/NavSearch.svelte"
  import NavNotebook from "../img/NavNotebook.svelte";
  import IcoAvatar from "../img/IcoAvatar.svelte";
  export let params;

  import { stores } from "@sapper/app";
  const { session } = stores();

  $: url = `/readers/${$session.user.profile.shortId}` || "";
  $: user = $session.user.picture;
</script>

<style>
  nav {
    background: var(--workspace-color);
    position: sticky;
    top: 0;
    z-index: 4;
    border-radius: 0 30px 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* We're creating this variable in _layout.svelte because you can't just 
       use 100vh on mobile. Mobile browsers have a dynamic viewport height 
       because their toolbars collapse. If you want to do full screen height 
       using CSS and have that work on mobile then you need to get creative.*/
    max-height: var(--viewheight, 95vh);
  }
  :global(nav.ntbkModal::after) {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
  }
  li a {
    padding: 11px var(--base);
    margin: var(--base) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 60%;
    font-weight: 600;
    text-decoration: none;
    color: #fff;
    position: relative;
    outline: none;
    z-index: 1;
  }
  li:first-child a,
  li:last-child a {
    margin: 0;
  }
  ul:first-child li a {
    padding-top: 20px;
  }
  ul:last-child li a {
    padding-bottom: 20px;
  }
  li a:hover {
    color: var(--hover);
  }
  a.selected {
    color: var(--workspace-color) !important;
  }
  a :global(svg) {
    margin-bottom: calc(var(--base) * 0.25);
  }
  span.marker {
    background: #c1cbd0;
    width: 60px;
    height: 65px;
    z-index: -1;
    display: block;
    border-radius: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: top 0.5s cubic-bezier(0.49, -0.38, 0.61, 1.49);
    -webkit-transition: top 0.5s cubic-bezier(0.49, -0.38, 0.61, 1.49);
  }
  .profile {
    margin-top: auto;
  }
  .profile svg {
    width: 30px;
    height: 30px;
    margin: 5px 0;
  }
  .menu {
    margin-top: calc(var(--base) * 2);
  }
  .Settings {
    position: relative;
  }
  .Settings img,
  .Settings :global(svg:not(.Gear)) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  .Settings .Gear {
    position: absolute;
    bottom: 20px;
    right: 15px;
    margin: 0;
    width: 17px;
    background: var(--workspace-color);
    border-radius: 50%;
    height: 17px;
    padding: 2px;
  }
  @media (max-width: 720px) {
    nav {
      position: relative;
      flex-direction: row;
      width: 100vw;
      justify-content: space-between;
      z-index: 3;
      border-radius: 0;
    }
    ul:first-child li a,
    ul:last-child li a {
      padding: 15px 20px;
    }
    .logo img {
      height: 30px;
      width: auto;
      margin: 0;
      padding: 0;
    }
    .menu {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 0;
      padding: 0;
      width: 50vw;
    }
    .menu li,
    .menu li a {
      margin: 0 auto;
    }
    .menu li {
      width: 50%;
      text-align: center;
    }
    .menu li a {
      float: none;
    }
    span.marker {
      width: 70px;
      height: 50px;
    }
    .profile,
    .profile svg {
      margin: 0;
    }
  }
</style>

<nav aria-label="Ink Sections">
  <ul class="logo">
    <li>
      <a
        href="/"
        class:selected={params.segment === 'front'}
        aria-current={params.segment === 'front' ? 'page' : null}>
        <img src="/favicon.png" alt="Front Page" />
      </a>
    </li>
  </ul>
  <ul class="menu">
    <li>
      <a
        href="/library/all/all"
        class:selected={params.segment === 'library'}
        aria-current={params.segment === 'library' ? 'page' : null}>
        {#if params.segment === 'library'}
          <span
            class="marker"
            out:send|local|local={{ key: 'nav-marker' }}
            in:receive|local={{ key: 'nav-marker' }} />
        {/if}
        <NavSource />
        Sources
      </a>
    </li>
    <li>
      <a
        href="/notes/all/all"
        class:selected={params.segment === 'notes'}
        aria-current={params.segment === 'notes' ? 'page' : null}>
        {#if params.segment === 'notes'}
          <span
            class="marker"
            out:send|local|local={{ key: 'nav-marker' }}
            in:receive|local={{ key: 'nav-marker' }} />
        {/if}
        <NavNotes />
        Notes
      </a>
    </li>
    <li>
      <a
        href="/notebooks"
        class:selected={params.segment === 'notebooks'}
        aria-current={params.segment === 'notebooks' ? 'page' : null}>
        {#if params.segment === 'notebooks'}
          <span
            class="marker"
            out:send|local|local={{ key: 'nav-marker' }}
            in:receive|local={{ key: 'nav-marker' }} />
        {/if}
        <NavNotebook />
        Notebooks
      </a>
    </li>

    <li>
      <a
        href="/search"
        class:selected={params.segment === 'search'}
        aria-current={params.segment === 'search' ? 'page' : null}>
        {#if params.segment === 'search'}
          <span
            class="marker"
            out:send|local|local={{ key: 'nav-marker' }}
            in:receive|local={{ key: 'nav-marker' }} />
        {/if}
        <NavSearch />
        Search
      </a>
    </li>
    <li style="display: none;">
      <a
        href="/discovery"
        class:selected={params.segment === 'discovery'}
        aria-current={params.segment === 'discovery' ? 'page' : null}>
        {#if params.segment === 'discovery'}
          <span
            class="marker"
            out:send|local={{ key: 'nav-marker' }}
            in:receive|local={{ key: 'nav-marker' }} />
        {/if}
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.09858 0C3.63291 0 0 3.58896 0 8.00018C0 12.4114 3.63291 16
            8.09858 16C12.5643 16 16.1975 12.4114 16.1975 8.00018C16.1975
            3.58896 12.5643 0 8.09858 0ZM7.76437 10.4591C7.81002 10.5945 7.41041
            10.9892 7.37617 11.0117C7.3419 11.0343 6.59979 10.6283 6.47421
            10.5719C6.34859 10.5155 6.0632 9.602 6.0632 9.602L5.78917
            9.34259C5.78917 9.34259 5.16124 8.88022 5.10413 8.85763C5.04706
            8.83508 4.9329 7.96671 4.89629 7.88776C4.85972 7.8088 4.61318
            7.56066 4.54471 7.51558C4.47619 7.47048 4.44195 6.70357 4.44195
            6.70357C4.44195 6.70357 4.47618 6.26375 4.70452 5.93666C4.93289
            5.60961 4.92144 5.0457 4.85296 4.93292C4.78445 4.82015 4.33677
            4.98363 4.33677 4.98363C4.33677 4.98363 3.99052 4.81401 3.95628
            4.83656L3.72468 4.41172C3.72468 4.41172 2.34534 4.31481 2.36815
            4.281C2.36815 4.281 4.56537 0.826649 9.12584 1.34353H9.20559C9.45294
            1.3617 9.68073 1.36188 9.8102 1.58849C9.83554 1.63279 10.2991 2.0345
            10.2875 2.0345C10.2849 2.0345 9.02022 2.0345 9.02022 2.0345L8.75761
            2.26004L9.91171 2.94102C9.75368 2.9836 9.43262 3.08248 9.21619
            3.14999C9.07074 3.19539 8.93621 3.26405 8.81421 3.35441L8.35804
            3.69237L7.93374 4.29011L8.55209 4.7412C8.55209 4.7412 9.27137
            5.28257 9.30565 5.30511C9.33989 5.32766 9.48834 4.85397 9.48834
            4.85397C9.47308 4.48931 9.45787 4.12468 9.44264 3.76001C9.55681
            3.79763 9.67098 3.8352 9.78514 3.87278L10.2875 3.82769C10.2875
            3.82769 10.7899 4.21115 10.847 4.25623C10.904 4.30137 11.1324
            4.78632 11.1324 4.78632C11.1254 4.86214 11.0717 5.27659 11.1693
            5.2918C11.1883 5.29476 11.207 5.28636 11.2242 5.2781C11.3972 5.19508
            11.5623 5.09808 11.7277 5.00136C11.8059 4.95556 11.9736 4.80887
            12.0686 4.80887C12.1028 4.80887 11.9202 5.21488 11.8973
            5.2487C11.8794 5.27531 11.4518 5.97856 11.2701 6.27772C11.2151
            6.36809 11.1516 6.44832 11.0768 6.52347L10.4816 7.12085L10.6871
            7.47045L10.1905 8.05116C10.1487 8.10005 10.1033 8.1459 10.0549
            8.18838L9.52256 8.65464C9.52256 8.65464 8.94027 8.79 8.90604
            8.79C8.87176 8.79 8.43791 8.89151 8.43791 8.89151C8.43791 8.89151
            7.61588 8.81255 7.50172 9.2411C7.38758 9.66968 7.71867 10.3238
            7.76437 10.4591ZM13.8293 8.36732C13.9331 8.34451 13.5524 8.84596
            13.5293 8.92571C13.5062 9.00547 13.114 9.40435 13.114
            9.40435L12.4679 9.48411C12.5733 8.88819 13.0719 8.44049 13.6818
            8.38461C13.755 8.37789 13.8083 8.37192 13.8293 8.36732ZM10.1546
            10.3706L9.85184 9.92799C9.82763 9.89209 9.97295 9.73657 9.97295
            9.73657C9.97295 9.73657 11.1234 9.56912 11.2324 9.58105C11.3414
            9.59303 11.523 9.92799 11.523 9.92799C11.523 9.92799 11.1234 10.4423
            10.9902 10.4423C10.857 10.4423 10.1546 10.3706 10.1546
            10.3706ZM10.4605 11.9228C10.4605 11.9228 10.3221 11.9798 10.1837
            12.0482C10.0452 12.1165 9.87221 12.1735 9.84912 12.1279C9.82602
            12.0824 9.72219 12.014 9.53764 11.8772C9.35303 11.7405 9.11078
            11.6151 8.98386 11.5582C8.85698 11.5012 8.56854 11.2847 8.52241
            11.1821C8.49277 11.1163 8.63778 10.92 8.66083 10.8175C8.68392
            10.7149 8.64932 10.4092 8.71851 10.4424C8.78774 10.4756 8.93771
            10.3864 9.08768 10.4424C9.2377 10.4984 9.4684 10.6123 9.51454
            10.7035C9.56072 10.7946 9.67606 10.9998 9.80297 11.0796C9.92985
            11.1593 10.1606 11.2505 10.149 11.3986C10.1375 11.5468 10.3221
            11.7405 10.3221 11.7405L10.4605 11.9228ZM10.6861 14.055C10.0577
            13.7798 9.90027 13.4688 9.94873 13.409C9.99716 13.3492 10.3968
            13.0262 10.5179 12.8587C10.639 12.6913 11.2687 11.9855 11.2687
            11.9855L11.075 11.6027L11.6162 11.2868C11.7861 11.1876 11.9761
            11.1264 12.1725 11.1075L12.6992 11.057C12.7305 11.0539 12.7619
            11.052 12.7934 11.0512L13.6423 11.0285C13.6423 11.0285 14.4136
            10.8312 14.2962 11.0405C12.5276 14.1943 10.6861 14.055 10.6861
            14.055Z"
            fill="currentColor" />
        </svg>
        Discovery
      </a>
    </li>
  </ul>

  <ul class="profile">
    <!-- <li><a href="/profile" class:selected={params.segment === "profile"}>
    {#if params.segment === "profile"}       
      <span class="marker" out:send|local="{{key: 'nav-marker'}}" in:receive|local="{{key: 'nav-marker'}}"></span>
    {/if}
    <img class="avatar" width="27" height="27" src="https://ca.slack-edge.com/T03BD3W1V-U1GEX1EC8-ce7138e83488-512" alt="Profile">
    </a></li> -->
    <li>
      <a
        class="Settings"
        href={url}
        aria-label="Settings"
        aria-current={params.segment === 'profile' ? 'page' : null}>
        {#if user}
          <img src={user} alt="Avatar" />
        {:else}
          <IcoAvatar />
        {/if}
        <svg
          class="Gear"
          width="10"
          height="10"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.0962 13.473C12.0962 12.6846 12.7388 12.042 13.5272
              12.042C14.321 12.042 14.9582 12.6846 14.9582 13.473C14.9582
              14.2668 14.3156 14.904 13.5272 14.904C12.7388 14.904 12.0962
              14.2668 12.0962 13.473ZM13.5272 9.74703C11.4698 9.74703 9.80123
              11.4156 9.80123 13.473C9.80123 15.5304 11.4698 17.199 13.5272
              17.199C15.5846 17.199 17.2532 15.5304 17.2532 13.473C17.2532
              11.4156 15.5846 9.74703 13.5272 9.74703ZM3.87203 16.2162C4.08803
              16.9884 4.40123 17.7228 4.79003 18.4032L3.06743 20.2824C2.57603
              20.7738 2.57603 21.573 3.06743 22.0644L4.93043 23.9274C5.42183
              24.4188 6.22103 24.4188 6.71243 23.9274L8.59163 22.2102C9.27203
              22.599 10.0064 22.9068 10.784 23.1282L10.946 25.6878C10.946
              26.3844 11.5076 26.9514 12.2096 26.9514H14.8448C15.5414 26.9514
              16.1084 26.3898 16.1084 25.6878L16.2704 23.1282C17.0426 22.9122
              17.777 22.599 18.4628 22.2102L20.342 23.9274C20.8334 24.4188
              21.6326 24.4188 22.124 23.9274L23.987 22.0644C24.4784 21.573
              24.4784 20.7738 23.987 20.2824L22.2698 18.4032C22.6586 17.7228
              22.9664 16.9884 23.1878 16.2162L25.7474 16.0542C26.444 16.0542
              27.011 15.4926 27.011 14.7906V12.1554C27.011 11.4534 26.4494
              10.8918 25.7474 10.8918L23.1878 10.7298C22.9718 9.95763 22.6586
              9.22323 22.2698 8.53743L23.987 6.65823C24.4784 6.16683 24.4784
              5.36763 23.987 4.87623L22.124 3.01323C21.6326 2.52183 20.8334
              2.52183 20.342 3.01323L18.4628 4.73583C17.7824 4.34703 17.048
              4.03923 16.2704 3.81783L16.1084 1.25823C16.1084 0.556229 15.5468
              -0.00537109 14.8448 -0.00537109H12.2096C11.5076 -0.00537109 10.946
              0.556229 10.946 1.25823L10.784 3.81783C10.0118 4.03383 9.27743
              4.34703 8.59163 4.73583L6.71243 3.01323C6.22103 2.52183 5.42183
              2.52183 4.93043 3.01323L3.06743 4.87623C2.57603 5.36763 2.57603
              6.16683 3.06743 6.65823L4.79003 8.53743C4.40123 9.21783 4.09343
              9.95223 3.87203 10.7298L1.31243 10.8918C0.610428 10.8918 0.0488281
              11.4534 0.0488281 12.1554V14.7906C0.0488281 15.4872 0.610428
              16.0542 1.31243 16.0542L3.87203 16.2162ZM13.5272 7.45203C16.8536
              7.45203 19.5482 10.1466 19.5482 13.473C19.5482 16.7994 16.8536
              19.494 13.5272 19.494C10.2008 19.494 7.50623 16.7994 7.50623
              13.473C7.50623 10.1466 10.2008 7.45203 13.5272 7.45203Z"
              fill="currentColor" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="27" height="27" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
    </li>
  </ul>
</nav>
