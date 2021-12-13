<script>
    import {publication} from "../../../stores"
    import EmptySourceNotes from "../source-empty/EmptySourceNotes.svelte"
    import TitleBar from "../source-titlebar/TitleBar.svelte";
    import Image from "./Image.svelte"
    import Audio from "./Audio.svelte"
    import Video from "./Video.svelte"

  let url, type;
  let source = {};
  $: if ($publication && $publication.json) {

    if ($publication.links && $publication.links[0] && $publication.links[0].encodingFormat) {
        if ($publication.links[0].encodingFormat.startsWith('image')) {
            type = "image"
        } else if ($publication.links[0].encodingFormat.startsWith('audio')) {
            type = "audio"
        }
      const readerId = $publication.readerId.split('/').pop();
      url = `https://storage.googleapis.com/ink-frontend-server-dev-uploads/readers/${readerId}/${$publication.json.storageId}`
    } else if ($publication.links && $publication.links[0] 
    && $publication.links[0].url && ($publication.links[0].url.startsWith('https://youtu') ||
    $publication.links[0].url.startsWith('https://www.youtu'))) {
      
      type = "video"
      let youtubeId = $publication.links[0].url.split('/').pop();
      if (youtubeId.startsWith('watch?')) youtubeId = youtubeId.substring(8)

      // remove things like channel information from url
      let index = youtubeId.indexOf('&')
      console.log(index)
      if (index > -1) {
        youtubeId = youtubeId.substring(0, index)
      }

      url = `https://www.youtube.com/embed/${youtubeId}`;

    } else if ($publication.links && $publication.links[0] 
    && $publication.links[0].url && $publication.links[0].url.startsWith('https://vimeo')) {

      type = "video"
      let vimeoId = $publication.links[0].url.split('/').pop();
      
      url = `https://player.vimeo.com/video/${vimeoId}`
    }

    source = $publication

  }

  </script>
  
  <style>
    /* your styles go here */
    .NoSource {
      display: grid;
      grid-template-columns: 600px auto;
      min-height: 100vh;
      padding-top: 30px;
    }

    .left-menu {
      background: lightgrey;
    }

    .TitleBar {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    }
    
  </style>

  <div>
    <div class="TitleBar">
      <TitleBar name={source ? source.name : ""} {source} />
    </div>
    <div class="NoSource">

      <div class="left-menu">
        {#if url && type==="image"}
        <Image {url} publication={$publication} />
        {:else if url && type==="audio"}
        <Audio {url} />
        {:else if type === "video"}
        <Video {url} />
        {/if}

      </div>
    
      <div>
        <EmptySourceNotes {source} pages={false} />
      </div>

    </div>
  </div>
  