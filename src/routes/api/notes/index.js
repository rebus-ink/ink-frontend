import got from "got";

export const post = async function post(req, res, next) {
  if (!req.user || !req.user.profile) return res.sendStatus(401);
  const workspace = req.body._workspace;
  const collection = req.body._collection;
  const tags = req.body._tags;
  delete req.body._workspace;
  delete req.body.collection;
  delete req.body._tags;
  
  if (req.user && req.user.profile) {
    try {
      const response = await got
        .post(`${process.env.API_SERVER}notes`, {
          headers: {
            "content-type": "application/ld+json",
            Authorization: `Bearer ${req.user.token}`,
          },
          json: req.body,
        })
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
      // Check workspace, if there is one, add
      if (workspace) {
        await got.put(`${response.id}/tags/${workspace}`, {
          headers: {
            "content-type": "application/ld+json",
            Authorization: `Bearer ${req.user.token}`,
          },
        });
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

export async function get(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
  try {
    let url = `${process.env.API_SERVER}notes`;
    const query = new URLSearchParams(req.query);
    if (req.query.dir === "desc") {
      query.append("reverse", "true");
    }
    if (req.query.orderBy === "modified") {
      query.delete("orderBy");
    }
    query.delete("dir");
    url = `${url}?limit=50&${query.toString()}`;
    const response = await got(url, {
      headers: {
        Authorization: `Bearer ${req.user.token}`,
      },
    }).json();
    response.items = fixItems(response.items);
    res.json(response);
  } catch (err) {
    if (err.response && err.response.statusCode) {
      res.status(err.response.statusCode);
      return res.json(JSON.parse(err.response.body));
    } else {
      res.status(500);
      return res.json(JSON.parse(err));
    }
  }
}

function fixItems(items) {
  const fixed = items.map(fixItem).filter((item) => item);
  return fixed.filter((item) => {
    if (
      item.target.selector.type === "TextQuoteSelector" &&
      !item.target.selector.exact
    ) {
      return false;
    } else {
      return true;
    }
  });
}

function fixItem(item) {
  try {
    const body = [].concat(item.body).map((body) => {
      return {
        type: "TextualBody",
        content: body.content || "",
        format: "text/html",
        purpose: body.motivation,
        motivation: body.motivation,
      };
    });
    item.body = body;
    if (!item.target) {
      item.target = {};
    }
    if (!item.target.selector) {
      item.target.selector = {};
    }
    return item;
  } catch (err) {
    console.error(item);
    return null;
  }
}
