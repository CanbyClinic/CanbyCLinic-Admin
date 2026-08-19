# Launch checklist — V2

1. **Production:** serve the project through HTTPS.
2. **Local preview:** direct `file://` opening is now supported for the homepage ambulance, but `START-SITE.command` / `npm run dev` remains the recommended full-site preview because it most closely matches production URL behavior.
3. Preview English, Spanish, and Armenian homepages on desktop and phone.
4. Confirm the 3D ambulance loads and scrolls forward/backward on current Chrome and Safari.
5. Confirm the local rendered ambulance fallback appears if WebGL is disabled.
6. Enter approved production URLs in `assets/js/config.js` for portal, intake, callback/contact, volunteer, and donation services.
7. Verify those vendors and workflows against the clinic's privacy/security requirements before accepting sensitive information.
8. Confirm address, phone, hours, service availability language, privacy documents, and legal entity naming with clinic leadership.
9. Review final editorial photography and obtain any needed internal approval before public launch; do not imply depicted people are Canby patients, staff, or endorsers.
10. Run a final accessibility/performance scan on the deployed HTTPS origin because CDN headers, CSP, caching, and third-party integrations affect production results.

## Local preview

### Direct
Open `index.html` in Chrome.

### Recommended
```bash
npm run dev
```
Open `http://127.0.0.1:4173/`.
