import got from "got";

// Make a list of fake notes: motivation, lang, id, body

export async function get(req, res, next) {
  if (!req.user || !req.user.profile) return res.sendStatus(401);
  const url = `${process.env.API_SERVER}notes/${req.params.id}`;
  try {
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
export async function put(req, res, next) {
  const url = `${process.env.API_SERVER}notes/${req.params.id}`;
  const tags = req.body._tags;
  delete req.body._tags;
  try {
    const response = await got.put(url, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${req.user.token}`,
      },
      json: req.body,
    });

    if (tags && tags.length !== 0) {
      for (const tag of tags) {
        await got.put(`${url}/tags/${tag}`, {
          headers: {
            "content-type": "application/ld+json",
            Authorization: `Bearer ${req.user.token}`,
          },
        });
      }
    }

    // console.log("response: ", response.body, req.body);
    return res.sendStatus(response.statusCode);
  } catch (err) {
    console.log(err);
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

export async function del(req, res, next) {
  try {
    const response = await got
      .delete(`${process.env.API_SERVER}notes/${req.params.id}`, {
        headers: {
          Authorization: `Bearer ${req.user.token}`,
        },
      })
      .json();
    console.log("here");
    return res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}
