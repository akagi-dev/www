# GitHub Pages PR Preview System - Implementation Summary

## Overview
This implementation provides a complete GitHub Pages-based PR preview system for the Akagi Engineering website. Each pull request automatically gets its own live preview deployment that can be accessed directly via browser without downloading artifacts.

## What Was Implemented

### 1. Environment-Aware Astro Configuration
**File:** `astro.config.mjs`

The Astro configuration now dynamically adjusts the base path based on the build environment:
- **Production builds**: Use `/www` as the base path
- **PR preview builds**: Use `/www/pr-{number}` as the base path

This is achieved by detecting the `GITHUB_REF` environment variable:
```javascript
const isPRPreview = process.env.GITHUB_REF?.includes('preview/pr-');
const prNumber = isPRPreview ? process.env.GITHUB_REF?.match(/pr-(\d+)/)?.[1] : null;
```

### 2. Dynamic Navigation and Links
**Files:** `src/layouts/Layout.astro`, `src/pages/index.astro`

All internal navigation links and the root redirect now use the dynamic base path from Astro's configuration:
- Added `buildPath()` helper function to properly construct paths
- Updated all navigation links to use dynamic base path
- Updated favicon reference to use dynamic base path
- Updated root redirect to use dynamic base path

This ensures that all links work correctly in both production and PR preview environments.

### 3. PR Preview Deploy Workflow
**File:** `.github/workflows/pr-preview-deploy.yml`

This workflow:
1. Triggers on PR open, synchronize, and reopen events
2. Builds the site with PR-specific configuration (`GITHUB_REF=preview/pr-{number}`)
3. Creates/updates an orphan branch named `preview/pr-{number}`
4. Deploys the built files to the orphan branch
5. Posts/updates a PR comment with preview links

**Key Features:**
- Uses orphan branches to keep preview deployments isolated
- Force pushes to ensure clean deployments
- Posts formatted comments with direct preview links for all languages
- Updates existing comments instead of creating new ones

**Required Permissions:**
- `contents: write` - To create and push to orphan branches
- `pull-requests: write` - To post/update comments
- `pages: write` - To deploy to GitHub Pages

### 4. PR Preview Cleanup Workflow
**File:** `.github/workflows/pr-preview-cleanup.yml`

This workflow:
1. Triggers when a PR is closed (including merged PRs)
2. Deletes the orphan preview branch
3. Updates the original PR comment to indicate cleanup

**Key Features:**
- Automatic cleanup prevents orphan branch accumulation
- Gracefully handles cases where branch doesn't exist
- Indicates whether PR was merged or closed in the update message

**Required Permissions:**
- `contents: write` - To delete orphan branches
- `pull-requests: write` - To update comments

### 5. Documentation Updates
**Files:** `README.md`, `.github/workflows/README.md`

Updated documentation to:
- Explain the new GitHub Pages-based preview system
- Provide preview URL format examples
- Document workflow configuration and troubleshooting
- Include security considerations

### 6. Removed Old Workflow
**File:** `.github/workflows/pr-preview.yml` (deleted)

Removed the old artifact-based preview workflow as it's been replaced with the live GitHub Pages deployment system.

## Preview URL Structure

Each PR gets the following preview URLs:

- **Home:** `https://akagi-dev.github.io/www/pr-{number}/`
- **English:** `https://akagi-dev.github.io/www/pr-{number}/en/`
- **Japanese:** `https://akagi-dev.github.io/www/pr-{number}/ja/`
- **Russian:** `https://akagi-dev.github.io/www/pr-{number}/ru/`

## How It Works

### Deployment Flow
```
PR Opened/Updated
    ↓
Build with GITHUB_REF=preview/pr-{number}
    ↓
Astro detects PR preview mode
    ↓
Sets base path to /www/pr-{number}
    ↓
Creates orphan branch preview/pr-{number}
    ↓
Pushes built files to branch
    ↓
GitHub Pages serves from branch
    ↓
Post/Update PR comment with links
```

### Cleanup Flow
```
PR Closed/Merged
    ↓
Delete preview/pr-{number} branch
    ↓
Update PR comment with cleanup status
```

## Benefits

✅ **No Downloads Required** - Test previews directly in browser  
✅ **Mobile-Friendly** - Share preview links for mobile device testing  
✅ **Multi-Language Support** - Preview all language versions  
✅ **Automatic Updates** - New commits trigger updated deployments  
✅ **Clean Comments** - Updates existing comment instead of spamming  
✅ **Automatic Cleanup** - Preview branches deleted when PR closes  
✅ **Free Hosting** - Uses GitHub Pages infrastructure  
✅ **Isolated Deployments** - Each PR has its own environment  

## Testing

Both build modes have been verified:

### Production Build
```bash
npm run build
# Base path: /www
# Redirect: /www -> /www/en/
```

### PR Preview Build
```bash
GITHUB_REF=preview/pr-123 npm run build
# Base path: /www/pr-123
# Redirect: /www/pr-123 -> /www/pr-123/en/
```

All navigation links, assets, and redirects work correctly in both modes.

## GitHub Pages Configuration

To enable this system, ensure:

1. **GitHub Pages is enabled** in repository settings
2. **Source is set to "Deploy from a branch"** 
3. **Multiple branches can be deployed** (not just main)

The workflows will automatically deploy to:
- `main` branch → Production site
- `preview/pr-*` branches → PR previews

## Security Considerations

- Preview branches contain only built static files, no source code
- Orphan branches are isolated from main branch history
- All permissions follow least privilege principle
- Automatic cleanup prevents accumulation of stale deployments
- Comment posting uses authenticated GitHub API

## Future Enhancements (Optional)

The following enhancements could be considered in the future:

1. **QR Codes** - Generate QR codes in PR comments for easy mobile access
2. **Status Badges** - Add deployment status badges to PR comments
3. **Performance Metrics** - Include Lighthouse scores in PR comments
4. **Screenshot Previews** - Auto-generate screenshots of preview pages
5. **Preview Expiration** - Auto-delete old preview branches after X days

## Maintenance

### Updating Workflows
- Keep GitHub Actions versions up to date
- Test workflow changes in a separate branch before merging
- Monitor workflow execution times and optimize if needed

### Troubleshooting
- Check workflow logs for detailed error messages
- Verify GitHub Pages is enabled and configured correctly
- Ensure required permissions are granted to workflows
- Test builds locally with both production and PR preview modes

## Files Modified/Created

### Modified
- `astro.config.mjs` - Added PR preview detection and dynamic base path
- `src/pages/index.astro` - Dynamic redirect using base path
- `src/layouts/Layout.astro` - Dynamic navigation links with buildPath helper
- `README.md` - Updated PR preview documentation
- `.github/workflows/README.md` - Comprehensive workflow documentation

### Created
- `.github/workflows/pr-preview-deploy.yml` - PR preview deployment workflow
- `.github/workflows/pr-preview-cleanup.yml` - PR preview cleanup workflow

### Deleted
- `.github/workflows/pr-preview.yml` - Old artifact-based workflow

## Conclusion

This implementation provides a professional, user-friendly PR preview system that leverages GitHub Pages for free, reliable hosting. The system is fully automated, requires no manual intervention, and provides an excellent developer experience for reviewing changes before merging.
