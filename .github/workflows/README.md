# GitHub Actions Workflows

This directory contains automated workflows for the Akagi Engineering website.

## Workflows

### 1. PR Preview (`pr-preview.yml`)

Automatically builds and creates preview artifacts for pull requests.

#### Triggers
- Pull request opened
- Pull request synchronized (new commits pushed)
- Pull request reopened

#### Permissions
- `contents: read` - Access repository content for checkout and build
- `pull-requests: write` - Post and update comments on pull requests
- `deployments: write` - Create deployment status for tracking

#### Features
- ✅ Builds the website for every PR
- 📦 Uploads build artifact (7-day retention)
- 💬 Posts automated comment with preview instructions
- 🔄 Updates existing comment on new commits (no spam)
- 🚀 Creates deployment status for better tracking
- ⚠️ Graceful error handling for comment posting

#### Comment Details
The workflow posts a comment on the PR with:
- Build status and metadata (commit SHA, timestamp)
- Direct link to the GitHub Actions run
- Step-by-step instructions to download and test the preview
- Available language routes (English, Japanese, Russian)

#### Fork Support
This workflow works for both:
- Internal team members
- External contributors from forked repositories
- Draft and ready pull requests

The `pull_request` trigger has access to read repository contents and write to pull requests even from forks.

#### Testing Preview Locally
1. Navigate to the Actions tab of the PR
2. Download the `pr-preview-{PR_NUMBER}` artifact
3. Extract the ZIP file
4. Serve the `dist` folder:
   ```bash
   npx serve dist
   # or
   python -m http.server --directory dist
   ```
5. Open `http://localhost:<port>/www` in your browser

### 2. Deploy to GitHub Pages (`deploy.yml`)

Automatically deploys the website to GitHub Pages on every push to `main`.

#### Triggers
- Push to `main` branch
- Manual workflow dispatch

#### Permissions
- `contents: read` - Access repository content
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - GitHub Pages deployment authentication

#### Features
- 🏗️ Builds the website
- 🚀 Deploys to GitHub Pages
- 🔒 Uses GitHub's OIDC authentication
- ⚡ Concurrency control to prevent overlapping deployments

#### Production URL
https://akagi-dev.github.io/www

## Maintenance

### Updating Dependencies
Both workflows use the following actions:
- `actions/checkout@v4` - Repository checkout
- `actions/setup-node@v4` - Node.js setup
- `actions/upload-artifact@v4` - Artifact upload (PR preview)
- `actions/github-script@v7` - GitHub API interactions (PR preview)
- `actions/upload-pages-artifact@v3` - Pages artifact upload (deploy)
- `actions/deploy-pages@v4` - GitHub Pages deployment (deploy)

Check for updates periodically and test before merging.

### Troubleshooting

#### PR Comments Not Posting
1. Verify `pull-requests: write` permission is set
2. Check the Actions run logs for error messages
3. Ensure the workflow file syntax is valid

#### Build Failures
1. Check Node.js version compatibility (should be 20+)
2. Verify npm dependencies install correctly
3. Test build locally with `npm run build`

#### Deployment Issues
1. Verify GitHub Pages is enabled in repository settings
2. Check that the `main` branch is the deployment source
3. Ensure `pages: write` permission is granted

## Security Notes

- Workflows from forks have limited permissions for security
- Secrets are not exposed to fork PRs
- Comment posting uses GitHub's API with proper authentication
- All permissions follow the principle of least privilege
