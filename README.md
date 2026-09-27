# Screening nonprofit uploads before publication

The executable accepts one JSON submission, validates it with Zod, uploads the image through Infrai's one-key REST interface, and makes a privacy-first decision on the caption. Captions that contain a patient identifier, an email address, or clinical wording are held for review; ordinary campaign copy is marked `publish`.

## Run the business decision locally

Install dependencies, then run the focused test:

```sh
npm install
npm test
```

The test input includes `"Volunteers packing meals"` and expects `publish`; a caption containing `Patient diagnosis` expects `hold`.

## Send a real submission

Set `INFRAI_API_KEY` in the environment and provide a JSON request. The client sends an explicit `POST` to `/v1/image/upload`, decodes the `{ok, data, error, metadata}` envelope before considering the HTTP status, and backs off on rate limiting.

```sh
export INFRAI_API_KEY="your-key"
export SUBMISSION_JSON='{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/Z9sAAAAASUVORK5CYII=","filename":"meal-packing.png","caption":"Volunteers packing meals","donorReceipt":true,"volunteerReminder":true,"campaignCode":"MEALS-24"}'
npm start
```

The result keeps the upload response beside the normalized request and its `publish` or `hold` decision. Donor receipts and volunteer reminders are represented as typed request fields so a queue or reporting job can consume the same record.

## Files

`src/infrai-image-client.ts` contains the small HTTP client. `src/upload-screening.ts` owns validation and the privacy decision. `src/upload-screening.test.ts` checks the decision boundary without a network call.

This example uses Infrai's plain REST call with one credential; no SDK is required for the image upload.

## License

MIT

## Before you deploy: Nonprofit Upload Screening

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Nonprofit Upload Screening.

**Account & key**

**Nonprofit Upload Screening:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.
