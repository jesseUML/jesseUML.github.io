# Jesse's Studio

A walkable engineering portfolio built for GitHub Pages with static HTML, CSS, JavaScript, and Canvas. It presents Jesse Silva's electronics and embedded-systems work as a three-room, late-night studio.

## Visit the studio

- **Lobby:** About Jesse, engineering experience, and résumé
- **Workshop:** Works in progress, prototypes, and rework lessons
- **Gallery:** Finished hardware projects

Walk with **A/D** or **Left/Right**, change depth with **W/S** or **Up/Down**, and press **E** or **Enter** to inspect an exhibit. Visitors can also click exhibits, use the room buttons, or open the project list without playing.

## Run locally

No dependencies or build step are required. Because the site uses JavaScript modules, serve the repository through a small local HTTP server instead of opening `index.html` directly:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

Keep the site files at the root of the `jesseUML.github.io` repository. Under **Settings → Pages**, publish from the `main` branch and `/ (root)` directory. GitHub Pages serves the site without a build command.

## Update portfolio content

- `js/data/projects.js` contains project titles, status, descriptions, tags, photos, and source links.
- `js/data/site.js` contains public profile, contact, and résumé links.
- `assets/images/projects/` contains project photos and renders.
- `assets/docs/resume.pdf` is the résumé opened by the site.
- `js/game/rooms.js` defines room exhibits, portals, and interaction positions.
- `js/game/art.js` draws the room artwork and character.
- `css/site.css` controls the page, dialog, and responsive styles.

Keep project claims accurate and avoid publishing restricted, proprietary, or personal information.

## Project structure

```text
assets/
  audio/       Optional lofi loop
  docs/        Résumé PDF
  images/      Project photos and renders
css/           Site styles
js/
  data/        Portfolio content and public links
  game/        Canvas renderer, rooms, collision, and controls
  ui/          Project art and dialogs
index.html     Page structure
```

## Accessibility and fallbacks

The site includes keyboard controls, touch controls, visible focus states, reduced-motion support, project-list navigation, and an embedded résumé with download and new-tab fallbacks. The lofi track remains off until the visitor enables it.
