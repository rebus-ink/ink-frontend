<script>
  import Notebooks from "../../../../components/notebooks/Notebooks.svelte";
  import { stores } from "@sapper/app";
  const { page } = stores();
</script>

<Notebooks id={$page.params.id} noteId={$page.params.id} />
