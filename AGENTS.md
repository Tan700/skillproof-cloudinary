# AI contribution guide for SkillProof

SkillProof is a hackathon MVP for a media-first proof-of-work portfolio.

## Non-negotiables

1. Cloudinary must remain a real product dependency. Do not replace uploads or media delivery with local file storage.
2. Never commit `.env.local`, API secrets, Cloudinary API secrets, Supabase service-role keys, or private credentials.
3. Keep the demo flow under three minutes: create project → upload media → show transformed media → discover/search.
4. Prefer small, reviewable changes. Update README/demo docs when behavior changes.
5. Keep the seeded demo project so a fresh deployment is understandable without setup data.

## Product principles

- Media is evidence, not decoration.
- Student experience first; recruiter discovery is the secondary surface.
- Prototype quickly, keep production architecture obvious.
- Any new Cloudinary feature should have a visible user-facing reason.

## Suggested AI coding task format

When using Cursor/Copilot/Claude Code/etc., start with:

"Read AGENTS.md and README.md. Make the smallest change that advances the SkillProof demo. Do not change the Cloudinary workflow or expose secrets. Explain files changed and the test command."
