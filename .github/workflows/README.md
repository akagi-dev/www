# GitHub Actions Workflows

This directory contains automated workflows for the Akagi Engineering website.

## Workflows

### 1. PR Preview Deploy (`pr-preview-deploy.yml`)

Automatically builds and deploys live previews for pull requests to GitHub Pages using orphan branches.

#### Triggers
- Pull request opened
- Pull request synchronized (new commits pushed)
- Pull request reopened

#### Permissions
- `contents: write` - Create and push to orphan preview branches
- `pull-requests: write` - Post and update comments on pull requests
- `pages: write` - Deploy to GitHub Pages

#### Features
- ✅ Builds the website for every PR with PR-specific configuration
- 🌐 Deploys to dedicated orphan branch `preview/pr-{number}`
- 📱 Creates live preview URLs accessible via GitHub Pages
- 💬 Posts automated comment with direct preview links
- 🔄 Updates existing comment on new commits (no spam)
- 🌍 Multi-language support (English, Japanese, Russian)
- ⚠️ Graceful error handling for deployment and comment posting

#### Preview URL Format
Each PR gets its own set of preview URLs:
- Base: `https://akagi-dev.github.io/www/pr-{number}/`
- English: `https://akagi-dev.github.io/www/pr-{number}/en/`
- Japanese: `https://akagi-dev.github.io/www/pr-{number}/ja/`
- Russian: `https://akagi-dev.github.io/www/pr-{number}/ru/`

#### Comment Details
The workflow posts a comment on the PR with:
- Direct preview links for all languages
- Quick access links for home page
- Build metadata (commit SHA, timestamp, branch)
- Easy-to-share URLs for mobile testing

#### How It Works
1. Workflow triggers on PR open/update
2. Checks out PR branch
3. Builds site with `GITHUB_REF=preview/pr-{number}` environment variable
4. Astro config detects PR preview mode and sets base path to `/www/pr-{number}`
5. Creates orphan branch `preview/pr-{number}`
6. Pushes built files to orphan branch
7. GitHub Pages serves the preview from the branch
8. Posts/updates comment with preview links

#### Testing Preview
Simply click the preview links in the PR comment - no download or local setup required!

### 2. PR Preview Cleanup (`pr-preview-cleanup.yml`)

Automatically cleans up preview deployments when pull requests are closed or merged.

#### Triggers
- Pull request closed (includes merged PRs)

#### Permissions
- `contents: write` - Delete orphan preview branches
- `pull-requests: write` - Update comments

#### Features
- 🧹 Deletes orphan preview branch
- 💬 Updates PR comment with cleanup status
- ✅ Indicates if PR was merged or closed
- ⚠️ Graceful handling of missing branches

#### How It Works
1. Workflow triggers on PR close/merge
2. Deletes `preview/pr-{number}` branch
3. Updates original preview comment to show cleanup status
4. Frees up GitHub Pages resources

### 3. Deploy to GitHub Pages (`deploy.yml`)

Automatically deploys the production website to GitHub Pages on every push to `main`.

#### Triggers
- Push to `main` branch
- Manual workflow dispatch

#### Permissions
- `contents: read` - Access repository content
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - GitHub Pages deployment authentication

#### Features
- 🏗️ Builds the website with production configuration
- 🚀 Deploys to GitHub Pages main site
- 🔒 Uses GitHub's OIDC authentication
- ⚡ Concurrency control to prevent overlapping deployments

#### Production URL
https://akagi-dev.github.io/www

## Configuration

### Astro Config (`astro.config.mjs`)
The Astro configuration is environment-aware:

```javascript
const isPRPreview = process.env.GITHUB_REF?.includes('preview/pr-');
const prNumber = isPRPreview ? process.env.GITHUB_REF?.match(/pr-(\d+)/)?.[1] : null;

export default defineConfig({
  site: 'https://akagi-dev.github.io',
  base: prNumber ? `/www/pr-${prNumber}` : '/www',
});
```

This ensures:
- Production builds use `/www` as base path
- PR preview builds use `/www/pr-{number}` as base path
- All internal links work correctly in both environments

### GitHub Pages Setup
Ensure GitHub Pages is configured:
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Enable deployments from multiple branches (production + preview branches)

## Maintenance

### Updating Dependencies
Both workflows use the following actions:
- `actions/checkout@v4` - Repository checkout
- `actions/setup-node@v4` - Node.js setup
- `actions/github-script@v7` - GitHub API interactions
- `actions/upload-pages-artifact@v3` - Pages artifact upload (production deploy)
- `actions/deploy-pages@v4` - GitHub Pages deployment (production deploy)

Check for updates periodically and test before merging.

### Troubleshooting

#### PR Preview Not Deploying
1. Verify `contents: write` and `pages: write` permissions are set
2. Check the Actions run logs for error messages
3. Ensure the workflow file syntax is valid
4. Verify GitHub Pages is enabled in repository settings

#### Preview Links Not Working
1. Check that orphan branch was created successfully
2. Verify base path is set correctly in build logs
3. Wait a few minutes for GitHub Pages to update
4. Check GitHub Pages deployment status

#### PR Comments Not Posting
1. Verify `pull-requests: write` permission is set
2. Check the Actions run logs for error messages
3. Ensure the workflow file syntax is valid

#### Build Failures
1. Check Node.js version compatibility (should be 20+)
2. Verify npm dependencies install correctly
3. Test build locally with `npm run build`
4. Test PR build locally with `GITHUB_REF=preview/pr-123 npm run build`

#### Cleanup Issues
1. Verify cleanup workflow has `contents: write` permission
2. Check if preview branch exists before cleanup
3. Review cleanup workflow logs for errors

## Security Notes

- Preview branches are isolated from main branch
- Orphan branches contain only built files, no source code
- All permissions follow the principle of least privilege
- Comment posting uses GitHub's API with proper authentication
- Cleanup happens automatically to prevent resource accumulation
