# Contributing / Team Workflow

## Branches

Use short branches:

- `feature/cloudinary-upload`
- `feature/discover-search`
- `fix/mobile-layout`

## Commit format

Use action-based commits:

- `feat: add Cloudinary project upload`
- `fix: repair proof page media rendering`
- `docs: update hackathon setup`

## Before opening a PR

```bash
npm run build
```

Check that `.env.local` is not staged and that the README still explains the current Cloudinary workflow.

## Demo hygiene

Keep at least one seeded project in the UI so judges can understand the product before uploading. Never commit actual private media or API secrets.
