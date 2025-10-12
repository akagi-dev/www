# Quality Tests

This directory contains comprehensive validation tests for the Akagi Engineering multilingual website.

## Test Suite Overview

The test suite validates various aspects of the built website to ensure quality, consistency, and proper functionality across all language versions (English, Japanese, Russian) and both portals (Corporate, Drift Rental).

## Test Scripts

### 1. Link Validation (`validate-links.mjs`)
- **Purpose**: Validates all internal and external links
- **Checks**:
  - Internal links resolve to existing pages
  - External links have valid URL format
  - Navigation links work across all language versions
  - Footer and header links are functional
  - Static assets (CSS, images, fonts) are reachable
- **Path Normalization**: Handles PR preview paths (`/www/pr-{number}`) and base paths
- **Smart Detection**: Distinguishes between critical broken links and missing language-specific pages
- **Critical**: No (warns about issues, fails only on critical broken links)

### 2. Resource Validation (`validate-resources.mjs`)
- **Purpose**: Ensures all referenced resources exist
- **Checks**:
  - Images (favicon, inline images)
  - CSS files
  - JavaScript files
  - Static assets
- **Critical**: Yes (fails on missing resources)

### 3. Content Quality (`validate-content.mjs`)
- **Purpose**: Validates content quality and structure
- **Checks**:
  - Duplicate content detection
  - Translation completeness in `ui.ts`
  - Valid HTML structure (DOCTYPE, head, body, etc.)
  - Placeholder text detection (TODO, FIXME, etc.)
- **Critical**: No (warns about issues)

### 4. SEO & Meta Tags (`validate-seo.mjs`)
- **Purpose**: Validates SEO-critical meta tags
- **Checks**:
  - Title tags (presence, length)
  - Meta descriptions (presence, length)
  - Language declarations (`lang` attribute)
  - Essential meta tags (charset, viewport)
- **Critical**: Yes (fails on missing critical SEO tags)

### 5. Cross-Language Consistency (`validate-cross-language.mjs`)
- **Purpose**: Ensures consistency across language versions
- **Checks**:
  - All pages exist in all supported languages (en, ja, ru)
  - Navigation consistency across language versions
  - Language switcher presence
  - Portal consistency (corporate, drift)
- **Smart Warnings**: Differentiates between pages missing in all languages (critical) vs. missing in some languages (warning)
- **Statistics**: Reports total pages, complete pages, and partial pages
- **Critical**: No (warns about inconsistencies, fails only on critical issues)

## Running Tests

### Run All Tests
```bash
node tests/run-all-tests.mjs
```

### Run Individual Tests
```bash
node tests/validate-links.mjs
node tests/validate-resources.mjs
node tests/validate-content.mjs
node tests/validate-seo.mjs
node tests/validate-cross-language.mjs
```

### Enable Verbose Mode for Debugging
For detailed debugging output showing all link/resource checks:
```bash
VERBOSE=true node tests/validate-links.mjs
VERBOSE=true node tests/validate-resources.mjs
```

Verbose mode shows:
- Path normalization steps
- File resolution attempts
- Resource sizes and locations
- Detailed per-file checks

This is useful when debugging link or resource validation failures.

### Prerequisites
The website must be built before running tests:
```bash
npm run build
```

## Test Results

Tests return:
- **Exit code 0**: All critical tests passed
- **Exit code 1**: One or more critical tests failed

Non-critical test failures are reported as warnings and don't cause the overall suite to fail.

## CI/CD Integration

These tests are automatically run on every Pull Request via the `.github/workflows/pr-tests.yml` workflow.

The workflow:
1. Tests both production and PR preview builds
2. Validates all test categories
3. Checks bundle size and performance
4. Posts results as a PR comment
5. Requires all critical tests to pass before merge

## Test Output

Each test provides detailed output:
- ✅ Passed checks
- ❌ Failed checks (with details)
- ⚠️ Warnings (non-critical issues)
- 📊 Statistics (links, resources, pages analyzed)

The test runner provides a summary showing:
- Total tests run
- Pass/fail counts
- Critical vs. non-critical failures
- Execution time
- Detailed statistics per test category

## Supported Languages

The tests validate content for all supported languages:
- 🇬🇧 English (en)
- 🇯🇵 Japanese (ja)
- 🇷🇺 Russian (ru)

## Supported Portals

Tests cover both website portals:
- **Corporate Portal**: Main company website
- **Drift Rental Portal**: Drift car rental service

## Known Issues

The tests may report warnings for:
- Missing translations for some drift portal pages (ja, ru)
  - Pages like fleet, tracks, pricing, booking, faq exist only in English
  - These are tracked as non-critical technical debt
- Short meta descriptions (< 120 chars)
  - Some drift portal pages need longer descriptions for better SEO
- Navigation link variations between language versions
  - Links to untranslated pages are present but marked as warnings

These are tracked as technical debt and don't block PR merges.

## Recent Improvements

**Enhanced Link Validation**:
- Smart categorization of broken links (critical vs. missing language pages)
- Improved path normalization for PR preview environments
- Better handling of static assets (fonts, images, CSS)
- Detailed statistics on link types analyzed

**Enhanced Resource Validation**:
- Verbose mode for debugging resource resolution
- Statistics on resource references and unique resources
- Better handling of external resources

**Enhanced Cross-Language Validation**:
- Differentiate between complete pages (all languages) and partial pages (some languages)
- More helpful warning messages with suggestions
- Statistics on page coverage across languages

## Extending Tests

To add new validation tests:

1. Create a new `.mjs` file in this directory
2. Follow the existing test structure (Node.js ESM modules)
3. Return appropriate exit codes (0 = pass, 1 = fail)
4. Add the test to `run-all-tests.mjs`
5. Update `.github/workflows/pr-tests.yml` if needed

## Performance

The full test suite typically completes in under 1 second for production builds, well within the 10-minute target for the complete CI/CD workflow.
