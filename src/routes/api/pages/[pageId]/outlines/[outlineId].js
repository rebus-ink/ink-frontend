import got from "got";

// Make a list of fake notes: motivation, lang, id, body

export async function get(req, res, next) {
  if (!req.user || !req.user.profile) return res.sendStatus(401);
  const url = `${process.env.API_SERVER}noteContexts/${req.params.outlineId}`;

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
  const url = `${process.env.API_SERVER}outlines/${req.params.outlineId}`;

  try {
    const response = await got.put(url, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${req.user.token}`,
      },
      json: req.body,
    });

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
      .delete(`${process.env.API_SERVER}outlines/${req.params.outlineId}`, {
        headers: {
          Authorization: `Bearer ${req.user.token}`,
        },
      })
      .json();
    return res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}
