import got from "got";

export async function put(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
  const url = `${process.env.API_SERVER}sources/${req.params.publicationId}/`;
  try {
    const response = await addCollection(
      url,
      req.params.collectionId,
      req.user.token
    );
    return res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

function addCollection(id, collection, token) {
  return got
    .put(`${id}tags/${collection}`, {
      headers: {
        "content-type": "application/ld+json",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
}

export async function del(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
  const url = `${process.env.API_SERVER}sources/${req.params.publicationId}/`;
  try {
    const response = await removeCollection(
      url,
      req.params.collectionId,
      req.user.token
    );
    return res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

function removeCollection(id, collection, token) {
  return got
    .delete(`${id}tags/${collection}`, {
      headers: {
        "content-type": "application/ld+json",
        Authorization: `Bearer ${token}`,
      },
    })
    .json();
}
