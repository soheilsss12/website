# Locomotive — Independent Digital Studio

A responsive studio website built with React, Vite, Three.js, and React Three Fiber. The root page introduces the studio across several sections; L.I.S.A., its interactive assistant experience, lives at `#lisa` so it works within the existing GitHub Pages project URL.

## Run locally

```bash
npm install
npm run dev
```

Build the production site with `npm run build`.

## GitHub Pages

GitHub Pages is configured for the `arena/4d1d0891-website` branch at the repository root. On each push, GitHub Actions builds the Vite app, publishes the static files for branch-based Pages, and deploys the build. The project-site base path is set automatically for <https://soheilsss12.github.io/website/>.

## Experience

- A multi-section studio homepage with an animated hero, About and Pathways sections, a contact footer, navigation menu, and cookie controls.
- The separate `#lisa` experience includes conversational shortcuts and a timed project-intake sequence for a name, company, and job title.
- A custom 3D CRT character. The monitor screen is drawn procedurally and animates its glow, eyes, blink, scan effects, and brief signal glitches; head motion responds smoothly to the pointer. On the homepage, L.I.S.A.'s eyes remain awake and blink while idle.
- A lightweight chat-panel demo with local intent-based replies. It does not connect to an assistant API or submit intake data to a server.
- Optional browser speech synthesis for replies and respect for reduced-motion preferences.

## Stack

- React 19 and Vite
- Three.js and React Three Fiber
- GSAP for the initial interface reveal

All interactive behavior runs in the browser. No third-party 3D model or remote API is required at runtime.
