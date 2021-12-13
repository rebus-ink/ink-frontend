<script>
    export let url;
  
  
    </script>
    
    <style>
      /* your styles go here */
  
      iframe {
          display: block;
          margin: 30px auto 0 auto;
          width: 80%;
          height: 400px;
      }
  
    </style>
  
    <div>
  
        {#if url}
        <iframe src={url}></iframe>
        {/if}
  
    </div>
    