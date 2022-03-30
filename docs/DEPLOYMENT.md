# Deployment

Currently the entire Ink project is hosted on the Google Cloud Platform's App Engine.

The API server deployments are managed by the `Rebus Hosting` project. While the front end development and production deployments are managed by the `ink-frontend-server-dev` and `fb-ink-dev` respectively

Deployments are done using Google's `gcloud` utility. The commands are saved as `npm` scrips:

- `npm run deploy-production` will run `npm run build && gcloud app deploy app.yaml --project fb-ink-dev`
- `npm run deploy-dev` will run `NODE_ENV=development npm run build && gcloud app deploy app-dev.yaml --project ink-frontend-server-dev`

Both require a config file: `app.yaml` for production, `app-dev.yaml` for development. You can find copies of those configuration files in the Rebus 1Password.

Both also require you to be signed in using the gcloud utility and have user account permissions to access those projects.

## Github Action

The GitHub action attached to the `ink-frontend` repository is set up to automatically deploy to development if the tests pass. It does so using an `app.yaml` file that's saved as an ENV secret in the repository's settings and written out to a file as a part of the action.

## Deploying Cloud Functions

To deploy the cloud functions you need to change your working directory to `functions/onfinalize` and run one of the `npm` deployment scripts set up in that directory:

- `npm run deploy-function` will run `gcloud functions deploy triggerWrapper --runtime nodejs12 --trigger-resource ink-upload-files --trigger-event google.storage.object.finalize --memory=2048MB --timeout=300s --project fb-ink-dev` which will deploy the function to the `ink-upload-files` bucket in `fb-ink-dev`
- `npm run deploy-dev-function` will run `gcloud functions deploy triggerWrapper --runtime nodejs12 --trigger-resource ink-frontend-server-dev-uploads --trigger-event google.storage.object.finalize --project ink-frontend-server-dev --memory=2048MB --timeout=300s` which will take care of the dev deployment.

## Setting up the Google Cloud Function for processing uploaded files

Again, you need to work from the functions/onfinalize directory in the ink-frontend project.

You need to begin by making sure that you are working with the intended gcloud project as the default project. Otherwise you will run into permission issues. Either set gcloud to use that project as default or always add --project=YOUR_PROJECT to the gcloud command.

You will run into random permissions issues regardless, because Google Cloud is garbage.

Then you need to set up the proper env variables for the deployed function. The only one that’s required is the PUBLICATION_BUCKET variable that sets the destination bucket for the processed files. You do so as documented by writing the command:

`gcloud functions deploy triggerWrapper --set-env-vars PUBLICATION_BUCKET=ink-frontend-server-dev-read`

`triggerWrapper` is the name of the function, `ink-frontend-server-dev-read` is the name for the destination bucket. Replace those values with the ones relevant to your current deployment.

Assuming that didn’t blow up in your face, then next you need to deploy. First you need to run npm install, because we need a fresh package-lock.json file. Then you need to run `gcloud functions deploy triggerWrapper --runtime nodejs12 --trigger-resource TRIGGER_BUCKET --trigger-event google.storage.object.finalize --project PROJECT_NAME --timeout=300s --memory=2048MB`.

That last --memory bit is important because otherwise the function will terminate when trying to process extra big PDF files.
Then add that command to the package.json as a script so you don’t have to remember it the next time you deploy. In this case I saved it under npm run deploy-dev-function.

You should now have a file processing function set up for your Storage Bucket that processes all the files Ink supports and spews out web-ready conversions into the bucket you have set up to be the publication bucket.

Now whenever you need to update the function, you only need to run the npm script that you set up in step 6. In this case it’s npm run deploy-dev-function
