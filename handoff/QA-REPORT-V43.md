# Canby Community Clinic V4.3 QA Report

## Build inventory
- Public HTML pages: **59**
- English pages: **35**
- Spanish pages: **12**
- Armenian pages: **12**
- Image assets: **75**
- Main long-form journal articles: **8**
- Clickable journal tiles found: **19 of 19 configured correctly**

## Automated checks
- Missing local page links: **0**
- Missing local image/script/style assets: **0**
- Invalid JSON-LD blocks: **0**
- Duplicate page titles: **0**
- Duplicate meta descriptions: **0**
- Pages without an H1: **0**
- Images without alt text: **0**
- CSS parser errors: **0**
- JavaScript syntax errors: **0**
- Article-cover images reused on ordinary clinic pages: **0**
- Web-app manifest still pointing to an old asset version: **No**

## Journal article word counts
- Reseda health-access barriers: **1,854 words**
- Preventive care before symptoms: **1,746 words**
- Blood pressure interpretation: **1,764 words**
- Prediabetes intervention window: **1,748 words**
- Medication-list safety: **1,750 words**
- Language access and clinical safety: **1,755 words**
- Primary care as local infrastructure: **1,699 words**
- 2025 community-health research review: **1,799 words**

## Mobile-specific checks
- Viewport metadata is present throughout the site.
- Navigation collapses into a touch-friendly app-style bottom bar.
- Main touch controls are at least 48 CSS pixels high in the mobile rules.
- Bottom navigation and portal controls account for device safe-area insets.
- Page grids collapse cleanly to one or two columns depending on width.
- Forms use full-width fields on narrow screens.
- Entry cards become stacked, compact mobile actions.
- Reduced-motion rules stop decorative entrance animation when requested.

## Functional behavior
- EKG animation uses a one-way linear loop and does not alternate backward.
- Entire journal cards open their associated article and support Enter/Space keyboard activation.
- Volunteer path selectors reveal the correct role questionnaire.
- Volunteer submissions preserve a browser-session draft and open a pre-addressed clinic email containing the answers.
- Patient portal, patient dashboard, notes, prescriptions, results, and intake remain a front-end demonstration until a protected backend is connected.

## Manual items still required before production use
1. Connect approved patient authentication, records, intake, and secure messaging services.
2. Replace the volunteer email fallback with the configured backend endpoint when available.
3. Connect the verified donation checkout URL.
4. Confirm all clinical services, insurance statements, provider names, metrics, and legal notices with clinic leadership and counsel.
5. Test on physical iPhone and Android devices after the custom domain is connected.
