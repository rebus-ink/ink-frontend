import got from "got";

export const post = async function post(req, res, next) {
  if (!req.user || !req.user.profile) return res.sendStatus(401);
  const collection = req.body._collection;
  const tags = req.body._tags;
  delete req.body.collection;
  delete req.body._tags;

  // console.log(tags);
  if (req.user && req.user.profile) {
    try {
      const response = await got
        .post(
          `${process.env.API_SERVER}notebooks/${req.params.notebookId}/notes`,
          {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${req.user.token}`,
            },
            json: req.body,
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

      // Check collection
      if (collection) {
        await got.put(`${response.id}/tags/${collection}`, {
          headers: {
            "content-type": "application/ld+json",
            Authorization: `Bearer ${req.user.token}`,
          },
        });
      }
      return res.json(response);
    } catch (err) {
      console.error(err);
      res.status(err.response.statusCode);
      return res.json(JSON.parse(err.response.body));
    }
  }
};
