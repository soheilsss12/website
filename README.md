# L.I.S.A. — Locomotive Interactive Super Assistant

A responsive, single-page L.I.S.A. experience built with React, Vite, Three.js, and React Three Fiber. The interface and animated CRT character are recreated from the reference recording in this repository's `main` branch.

## Run locally

```bash
npm install
npm run dev
```

Build the production site with `npm run build`.

## GitHub Pages

GitHub Actions builds and deploys the site on pushes to `main` or `arena/4d1d0891-website`. The project-site base path is added automatically for the repository URL: <https://soheilsss12.github.io/website/>.

## Experience

- A full-screen introduction with conversational shortcuts and a timed project-intake sequence for a name, company, and job title.
- A custom 3D CRT character. The monitor screen is drawn procedurally and animates its glow, eyes, blink, scan effects, and brief signal glitches; head motion responds smoothly to the pointer.
- A lightweight chat-panel demo with local intent-based replies. It does not connect to an assistant API or submit intake data to a server.
- Optional browser speech synthesis for replies and respect for reduced-motion preferences.

## Stack

- React 19 and Vite
- Three.js and React Three Fiber
- GSAP for the initial interface reveal

All interactive behavior runs in the browser. No third-party 3D model or remote API is required at runtime.
