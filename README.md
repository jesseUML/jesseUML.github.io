# Jesse's Studio

A walkable engineering portfolio built for GitHub Pages with static HTML, CSS, JavaScript, and Canvas. It presents Jesse Silva's electronics and embedded-systems work as a three-room, late-night studio.

## Visit the studio

The page opens on a title screen: Jesse's name on an animated LED-matrix board, a rotating splash line, and a menu for the studio, projects, about, résumé, and contact. Below the studio, featured project cards give recruiters a fast path. Opening an exhibit for the first time shows an "Exhibit discovered" toast.

- **Lobby:** About Jesse and the résumé
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

- `js/data/projects.js` contains project titles, status, descriptions, tags, photos, and source links. Projects with a `featured` entry (cover image and one-line highlight) also appear as cards below the studio.
- `js/main.js` holds the yellow splash lines on the title screen (`SPLASHES`). Visitors can click the splash to cycle it.
- `js/ui/led-title.js` draws the LED-matrix name. Add glyphs to `GLYPHS` if you change the text.
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

## Adding a new project

1. Put the images in `assets/images/projects/` (WebP, about 1600px wide at most).
2. In `js/data/projects.js`, copy an existing entry and change the fields. The comment at the top of that file explains each field.
3. If it's `'completed'`, you're done: it gets the next frame in the gallery.
4. If it's `'wip'`, also give it a bench spot in `BENCH_SLOTS` in `js/game/rooms.js`. The main bench is fairly full, so you may need to widen the workshop (`ROOM_W.workshop`) and shift props in `drawWorkshop()` in `js/game/art.js`.

Each file in `js/` starts with a header comment describing what it does and how it connects to the others.

## Moving a project from WIP to completed

Each project's `status` in `js/data/projects.js` decides which room it appears in:

- `status: 'wip'` puts it on its workbench spot in the workshop.
- `status: 'completed'` hangs it in the gallery on its own pedestal. Gallery frames follow the order in `projects.js`, and the room widens to fit.

To finish a project:

1. Change `status` to `'completed'`.
2. Point `displaySrc` at your best photo. That's the one shown in the gallery frame.
3. Update `code` (the dialog label, for example `'EXHIBIT 03 / REV 1'`). Optionally set `wallTitle`, the short name on the frame.

The project's old bench spot then shows a "Finished! Now in the gallery" note. The project list and featured cards update their status labels automatically. A brand-new WIP project also needs a bench spot in `BENCH_SLOTS` in `js/game/rooms.js`.

### Capstone placeholder photos

The capstone uses three placeholder images: `assets/images/projects/capstone-photo-1.webp` through `-3.webp`. Replace the files with real photos (16:10 landscape fits the frames best), or change the paths and captions in the capstone entry in `projects.js`. The first photo is the one shown on the bench and in the gallery.

## Image credits

The two circuit photos on the lobby's gallery sign (`assets/images/decor/`) are decorative stock images, not Jesse's projects. Both are CC0 (public domain) from Wikimedia Commons:

- [Macro photograph of the RP2350 microcontroller on a Raspberry Pi Pico 2 board](https://commons.wikimedia.org/wiki/File:Macro_photograph_of_the_RP2350_microcontroller_on_a_Raspberry_Pi_Pico_2_board.jpg) by Profpcde
- [Fritz!Box SL 2012-10-28-0853](https://commons.wikimedia.org/wiki/File:Fritz!Box_SL_2012-10-28-0853.jpg) by Slick

All other project photos and renders are Jesse's own.

## Accessibility and fallbacks

The site includes keyboard controls, touch controls, visible focus states, reduced-motion support, project-list navigation, and an embedded résumé with download and new-tab fallbacks. The lofi track remains off until the visitor enables it.
