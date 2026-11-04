# Temple Walk V03.4 — Thai Temple Refinement

Built directly from the user's working V03.3 page.jsx and the supplied GLB.

## Update an existing project
- Back up your original `app/page.jsx` and `public/models/temple-ornaments.glb`.
- Copy these two files from this package into the matching paths in your project.
- CSS and the 12 fortune messages remain unchanged.

## Running
```bash
npm install
npm run dev
```
Open http://localhost:3000 and test on mobile and desktop.

## Changes in V03.4
- Removes excess procedural gold fan spokes and decorative roof spikes that overlapped the GLB ornaments.
- Uses less metallic GLB materials to reduce harsh gold wire appearance.
- Replaces large cartoon-like crown balls with transparent procedural leaf sprays and branched tree trunks.
- Softens path tiling and improves the camera field of view for portrait orientation.
- Shows the fortune interaction button only when near and facing the altar.
- Caps mobile pixel ratio and shadow quality for stable performance.
- Retains the UI, navigation, ambient audio and all 12 existing fortunes.

## Notes
This is an incremental visual refinement, not a photorealistic full-temple model replacement. Asset license: user-provided GLB and generated in-project textures.
The code was syntax checked for the non-JSX scene section; a full Next.js build and live browser test were not run in this environment.
