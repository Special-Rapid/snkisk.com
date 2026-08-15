# Goal

Create and render a standalone Remotion video that replaces the current gentle UI-transition impression with camera-driven, cinematic 3D cuts.

## Scope

- Keep the Remotion project, source, assets, and rendered deliverables under `video/`.
- Base the visual language on the existing portfolio’s five project identities.
- Render an H.264 MP4 and inspect representative stills.

## Constraints

- Do not modify the existing website source or unrelated working-tree changes.
- Use frame-driven Remotion animation; do not rely on CSS keyframe animation.

## Success criteria

- `video/` is self-contained and runnable with documented npm commands.
- The rendered video visibly uses whole-frame camera movement and layered depth rather than floating UI.
- Typecheck/lint-equivalent checks, representative still renders, and final MP4 rendering pass.

## Stop conditions

- A required renderer dependency cannot be installed or executed in the local environment.
