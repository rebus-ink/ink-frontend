// We need a batch update endpoint:
//  Goes through the items, one by one.
//    Changes type
//    Adds authors
//    Adds collections (if necessary)

import got from "got";

export async function del(req, res, next) {
  if (!req.user || !req.user.profile) return res.sendStatus(401);
  if (!req.body.items) return;

  const ids = req.body.items.map((item) => item.id);
  let responses = [];
  for (const id of ids) {
    try {
      const response = await got
        .delete(id, {
          headers: {
            Authorization: `Bearer ${req.user.token}`,
          },
        })
        .json();
      responses = responses.concat(response);
    } catch (err) {
      responses = responses.concat(err.response);
    }
  }
  return res.json(responses);
}

export async function put(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
  if (!req.body.items) return;
  // console.log(req.body);
  const ids = req.body.items.map((item) => item.id);
  let responses = [];
  for (const id of ids) {
    let patch;

    if (req.body.addedNotebooks) {
      patch = Object.assign({}, patch, {
        operation: 'add',
        property: 'notebooks',
        sources: req.body.items.map(item => item.shortId),
        value: req.body.addedNotebooks.map(notebook => notebook.shortId)
      })
        try {
        const response = await got
          .patch(`${process.env.API_SERVER}sources/batchUpdate`, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${req.user.token}`,
            },
            json: patch,
          })
          .json();

        responses = responses.concat(response);
      } catch (err) {
        responses = responses.concat(err.response.body);
      }
    
    }

    if (req.body.pubType !== "none") {
      patch = {
        type: req.body.pubType,
      };
    }
    if (req.body.updateAddAuthors) {
      patch = Object.assign({}, patch, {
        author: req.body.updateAddAuthors
          .split(",")
          .map((author) => author.trim()),
      });
    }
    if (patch) {
      try {
        const response = await got
          .patch(id, {
            headers: {
              "content-type": "application/ld+json",
              Authorization: `Bearer ${req.user.token}`,
            },
            json: patch,
          })
          .json();
        responses = responses.concat(response);
      } catch (err) {
        console.log(err);
        responses = responses.concat(err.response.body);
      }
    }
  }
  return res.json(responses);
  // if change collection, add pub to collection one by one.
}

