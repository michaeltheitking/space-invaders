# Current state

## Evidence boundary

Documentation baseline: 2026-09-05. Source: local file layout, project instructions, and README.
This records repository context, not a new live-system verification.

## Purpose and maintained sources

Maintain the React and Vite Space Invaders game.
See [the overview](../README.md), [project instructions](../AGENTS.md), and [the document index](README.md).
Accepted [decisions](decisions/README.md) govern architecture. Existing detailed references retain their evidence dates.

## Runtime and data boundary

Use the README and package.json for npm run dev, npm run build, and npm run preview. Preserve existing uncommitted game changes.
Keep credentials, private source records, live databases, and generated state outside shared context.
Use separate development checkouts. Do not install production schedules merely because a checkout exists.

## Known gaps and next work

- Native Omarchy behavior and the other Macs were not verified during this documentation baseline.
- Check current code, relevant issues, and live evidence before reusing historical claims.
- Record active task details in the existing issue or a [handoff](handoffs/README.md).
- Update this file when verified operating facts change; cite the check and its date.
