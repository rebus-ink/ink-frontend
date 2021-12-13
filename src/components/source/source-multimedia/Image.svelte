<script>
  export let url;

  </script>
  
  <style>
    .image {
      width: 80%;
      margin: 0 auto;
    }
    img {
        display: block;
        margin: 30px auto 0 auto;
        
    }

  </style>

  <div class="image">

      {#if url}
      <img src={url} alt="linked" />
      {/if}

  </div>
