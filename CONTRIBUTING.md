# Quick Start: PR Quality Tests

## For Contributors

When you create a Pull Request, automated tests will run to ensure quality. Here's what you need to know:

### What Gets Tested Automatically

Every PR triggers tests that check:
- ✅ All links work (internal and external)
- ✅ All images, CSS, and JS files exist
- ✅ Content quality (no duplicates, proper structure)
- ✅ SEO tags are present (titles, descriptions)
- ✅ All languages have consistent pages
- ✅ Both production and PR preview builds work
- ✅ Mobile-responsive design is intact

### How to See Test Results

1. **On the PR page**: Look for the status checks at the bottom
2. **In comments**: A bot will post test results with details
3. **In Actions tab**: Click "Details" for full logs

### Test Status Indicators

- ✅ **Green checkmark** = All critical tests passed, PR ready to merge
- ⚠️ **Yellow warning** = Some non-critical tests have warnings, review recommended
- ❌ **Red X** = Critical test failed, fix required before merge

### Running Tests Locally (Before Creating PR)

Save time by testing locally first:

```bash
# 1. Build the site
npm run build

# 2. Run all tests
node tests/run-all-tests.mjs
```

This runs the same tests that will run in CI, so you can catch issues early.

### Common Test Failures and Fixes

#### 1. Broken Link
**Error**: `Broken link "/en/newpage" in contact/index.html`

**Fix**: 
- Make sure the linked page exists
- Check the path is correct
- Verify the file was added to git

#### 2. Missing Resource
**Error**: `Missing image resource "/images/photo.jpg"`

**Fix**:
- Add the image to the `public/` directory
- Verify the path in your code
- Commit the image file

#### 3. Missing Meta Description
**Error**: `Missing meta description in en/index.html`

**Fix**:
- Add `<meta name="description" content="...">` to the page
- Make description 120-160 characters long

#### 4. Missing Translation
**Error**: `Missing translations found: ja: "new.key"`

**Fix**:
- Add the translation key to `src/i18n/ui.ts`
- Add it for all languages (en, ja, ru)

#### 5. Page Not in All Languages
**Error**: `Page "services" missing in: ja, ru`

**Fix**:
- Create the page in all language directories
- Or mark it as English-only with a note

### What If Tests Fail?

1. **Read the error message** - It tells you exactly what's wrong
2. **Click "Details"** in the status check for full logs
3. **Fix the issue** and push a new commit
4. **Tests re-run automatically** on each new commit

### Non-Critical Warnings

Some warnings won't block your PR but should be reviewed:
- Short meta descriptions (< 120 chars)
- Missing pages in some languages
- Content consistency issues

These are tracked as technical debt and can be addressed later.

### Need Help?

- Check the [Test Documentation](../tests/README.md)
- Check the [Workflow Documentation](../.github/workflows/PR_TESTS_README.md)
- Ask in PR comments
- Review existing PRs for examples

## For Reviewers

### Reviewing Test Results

When reviewing a PR:

1. **Check the test comment** - Bot posts results on each PR
2. **Verify critical tests pass** - Green checkmarks required
3. **Review warnings** - Yellow warnings should be acknowledged
4. **Check build previews** - Test the actual deployed preview

### Approving PRs

A PR can be approved and merged when:
- ✅ All critical tests pass
- ✅ Code review approved
- ✅ Preview tested (if UI changes)
- ⚠️ Warnings reviewed and acceptable

### Manual Testing

Even with automated tests, manually test:
- Navigation flows
- Visual appearance
- Mobile responsiveness
- Cross-browser compatibility
- Accessibility

Use the PR preview links in the bot comment to test live.

## Test Categories Explained

### Critical Tests (Must Pass)
- **Resource Validation** - Ensures no 404 errors for assets
- **SEO & Meta Tags** - Maintains search engine visibility
- **Build Verification** - Site builds without errors

### Non-Critical Tests (Warnings OK)
- **Link Validation** - May have intentional external links
- **Content Quality** - Checks for best practices
- **Cross-Language Consistency** - Tracks translation completeness

## Performance

Tests are fast:
- Complete in < 1 second locally
- CI/CD workflow: ~2-3 minutes total
- No manual intervention needed

## Tips for Success

✅ **DO:**
- Run tests locally before creating PR
- Read test output carefully
- Fix critical failures promptly
- Document intentional warnings

❌ **DON'T:**
- Ignore test failures
- Skip reviewing test results
- Merge with failing critical tests
- Remove tests to make them pass

## Questions?

See the full documentation:
- [Tests README](../tests/README.md)
- [Workflow README](../.github/workflows/PR_TESTS_README.md)
- [Main README](../README.md)
