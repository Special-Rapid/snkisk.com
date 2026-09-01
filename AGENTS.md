# Project instructions

## Local documentation workflow

- `docs/` is local-only and must never be staged, committed, or published.
- Resume sustained work in this order: `docs/dashboard/NOW.md` → the relevant feature `SPEC.md`/`STATE.md` → task `GOAL.md`/`CHECKLIST.md` → code and verification.
- Keep exactly one dashboard state transition at a time: `OTHER` → `PLAN` → `NOW` → `DONE`. Update `NOW.md` in the same turn for follow-ups, phase changes, and verification outcomes; refresh it before each ten-minute uninterrupted-work boundary.
- Context and conversation summaries are never a source of truth. Record explicit Plan/Do/Check/Act evidence in the task checklist.
- Feature records use `REQUEST.md`, `SPEC.md`, `STATE.md`, and optionally `DECISIONS.md`. Tasks use `GOAL.md`, `CHECKLIST.md`, and optional implementation, investigation, run, summary, transcript, and context evidence.
- At sustained-task start, resume, and follow-up, check Goal Mode. If unavailable, record that fallback in the task goal. If a follow-up changes the effective objective, amend `GOAL.md`, update `NOW.md`, and revalidate the implementation plan.

## UI work

- Before any visible UI, navigation, interaction, or copy change, read the five records under `docs/ui/` and run the global `ui-harness` skill.
- Use semantic design tokens. Support persisted System/Light/Dark theme selection and Japanese/English localization with system defaults, saved manual selections, and the recorded fallback behavior. Verify the documented state matrix before delivery.

## Delivery

- Record security relevance triage and required verification in the task checklist. Before a feature commit, obtain fresh instruction-compliance and implementation-quality reviews; add project-rule and security reviews when their recorded applicability requires them.
- Stage only intended files. Recheck status, full diff, and staged diff before commit; keep `docs/` local-only.
