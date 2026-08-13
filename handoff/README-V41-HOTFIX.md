# Canby Clinic V4.1 Emergency Hotfix

This build fixes the mixed-deployment problem where V4 HTML loaded with an older stylesheet and missing images.

## Upload Part 1 first
Upload every item inside `V41-PART-1-CORE` to the ROOT of the GitHub repository. This includes the new `v41` folder containing CSS, JavaScript, the logo, favicon, and homepage images. Commit the upload.

## Upload Part 2 second
Upload the `v41` folder from `V41-PART-2-IMAGES` to the ROOT of the same repository. GitHub will merge `v41/images` with the folder created by Part 1. Commit the upload.

Do not upload the ZIP files themselves. Do not place either folder inside `assets`, `CanbyCLinic`, or another folder.

After both commits finish deploying, open:
`https://canbyclinic.github.io/CanbyCLinic/index.html?v=4102`

Then press Command + Shift + R.
