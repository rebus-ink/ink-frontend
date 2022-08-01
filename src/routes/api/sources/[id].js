const ISO6391 = require("iso-639-1");
const got = require("got");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const path = require("path");

export async function get(req, res, next) {
  if (!req.user.profile) return res.sendStatus(401);
  const url = `${process.env.API_SERVER}sources/${req.params.id}`;
  try {
    const response = await got(url, {
      headers: {
        Authorization: `Bearer ${req.user.token}`,
      },
    }).json();
    response._inLanguage = [].concat(response.inLanguage).map((code) => {
      return {
        code,
        english: ISO6391.getName(code),
        native: ISO6391.getNativeName(code),
      };
    });
    response.keywords = response.keywords || [];
    if (!response.json || !response.json.storageId) {
      response._empty = true;
    } else if (response.json && response.json.storageId) {
      const bucket = storage.bucket(process.env.PUBLICATION_BUCKET);
      try {
        const userPrefix = new URL(req.user.profile.id).pathname.replace(
          "/",
          ""
        );
        const basePath = path.join(
          userPrefix,
          response.json.storageId,
          "index.json"
        );
        if (!req.query.skipStorage) {
          const file = bucket.file(basePath);
          const [exists] = await file.exists();
          if (!exists) {
            // console.log("publication does not exist");
            response._processing = true;
          } else { 
            // console.log("publication exists")
            const [data] = await file.download();
            const stored = JSON.parse(data);
            response.readingOrder = stored.readingOrder;
            response.resources = stored.resources;
            if (stored._processing) {
              // console.log("publication processing")
              response._processing = stored._processing;
            }
            if (stored._unsupported) {
              console.log('unsupported: ', response)

              if (response.links && response.links[0] && 
                response.links[0].encodingFormat && 
                (response.links[0].encodingFormat.startsWith('image') || 
                response.links[0].encodingFormat.startsWith('audio'))) {
                  response._multimedia = true;
              } else {
                // console.log("publication unsupported")
                response._unsupported = stored._unsupported;
              }

            }
            if (stored._error) {
              // console.log("publication error")
              response._error = stored._error;
            }
          }
        }
      } catch (err) {
        console.error(err);
        response._empty = true;
      }
    }
    // Get stored publication, add readingorder and resources from there
    // Add last-modified header

    res.append("Last-Modified", new Date(response.updated).toUTCString());
    res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}
export async function put(req, res, next) {
  const url = `${process.env.API_SERVER}sources/${req.params.id}`;
  delete req.body.keywords;
  const tags = req.body._tags;
  delete req.body._tags;
  try {
    const response = await got
      .patch(url, {
        headers: {
          "content-type": "application/ld+json",
          Authorization: `Bearer ${req.user.token}`,
        },
        json: req.body,
      })
      .json();
    // In theory this should let us add tags on updates
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
    return res.json(response);
  } catch (err) {
    res.status(err.response.statusCode);
    return res.json(JSON.parse(err.response.body));
  }
}

export async function del(req, res, next) {
  try {
    const response = await got
      .delete(`${process.env.API_SERVER}sources/${req.params.id}`, {
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
