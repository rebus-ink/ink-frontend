import got from "got";

export async function get(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
  try {
    let url = `${process.env.API_SERVER}noteContexts`;
    const query = new URLSearchParams(req.query);
    // if (req.query.dir === "desc") {
    //   query.append("reverse", "true");
    // }
    // if (req.query.orderBy === "modified") {
    //   query.delete("orderBy");
    // }
    query.delete("dir");
    url = `${url}?${query.toString()}`;
    console.log('url?', url)
    const response = await got(url, {
      headers: {
        Authorization: `Bearer ${req.user.token}`,
      },
    }).json();
    console.log('response?', response)
    res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

export const post = async function post(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
console.log('req?', req.body)
  if (req.user && req.user.profile) {
    try {

      const payload = Object.assign(
        {},
        { name: "Untitled :/", notebookId: req.body.notebookId }
      );
      console.log('payload?', payload)

      const outline = await got
        .post(`${process.env.API_SERVER}outlines`, {
          body: JSON.stringify(payload),
          headers: {
            "content-type": "application/ld+json",
            Authorization: `Bearer ${req.user.token}`,
          },
        })
        .json();

      if (outline)
        res.redirect(
          `/outlines/${outline.shortId}?notebook=${req.body.notebookId}`
        );
      return res.json(outline);
    } catch (err) {
      console.error(err);
      res.status(err.response.statusCode);
      return res.json(JSON.parse(err.response.body));
    }
  }
};
<<<<<<< HEAD:src/routes/api/outlines/index.js

export async function get(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);

  try {
    let url = `${process.env.API_SERVER}noteContexts`;
    const query = new URLSearchParams(req.query);

    if (req.query.dir === "desc") query.append("reverse", "true");
    if (req.query.orderBy === "modified") query.delete("orderBy");

    query.delete("dir");
    url = `${url}?${query.toString()}`;

    const response = await got(url, {
      headers: {
        Authorization: `Bearer ${req.user.token}`,
      },
    }).json();
    res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}
=======
>>>>>>> e99a839 (removed canvas):src/routes/api/pages/index.js
