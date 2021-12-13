<script context="module">

	export async function preload({params, query, path}) {
    const res = await this.fetch(`/api/read/${params.id}/${params.storage}`);
    if (!res.ok) {
      return this.error(res.status, res.statusText)
    }
    const source = await res.json()
    if (source.readingOrder[0] && source.readingOrder[0].url) {
      return this.redirect(302, `${path}/${source.readingOrder[0].url}`)
    } else if (source._processing) {
      return this.redirect(302, `${path}/processing`)
    } else if (source.resources && source.resources[0] && 
      source.resources[0].encodingFormat &&
      (source.resources[0].encodingFormat.startsWith('image') || 
      source.resources[0].encodingFormat.startsWith('audio'))) {
      return this.redirect(302, `${path}/multimedia`)
    } else if (source._unsupported) {
      return this.redirect(302, `${path}/unsupported`)
    } else {
      this.error(501, "Not Implemented")  
    }
  }
  // sources/35h7hYmpcEEWy3Bki6SJGc-2668bcf447/5f8AUbc6ijW18A26oBijLM
  // http://localhost:3000/library/all/all/35h7hYmpcEEWy3Bki6SJGc-2668bcf447/OEBPS/front-matter-001-introduction.xhtml
</script>