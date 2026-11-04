# Temple Siamsi V04.4 — Responsive 3D Camera

This package is based on the existing V04.3.1 pond-fixed scene.

## Updates
- Start position (x=0, y=1.72, z=27) and heading are identical on desktop and phone.
- Perspective vertical field of view adapts to viewport aspect ratio (60°–83° range). This improves scene composition but does not guarantee identical crops across aspect ratios.
- **↺ มองวิหาร** button and **R** key reset position, heading and movement.
- Walking, collision, pond, GLB and ShakeRitual stay unchanged.

## Run
```bash
npm install
npm run dev
```

Test on desktop and iPhone from a fresh session. Both should face the main temple at the same world location. The iPhone will still show less horizontal scenery because its viewport is narrower.
