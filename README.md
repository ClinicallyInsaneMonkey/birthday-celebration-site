# A romantic birthday clue-game app

This project is a small, customizable birthday website builder for a love story / relationship clue hunt.

## Features
- Creator dashboard to build your own story and clue pages
- Add, reorder, edit, or delete clue pages
- Live preview panel while editing
- Shareable viewer-only page for the birthday person
- Pink/blue romantic theme with playful game-like flow
- Works as a static frontend app; no backend required

## How to use
1. Open `index.html` in a browser.
2. Fill in:
   - occasion title
   - landing message
   - each clue page with a hint, hidden message, and answer
3. Click "Generate Share Link" to copy a viewer link.
4. Open the link in a browser and send it to your partner.

## File structure
- `index.html` – creator interface
- `styles.css` – full visual styling
- `script.js` – creator logic and live preview
- `viewer.html` – viewer-only page
- `viewer.js` – viewer logic for clue flow

## Notes
- The story is stored in browser localStorage while using the creator tool.
- The viewer link includes the story data in the URL hash, so it can be shared as a static link.
- If you want to publish it online, deploy the repo to GitHub Pages or any static host.

## Example share link format
- `https://yourusername.github.io/birthday-celebration-site/viewer.html#story=...`

## Example customizations
- Add your own photos later by editing the HTML/CSS and adding image blocks.
- Add more pages for a longer clue hunt.
- Change the message, colors, and theme styles in `styles.css`.
