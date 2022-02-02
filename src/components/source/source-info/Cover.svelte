<script>
  import { publication } from "../../../stores";
  let cover = {};
  $: if ($publication.resources) {
    cover = $publication.resources.find(
      resource => resource.rel.indexOf("cover") !== -1
    );
    if (!cover) {
      cover = {
        href: "/img/placeholder-cover.jpg",
        rel: ["cover"]
      };
    }
  } else {
    cover = {
      href: "/img/placeholder-cover.jpg",
      rel: ["cover"]
    };
  }
  //$: console.log(cover, $publication);
</script>

<style>
  .Image {
    width: 100%;
    height: auto;
    border: 1px solid #dddddd;
    border-radius: 10px;
    margin: 0 auto;
    max-width: 200px;
    -webkit-box-shadow: 2px 2px 7px 0px rgba(0, 0, 0, 0.13);
    -moz-box-shadow: 2px 2px 7px 0px rgba(0, 0, 0, 0.13);
    box-shadow: 2px 2px 7px 0px rgba(0, 0, 0, 0.13);
  }

  @media (max-width: 720px) {
    .Image {
      width: 150px;
    }
  }
</style>

<img
  src={cover.href ? cover.href : `/img/placeholder-cover.jpg`}
  alt="Cover for {$publication.name}"
  class="Image Cover" />
