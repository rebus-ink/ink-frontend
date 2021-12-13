<script>
    export let url;
  
  
    </script>
    
    <style>
      /* your styles go here */
  
      audio {
          display: block;
          margin: 30px auto 0 auto;
          width: 80%;
      }
  
    </style>
  
    <div>
        {#if url}
        <audio controls src={url}>
            <track src={url} kind="captions" />
            </audio>
        {/if}
  
    </div>
    