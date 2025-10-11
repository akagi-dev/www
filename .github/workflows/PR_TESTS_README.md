# PR Quality Tests Workflow

## Overview

The PR Quality Tests workflow (`.github/workflows/pr-tests.yml`) runs comprehensive validation tests on every Pull Request to ensure the quality and integrity of the multilingual Astro-based website.

## Workflow Triggers

The workflow runs automatically on:
- Pull request opened
- Pull request synchronized (new commits pushed)
- Pull request reopened

Target branch: `main`

## Test Jobs

### 1. Test Production Build
**Purpose**: Validates the production build configuration

**Steps**:
1. Checkout code
2. Setup Node.js 20 with npm cache
3. Install dependencies
4. Build in production mode (custom domain)
5. Run all validation tests
6. Report bundle size metrics

**Build Configuration**:
- Base path: `/www`
- Site: `https://www.akagi.dev`

### 2. Test PR Preview Build
**Purpose**: Validates the PR preview build configuration

**Steps**:
1. Checkout code
2. Setup Node.js 20 with npm cache
3. Install dependencies
4. Build in PR preview mode
5. Verify PR preview paths
6. Run all validation tests

**Build Configuration**:
- Base path: `/www/pr-{number}`
- Site: `https://akagi-dev.github.io`
- Environment variable: `GITHUB_REF=preview/pr-{number}`

### 3. Responsive Design Check
**Purpose**: Validates responsive design implementation

**Steps**:
1. Checkout code
2. Setup Node.js 20 with npm cache
3. Install dependencies
4. Build website
5. Check viewport meta tags
6. Verify mobile menu implementation

**Dependency**: Runs after `test-production-build`

### 4. Comment Results
**Purpose**: Posts test results as a PR comment

**Steps**:
1. Collects results from all test jobs
2. Formats results table
3. Posts/updates PR comment with:
   - Test suite status (✅/❌)
   - Test categories covered
   - Link to detailed results
4. Updates existing comment instead of creating new ones

**Dependency**: Runs after all test jobs complete

**Permissions Required**:
- `pull-requests: write` - To post/update comments

## Test Categories

All PR tests validate:

| Category | Description | Critical |
|----------|-------------|----------|
| Link Validation | Internal & external links | No |
| Resource Validation | Images, CSS, JS assets | Yes |
| Content Quality | Duplicates, translations, HTML structure | No |
| SEO & Meta Tags | Titles, descriptions, lang attributes | Yes |
| Cross-Language Consistency | Page parity across en/ja/ru | No |
| Build Verification | Production & PR preview builds | Yes |
| Responsive Design | Viewport meta, mobile menu | Yes |

## Success Criteria

A PR can be merged when:
- ✅ All critical tests pass
- ✅ Production build succeeds
- ✅ PR preview build succeeds
- ✅ Responsive design checks pass

Non-critical test failures are reported as warnings and don't block merging.

## Performance

**Target**: Complete all tests in under 10 minutes

**Actual**:
- Test suite execution: < 1 second
- Build time: ~1-2 seconds
- Total workflow time: ~2-3 minutes (including setup)

## Caching

The workflow uses npm caching to speed up dependency installation:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

This reduces installation time from ~20 seconds to ~2-3 seconds on subsequent runs.

## Permissions

The workflow requires:
```yaml
permissions:
  contents: read           # To checkout code
  pull-requests: write     # To post comments
```

## Failure Scenarios

### Critical Test Failures
If any critical test fails:
- ❌ Workflow status: Failed
- 🚫 PR cannot be merged (if required checks are enabled)
- 💬 PR comment shows which tests failed
- 📋 Detailed logs available in Actions tab

### Non-Critical Test Failures
If only non-critical tests fail:
- ✅ Workflow status: Success
- ✅ PR can be merged
- ⚠️ PR comment shows warnings
- 📋 Issues should be reviewed but don't block merge

### Build Failures
If build fails:
- ❌ Workflow status: Failed
- 🚫 Tests don't run
- 💬 Build error shown in PR comment
- 🔍 Check build logs for errors

## PR Comment Format

Example comment posted to PRs:

```markdown
## 🧪 PR Quality Tests Results

| Test Suite | Status |
|------------|--------|
| Production Build & Tests | ✅ success |
| PR Preview Build & Tests | ✅ success |
| Responsive Design Check | ✅ success |

### Test Categories:
- ✅ Link validation (internal & external)
- ✅ Resource validation (images, CSS, JS)
- ✅ Content quality checks
- ✅ SEO & meta tag validation
- ✅ Cross-language consistency
- ✅ Build verification (production & PR preview)
- ✅ Responsive design basics

[View detailed results →](https://github.com/akagi-dev/www/actions/runs/...)

---
🤖 *Automated quality checks for multilingual Astro website*
```

## Local Testing

Run the same tests locally before pushing:

```bash
# Production build
npm run build
node tests/run-all-tests.mjs

# PR preview build
GITHUB_REF=preview/pr-123 npm run build
node tests/run-all-tests.mjs
```

## Maintenance

### Updating Tests
1. Edit test scripts in `tests/` directory
2. Test locally first
3. Update `tests/README.md` if adding new tests
4. Commit and push changes

### Updating Workflow
1. Edit `.github/workflows/pr-tests.yml`
2. Test in a draft PR first
3. Monitor workflow execution
4. Update this documentation

### Adding New Test Categories
1. Create new test script in `tests/`
2. Add to `tests/run-all-tests.mjs`
3. Set `critical: true/false` appropriately
4. Update both README files
5. Test thoroughly before merging

## Troubleshooting

### Tests Pass Locally But Fail in CI
- Check Node.js version matches (20.x)
- Verify npm dependencies are locked
- Check for environment-specific issues
- Review workflow logs for details

### Workflow Doesn't Trigger
- Verify PR targets `main` branch
- Check workflow file is in `.github/workflows/`
- Ensure YAML syntax is valid
- Check repository permissions

### Comment Not Posted
- Verify `pull-requests: write` permission is granted
- Check bot has access to repository
- Review comment posting logs in workflow
- Ensure PR is from same repository (not fork)

## Security Considerations

- Workflow runs on PR events (safe for forks)
- No secrets required for basic tests
- Comments posted by GitHub bot account
- No external API calls in tests
- All validations run on built static files

## Future Enhancements

Potential additions:
- [ ] Lighthouse performance scores
- [ ] Visual regression testing
- [ ] Accessibility audit (WCAG compliance)
- [ ] Bundle size limits and tracking
- [ ] Dead code detection
- [ ] Security vulnerability scanning
- [ ] Performance budgets
- [ ] Screenshot comparisons
