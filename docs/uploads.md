# Uploads

Uploads are accomplished using a fairly common pattern where we have an endpoint, `src/routes/api/upload-url.js`, that upon getting a filename in an authenticated POST request will return a JSON object containing the a signed upload URL to the Google Storage upload bucket, the file's file type, the prefix that will be used to save that file in the bucket, and the full unsigned url to the file in Google Storage.

The `storageId` prefix is saved with the source under the `json` property so that we can later link to the reading UI that loads that file.

Like so:

```
{
  json: {
    storageId: "long-and-weird-id"
  }
}
```

When the front end gets the returned JSON file it will upload the file whose filename that was up to the signed url


## Processing uploads

Once the file is in the bucket it will be processed by the Cloud Function (`functions/onfinalize`) that's attached to that bucket. This function runs the file through the [`ink-engine`](https://github.com/rebus-ink/ink-engine) module that turns EPUB, HTML, markdown, DOCX, and PDFs into HTML, SVG and JSON that are saved into the bucket indicated by the `PUBLICATION_BUCKET` env variable.

## Retrieving publications

After processing, navigating to `sources/:id/:storageId/:path+` will retrieve the file at `:path+` belonging to the source indicated by `:id`, using the `:storageId` prefix, convert that to HTML (using ink-engine again to match annotations to the HTML) and render.
