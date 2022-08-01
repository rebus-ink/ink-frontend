import got from "got";

// We need to take uploadURL, uploadType, storageId and uploadPublication and turn it into a link type
// Access URL is `/api/stored-${file}` where file is storageId
export async function post(req, res, next) {
  if (!req.user || !req.user.profile) return res.sendStatus(401);
  let author;
  if (req.body.author) {
    author = req.body.author.split(",").map((name) => {
      return {
        type: "Person",
        name: name.trim(),
      };
    });
  }
  const type = req.body.pubType || "Source";
  let links;
  if (req.body.newURL) {
    links = [
      {
        rel: "alternate",
        url: req.body.newURL,
      },
    ];
  } else if (req.body.storageId) {
    links = [
      {
        rel: "alternate",
        encodingFormat: "application/json",
        url: `/api/stored/${req.body.storageId}`,
      },
      {
        rel: "contents",
        encodingFormat: "application/json",
        url: `/api/toc/${req.body.storageId}`,
      },
    ];
    // if publication add another alternate with a publication manifest media type.
  }
  const body = {
    type,
    author,
    links,
    json: { storageId: req.body.storageId },
    name: req.body.name,
  };
  // console.log(body);
  if (req.user && req.user.profile) {
    try {
      const tags = req.body._tags;
      const response = await got
        .post(
          `${process.env.API_SERVER}notebooks/${req.params.notebookId}/sources`,
          {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${req.user.token}`,
            },
            body: JSON.stringify(body),
          }
        )
        .json();

      if (tags && tags.length !== 0) {
        for (const tag of tags) {
          await got.put(`${response.id}/tags/${tag}`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${req.user.token}`,
            },
          });
        }
      }

      if (req.body.addedCollections && req.body.addedCollections.length !== 0) {
        for (const coll of req.body.addedCollections) {
          await got
            .put(`${response.id}tags/${coll.value}`, {
              headers: {
                "content-type": "application/ld+json",
                Authorization: `Bearer ${req.user.token}`,
              },
            })
            .json();
        }
      }
      return res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500);
      return res.json(err.body);
    }
  }
}
