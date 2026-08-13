# Canby Community Clinic V4.3 Changelog

## Entrance experience
- Rebuilt the opening screen as a medical-monitor experience with the clinic logo, address, phone number, weekday hours, pulsing heart, and three clear paths.
- The illuminated EKG segment now travels continuously from left to right and restarts at the left edge. It does not reverse direction.
- Added English, Spanish, and Armenian language visibility to the entrance.
- Added reduced-motion behavior for visitors who request less animation.

## Mobile experience
- Added an app-style fixed bottom navigation for Home, Appointments, Portal, Resources, and More.
- Added a compact clinic strip for Call, Directions, and Hours.
- Added iPhone safe-area spacing so controls are not hidden behind the home indicator or notch.
- Enlarged interactive controls and form fields for touch use.
- Reorganized hero buttons, cards, page headers, forms, portal screens, and volunteer questionnaires for narrow screens.
- Added standalone web-app metadata and updated the V4.3 manifest icons.

## Journal
- Made all journal cards clickable, including keyboard support; visitors no longer have to click only the blue text link.
- Preserved eight distinct long-form article subjects.
- Kept article-cover images isolated from ordinary clinic pages.
- Preserved individual titles, descriptions, canonical links, structured data, source sections, and internal links.

## Volunteer applications
- Added separate Medical Professional and Community/Non-Medical Volunteer paths.
- Added role-specific questionnaires in English, Spanish, and Armenian.
- Applications create a pre-addressed email containing the submitted answers and contact details.
- Added a configurable `volunteerFormEndpoint` field for future automatic backend delivery.

## Languages
- Expanded the Spanish core experience with full page sections rather than sparse placeholder pages.
- Added an Armenian core experience covering Home, About, Services, Appointments, Resources, Journal, Volunteer, Donate, Contact, Portal, New Patient, and Patient Dashboard.
- Added a consistent three-language selector throughout the public website.

## Quality and maintenance
- Migrated all active website assets to the versioned `v43/` directory.
- Updated the web-app manifest to use V4.3 icons.
- Removed stale V4/V4.2 upload documents.
- Rechecked local links, images, metadata, JSON-LD, CSS, and JavaScript.
