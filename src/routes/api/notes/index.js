import got from "got";
import mammoth from "mammoth";
let notebooks, sourceId, tags, skipDuplicates;


// Patch is used to send the notebooks, source or any other information
// that is not in the docx file
export const patch = async function patch(req,res,next) {
  console.log('patch body', req.body)
  notebooks = req.body.notebooks;
  sourceId = req.body.sourceId;
  tags = req.body.tags
  skipDuplicates = req.body.skipDuplicates;
  res.json({})

}

// PUT receives the file and uses it to create notes in the API

export const put = async function put(req,res,next) {

  const text = await (await mammoth.convertToHtml({buffer: req.body})).value;

  const notes = text.split('*****')

  const highlightDivider = "HIGHLIGHT:"
  const noteDivider = "NOTE:"
  let body;
 
  notes.forEach(async note => {
    
    if (note === "</p>" || note.length === 0) return; // empty note after *****

    if (note.includes(highlightDivider)) {
      let highlightIndex = note.indexOf(highlightDivider)
      let highlight, annotation;

      // with note too
      if (note.includes("NOTE:")) {
        let noteIndex = note.indexOf("NOTE:")
        if (highlightIndex < noteIndex) {
          highlight = note.substring(highlightIndex + highlightDivider.length, noteIndex)
          annotation = note.substring(noteIndex + noteDivider.length)
        } else {
          highlight = note.substring(highlightIndex + highlightDivider.length);
          annotation = note.substring(noteIndex + noteDivider.length, highlightIndex);
        }
      }
      body = {"body": [{"content": highlight, "motivation": "highlighting"}]}
      if (note) {
        body.body.push({"content": annotation, "motivation": "commenting"})
      }
    } else {
      body = {"body": [{"content": note, "motivation": "commenting"}]}
    }

    if (sourceId) body.sourceId = sourceId;
    if (notebooks) body.notebooks = notebooks;
    if (tags) body.tags = tags.map(tag => {
      return {id: tag}
    });

    let url;
    if (skipDuplicates) {
      url = `${process.env.API_SERVER}notes?skipDuplicates=true`
    } else {
      url = `${process.env.API_SERVER}notes`
    }

    await got
      .post(url, {
        headers: {
          "content-type": "application/ld+json",
          Authorization: `Bearer ${req.user.token}`,
        },
        json: body,
      })
      .json();
    })

  res.json({})

}

export const post = async function post(req, res, next) {
<<<<<<< HEAD
  if (!req.user || !req.user.profile) return res.sendStatus(401);  
=======
  if (!req.user || !req.user.profile) return res.sendStatus(401);
>>>>>>> fd32486 (cleaning up components)
  const collection = req.body._collection;
  const tags = req.body._tags;
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
