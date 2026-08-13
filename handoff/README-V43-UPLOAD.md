# Upload Canby Clinic V4.3 to GitHub

This version is split into two packages because GitHub's browser uploader accepts a maximum of 100 files at a time in your workflow.

## Upload order

### Part 1 — Core Website (81 files)
1. Download and unzip `canby-v43-part-1-core.zip`.
2. Open the unzipped folder.
3. Select everything inside the folder. Do not upload the ZIP itself.
4. In the `CanbyCLinic` GitHub repository, click **Add file → Upload files**.
5. Drag the selected contents into GitHub.
6. Confirm that `index.html`, `volunteer.html`, `hy.html`, `v43/css/styles-v43.css`, and `v43/js/site-v43.js` appear in the upload list.
7. Commit directly to the `main` branch.

### Part 2 — Remaining Images (67 files)
1. Download and unzip `canby-v43-part-2-images.zip`.
2. Open the unzipped folder.
3. Select the `v43` folder inside it and drag it into GitHub's upload screen.
4. Confirm the paths begin with `v43/images/`.
5. Commit directly to the `main` branch.

GitHub will merge Part 2 into the existing `v43` directory.

## Test after deployment
Wait for the Pages deployment to show a green check, then open:

`https://canbyclinic.github.io/CanbyCLinic/index.html?v=4301&entry=1`

The `entry=1` parameter forces the heartbeat entrance to display during testing.

Hard refresh on Mac:

`Command + Shift + R`

Test these pages:
- `index.html?entry=1`
- `health-articles.html`
- `volunteer.html`
- `es.html?entry=1`
- `hy.html?entry=1`
- `patient-portal.html`
- `new-patient.html`

## Important deployment notes
- Upload **Part 1 first**, then **Part 2**.
- Do not place either package inside another repository folder.
- `index.html` must remain at the repository root.
- Do not delete `v43/css` or `v43/js` when uploading the image package.
- Older `v41` and `v42` folders may remain temporarily, but V4.3 does not use them.
- The volunteer form currently opens a completed email draft. Automatic delivery requires the future endpoint in `v43/js/config-v43.js`.
- The portal is a visual front-end demonstration. Do not enter real medical information until the secure backend is connected.
