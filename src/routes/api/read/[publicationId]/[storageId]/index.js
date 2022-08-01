const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const path = require("path");

export async function get(req, res, next) {
  // Does this need to load notes as well?
  if (!req.user.profile) return res.sendStatus(401);
  const bucket = storage.bucket(process.env.PUBLICATION_BUCKET);
  try {
    const userPrefix = new URL(req.user.profile.id).pathname.replace("/", "");
    const basePath = path.join(userPrefix, req.params.storageId, "index.json");
    const file = bucket.file(basePath);
    const [exists] = await file.exists();
    if (!exists) return res.sendStatus(404);
    const [data] = await file.download();
    const [metadata] = await file.getMetadata();
    res.append("Last-Modified", new Date(metadata.updated).toUTCString());
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    if (err.response && err.response.statusCode) {
      res.status(err.response.statusCode);
      return res.json(JSON.parse(err.response.body));
    } else {
      res.status(500);
      return res.json(JSON.parse(err));
    }
  }
}
