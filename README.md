# Jesse's Studio — a walkable engineering portfolio

A cozy little **three-room, walkable portfolio world**, styled like a late-night art studio and electronics workshop. Built with static HTML, CSS, JavaScript and Canvas for GitHub Pages. No build tools, framework, or backend are required.

## Explore the studio

- **Lobby / About Me** — visitor introduction, engineering experience, résumé shortcut, and doors to both rooms.
- **Workshop** — NFC business card, modular MCU cluster, and capstone controller as works in progress. Includes a simulated dancing Lissajous oscilloscope, function generator, dual-channel solder/hot-air rework equipment, and a hotplate.
- **Gallery** — finished STM32 LED business card, Team Fishies robot, and a placeholder revision-wall exhibit.
- **Nighttime atmosphere** — city windows, warm hanging lights, warm electronics screens, and a looping original instrumental lofi track (off by default).

Walk with **A / D** or **Left / Right**, change depth with **W / S** or **Up / Down**, press **E** or **Enter** to inspect when near, or click an exhibit directly. Walking uses eight distinct, distance-synchronized poses with grounded feet, arm swings, and a body bounce. Touch movement buttons and room shortcuts are included. A keyboard-independent project list lets visitors browse without using the game.

## Deploy to GitHub Pages

Create a repository named `YOUR_USERNAME.github.io`, put the contents of this folder at the repository root, and enable Pages for `main` / `/ (root)` under Settings → Pages. There is no build step.

## Personalization

- **`js/data/projects.js`**: Update titles, status, project details, technical tags, and GitHub links. Do not publish restricted or proprietary details.
- **`js/data/site.js`**: Set optional GitHub, LinkedIn, email, and resume links. The included one-page résumé is at `assets/docs/resume.pdf`, and the Resume button opens it. To update it, replace this file with another PDF using the same name.
- **`js/game/rooms.js`**: Change each room's exhibits, portals, project coordinates, and interactions.
- **`js/game/art.js`**: Entirely programmatic editable room artwork, lighting, furniture, instruments and player sprite. Room illustrations are intentionally original rather than copied from any game or third-party art pack.
- **`js/game/engine.js`**: Walking controls, camera, rendering, room transitions and interaction detection.
- **`css/site.css`**: Page typography, navigation, overlays, mobile controls.
- **`assets/audio/night-shift-lofi.wav`**: Original instrumental loop from the earlier prototype. Play is opt-in.

## Future revisions

Ideas: replace selected paintings with photographs of your actual boards, more idle character animations, seamless walk-in door transitions, individually clickable tool stations, a more elaborate Museum of Revisions, parallax weather, and custom sprite art. Retain the quick-access project list and résumé shortcut even as the game grows.

## A note on accuracy

Project summaries are intended as editable portfolio copy; review details before publishing. Nothing in the demo should be interpreted as an endorsement from your university or employer. The site intentionally has no contact form or tracking backend.

## Latest exhibit updates

- The workshop has a combined soldering-iron and hot-air station with two independent displays, distinct docks and a cleaning cup.
- The hotplate is a ceramic-topped PCB preheater, with a raised plate, temperature controller and warning markings.
- STM32 Business Card exhibit: two cropped photographs of the real Rev 1 card.
- NFC Business Card exhibit: front and back KiCad renders.
- Resume button opens the supplied one-page PDF at `assets/docs/resume.pdf`; the editable DOCX is intentionally not published.

Project image entries live under `photos` in `js/data/projects.js`. All imagery is stored locally; no third-party image requests are needed.

## V6 exhibition polish

- The modular MCU cluster is represented as a **conceptual hierarchy diagram** (supervisor → managers → worker cards), on the workbench and in its project dialog — no fabricated hardware imagery.
- Redundant floor-level labels beneath the gallery plinths were removed; wall-frame titles remain.
- The workshop now depicts a single dual-output hot-air + soldering iron rework station, both handpieces in their holders, and an identifiable ceramic PCB hotplate.

## V7 workshop layout

- Failed revisions and capacitor-debugging notes have their own **little rolling framed rework note beside the workbench** rather than a finished-project wall exhibit.
- The small card features three stylized series capacitors as a visual reference. This is an educational motif, not the actual schematic of a defective Rev 1 card.
- The gallery has two displays for completed work, without the duplicated labels beneath their pedestals.
- The modular MCU computer is shown as a supervisor/manager/worker architecture study, not a manufactured SODIMM-like module.
- The portfolio includes an accessible résumé PDF, cropped Rev 1 PCB photographs, and NFC KiCad front/back views.

### Résumé viewer

The top-bar Resume button and in-world résumé exhibit open the bundled one-page PDF inside a document-viewer dialog. It also includes Download PDF and Open in tab fallbacks. To update the résumé, replace `assets/docs/resume.pdf`.

### Additional Team Fishies photos

Three optional gallery photo slots are prepared in `js/data/projects.js` for `team-fishies-photo-1.webp`, `team-fishies-photo-2.webp`, and `team-fishies-photo-3.webp`. Their source images were not accessible in this editing session. Until these image files are placed in `assets/images/projects/`, the unavailable thumbnails are automatically removed. Replace the generic captions in the project data when the actual photo content is known.
