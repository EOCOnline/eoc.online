# Release Notes

## 1.1.0 - 2026-05-01

### What changed

- Upgraded and stabilized the Hugo build pipeline for modern Hugo behavior (v0.154.x), including compatibility fixes for deprecated template/front matter patterns.
- Fixed multiple build blockers found during migration work:
  - Deprecated permalink token updated to `:slugorcontentbasename`.
  - ArcTree assets moved from layouts to static to avoid template parsing errors in JavaScript files.
  - Invalid/duplicate content front matter values corrected.
  - Deprecated `_build` content key migrated to `build`.
- Added local template overrides for SEO/internal templates to keep metadata rendering compatible with current Hugo behavior.
- Migrated repository remote target from `EOCOnline/eoconline.github.io` to `EOCOnline/eoc.online`.
- Implemented Cloudflare Pages standard CI build-check workflow in GitHub Actions (`.github/workflows/cloudflare-pages-deploy.yml`).
- Updated CI runtime to Node 24 and aligned package manager metadata to pnpm.
- Regenerated and wired a comprehensive favicon/manifest/browser compatibility icon set.

### Operational notes

- Cloudflare Pages should use:
  - Build command: `pnpm run build`
  - Output directory: `public`
  - Environment variable: `NODE_VERSION=24`

### Why this is a minor bump

This release contains significant operational and deployment changes (build/runtime compatibility, repository migration, and CI/CD strategy updates), beyond a simple bugfix patch.
