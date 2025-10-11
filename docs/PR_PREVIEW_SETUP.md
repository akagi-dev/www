# PR Preview Setup Guide

This document explains how to set up the PR preview deployment system using Surge.sh.

## Prerequisites

- A Surge.sh account (free tier is sufficient)
- GitHub repository admin access to configure secrets

## Setup Instructions

### 1. Create Surge.sh Account

1. Visit [surge.sh](https://surge.sh/)
2. Install Surge CLI locally (optional for testing):
   ```bash
   npm install -g surge
   ```
3. Create an account:
   ```bash
   surge login
   ```
   Follow the prompts to create your account with your email.

### 2. Get Your Surge Token

After logging in, get your authentication token:

```bash
surge token
```

This will display your Surge token. Copy it for the next step.

### 3. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name:** `SURGE_TOKEN`
   - **Value:** Your Surge token from step 2

### 4. Test the Workflow

Once the secret is configured:

1. Create a new pull request
2. The PR Preview workflow will automatically run
3. After a successful build, a comment will be posted with preview links
4. When the PR is closed, the preview will be automatically cleaned up

## How It Works

### Deployment Workflow

The `.github/workflows/pr-preview.yml` workflow:

1. **Triggers** on PR open, update, or reopen
2. **Builds** the Astro site with preview-specific configuration
3. **Deploys** to Surge.sh at `https://pr-{number}-akagi-www.surge.sh`
4. **Comments** on the PR with links to all language variants
5. **Uploads** a backup build artifact

### Cleanup Workflow

The `.github/workflows/pr-preview-cleanup.yml` workflow:

1. **Triggers** when a PR is closed
2. **Removes** the Surge.sh deployment
3. **Comments** on the PR confirming cleanup

### Environment Configuration

The build system automatically configures paths:

- **Production** (GitHub Pages): 
  - Base: `/www`
  - Site: `https://akagi-dev.github.io`
  
- **PR Preview** (Surge.sh):
  - Base: `/`
  - Site: `https://pr-{number}-akagi-www.surge.sh`

## Preview URLs

Each PR gets a unique URL with all language variants:

- 🇬🇧 English: `https://pr-{number}-akagi-www.surge.sh/en/`
- 🇯🇵 Japanese: `https://pr-{number}-akagi-www.surge.sh/ja/`
- 🇷🇺 Russian: `https://pr-{number}-akagi-www.surge.sh/ru/`

## Troubleshooting

### Deployment Fails with "Unauthorized"

- Check that `SURGE_TOKEN` secret is correctly set
- Verify the token by running `surge token` locally
- Regenerate the token if needed: `surge logout` then `surge login`

### Deployment Works but Links are Broken

- The `PREVIEW_URL` environment variable must be set correctly
- Check the workflow file for the correct URL pattern
- Verify `astro.config.mjs` is using the environment variable

### Preview Not Cleaning Up

- Check that the cleanup workflow has the correct `SURGE_TOKEN`
- The workflow uses `continue-on-error: true` to handle missing deployments gracefully
- Old deployments can be manually removed: `surge teardown https://pr-{number}-akagi-www.surge.sh`

## Cost Considerations

- Surge.sh free tier includes:
  - Unlimited projects
  - Custom domain support
  - No bandwidth limits
- Each PR creates a temporary deployment
- Deployments are automatically cleaned up on PR close

## Security Notes

- The `SURGE_TOKEN` is a repository secret and never exposed in logs
- Previews are publicly accessible at their unique URLs
- Only repository collaborators can trigger PR preview deployments
- Cleanup happens automatically to prevent accumulation

## Alternative Deployment Options

If you prefer to use a different service:

### Netlify

Update workflows to use Netlify CLI:
```yaml
- name: Deploy to Netlify
  run: |
    netlify deploy --dir=dist --message="PR #${{ github.event.pull_request.number }}"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Vercel

Update workflows to use Vercel CLI:
```yaml
- name: Deploy to Vercel
  run: |
    vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### GitHub Pages (per-PR)

Use GitHub Actions to deploy each PR to a separate branch:
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    destination_dir: pr-${{ github.event.pull_request.number }}
```

## Support

For issues or questions:
- Check GitHub Actions logs for detailed error messages
- Verify all secrets are correctly configured
- Review Surge.sh documentation: https://surge.sh/help/
