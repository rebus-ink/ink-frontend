const mime = require("mime");
const path = require("path");
const short = require("short-uuid");
const translator = short();
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

// Prefix with user id and with random id.
export async function post(req, res, next) {
  if (!req.user || (req.user.profile && req.user.profile.id)) {
    const suffix = path.extname(req.body.file);
    const type = mime.getType(suffix);
    const publication = suffix === ".epub" || suffix === ".docx";
    const config = {
      version: "v4",
      action: "write",
      expires: Date.now() + 1000 * 60 * 60 * 24,
      contentType: type,
    };
    const userPrefix = new URL(req.user.profile.id).pathname.replace("/", "");
    const filePrefix = translator.new();
    try {
      const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);
      bucket.makePublic({includeFiles: true})
      const [url] = await bucket
        .file(`${userPrefix}/${filePrefix}`)
        .getSignedUrl(config);
      const original = `https://storage.cloud.google.com/${process.env.GOOGLE_STORAGE_BUCKET}/${userPrefix}/${filePrefix}`;

      // console.log(original)
      res.json({ url, type, publication, storageId: filePrefix, original });
    } catch (err) {
      res.json({
        error: true,
        message: err.message,
        bucket: process.env.GOOGLE_STORAGE_BUCKET,
        userPrefix,
      });
    }
  }
}
