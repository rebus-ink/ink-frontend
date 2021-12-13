<script context="module">
	export async function preload({params, query, path}) {
    const res = await this.fetch(`/api/sources/${params.id}`);
    const source = await res.json()
    if (source.json.storageId) {
      return this.redirect(302, `/sources/${params.id}/${source.json.storageId}`)
    } else {
      return {source}
    }
    // return {source}
  }
</script>

<script>
  import Multimedia from '../../../components/source/source-multimedia/Multimedia.svelte'
  import {title} from '../../../stores/title.js'
  export let source
  if (source.name) {
    $title = source.name + " - Rebus Ink"
  }
</script>

<style>
  /* your styles go here */
</style>

<Multimedia />