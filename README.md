# Hailey Martinez — Portfolio

A lightweight, responsive, Barbie-inspired single-page portfolio for **Hailey Martinez**. Built with native HTML, CSS and JavaScript, using the pink reference imagery supplied with this project.

## How to view

Open `index.html` in your browser. No npm installation or build process is required.

For local development, you can optionally run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Website sections

- Hero and introduction
- Contact cards (email, GitHub, Facebook, and future profiles)
- About, hobbies and education
- Work experience at Tech Mahindra
- Projects placeholder, intentionally awaiting real projects
- Technologies currently being explored
- Contact call to action

## Functionality

- Mobile navigation and active section highlights
- Day/night pink-plum theme switcher, saved locally when allowed
- Accessible section search (search button or `Ctrl/Cmd + K`)
- Scroll reveal that respects reduced-motion preferences
- Keyboard-accessible links, buttons, and search dialog
- Floating pink music player playing `assets/Aqua - Barbie Girl.mp3`, with autoplay attempt, continuous looping, play/pause, timeline seeking, volume, mute and minimize controls

### Background music behavior

The player **attempts to autoplay with sound** when visitors open the website and repeats the song automatically. Most current browsers block unmuted autoplay on first visit; in that case the player visibly prompts for interaction and starts when the visitor clicks Play or interacts with the page. This is a browser-level restriction rather than a site bug. Audio controls always remain available.

**Before public GitHub Pages publishing:** The provided Aqua song is commercially copyrighted. Include the MP3 in a publicly accessible repository/site only if you have the rights or permission to distribute it; otherwise replace it with music you own or have licensed. The site intentionally uses the local MP3 rather than streaming from a third-party service.

## Customizing content

Edit `index.html` to change the biography, experience, education, skills or external links. Update `styles.css` for visual design and `script.js` for interactions. The website's optimized images and technology icons are in `assets/`. The original supplied PNG artwork and development previews/tests have been archived **outside** the publishable website directory in a sibling folder named `HaileyPortfolio-archive-2026-10-13` (keep this archive private and out of Git).

The portfolio uses locally optimized versions of the supplied Hailey portrait (`assets/hailey-portrait.webp` and `assets/hailey-portrait-small.webp`) in the hero and About Me sections. The original full-resolution photo is preserved in the archive. LinkedIn and resume are marked *Coming soon*, and Twitter/X is *Not available*, because no working links were provided. The Projects section does not invent projects.

External Google Fonts enhance the design when available; common system fonts are used as fallbacks. Other than fonts and optional outbound social links, the portfolio itself uses local files, including the music.

## Technology icons

The seven colorful technology logos in the Tech Stack section are downloaded SVG assets from [Devicon](https://github.com/devicons/devicon), stored locally in `assets/logos/`. They load without requiring an external icon CDN. Devicon's license text is included at `assets/logos/LICENSE-DEVICON.txt`. Individual technology names and logos remain trademarks of their respective owners.

## Publish with GitHub Pages

Publish the **contents of this folder** at the repository root, with `index.html` at the top level. In GitHub's repository settings, under **Pages**, choose **Deploy from a branch**, your chosen branch (usually `main`), and `/ (root)`. There is no build step. Keep the sibling archive **outside the repository**, and do not add personal backups, full-size photos, or generated screenshots to Git.
