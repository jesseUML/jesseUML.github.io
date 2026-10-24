# Jesse's Studio — a walkable engineering portfolio

A cozy little **three-room, walkable portfolio world**, styled like a late-night art studio and electronics workshop. Built with static HTML, CSS, JavaScript and Canvas for GitHub Pages. No build tools, framework, or backend are required.

## Explore the studio

- **Lobby / About Me** — visitor introduction, engineering experience, résumé shortcut, and doors to both rooms.
- **Workshop** — NFC business card, modular MCU cluster, and capstone controller as works in progress. Includes a simulated dancing Lissajous oscilloscope, function generator, dual-channel solder/hot-air rework equipment, and a hotplate.
- **Gallery** — finished STM32 LED business card, Team Fishies robot, and a placeholder revision-wall exhibit.
- **Nighttime atmosphere** — city windows, warm hanging lights, warm electronics screens, and a looping original instrumental lofi track (off by default).

Walk with **A / D** or **Left / Right**, change depth with **W / S** or **Up / Down**, press **E** or **Enter** to inspect when near, or click an exhibit directly. Touch movement buttons and room shortcuts are included. A keyboard-independent project list lets visitors browse without using the game.

## Deploy to GitHub Pages

Create a repository named `YOUR_USERNAME.github.io`, put the contents of this folder at the repository root, and enable Pages for `main` / `/ (root)` under Settings → Pages. There is no build step.

## Personalization

- **`js/data/projects.js`**: Update titles, status, project details, technical tags, and GitHub links. Do not publish restricted or proprietary details.
- **`js/data/site.js`**: Set optional GitHub, LinkedIn, email, and resume links. Add a résumé PDF at `assets/docs/resume.pdf` and set `resume: './assets/docs/resume.pdf'`. The resume button has a friendly placeholder until you do.
- **`js/game/rooms.js`**: Change each room's exhibits, portals, project coordinates, and interactions.
- **`js/game/art.js`**: Entirely programmatic editable room artwork, lighting, furniture, instruments and player sprite. Room illustrations are intentionally original rather than copied from any game or third-party art pack.
- **`js/game/engine.js`**: Walking controls, camera, rendering, room transitions and interaction detection.
- **`css/site.css`**: Page typography, navigation, overlays, mobile controls.
- **`assets/audio/night-shift-lofi.wav`**: Original instrumental loop from the earlier prototype. Play is opt-in.

## Future revisions

Ideas: replace selected paintings with photographs of your actual boards, more idle character animations, seamless walk-in door transitions, individually clickable tool stations, a more elaborate Museum of Revisions, parallax weather, and custom sprite art. Retain the quick-access project list and résumé shortcut even as the game grows.

## A note on accuracy

Project summaries are intended as editable portfolio copy; review details before publishing. Nothing in the demo should be interpreted as an endorsement from your university or employer. The site intentionally has no contact form or tracking backend.
