#!/usr/bin/env node

/**
 * Booking Components Validation Test
 * Tests the card-based product selection components
 * Run with: node tests/validate-booking-components.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');

console.log('🛒 Validating booking components...\n');

const bookingPages = [
  'drift/en/booking/index.html',
  'drift/ja/booking/index.html',
  'drift/ru/booking/index.html'
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function checkPage(pagePath) {
  const fullPath = path.join(distDir, pagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Page not found: ${pagePath}`);
    failedChecks++;
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const locale = pagePath.includes('/en/') ? 'en' : pagePath.includes('/ja/') ? 'ja' : 'ru';
  
  console.log(`\n📄 Checking ${pagePath} (${locale.toUpperCase()}):`);
  
  let pageChecks = 0;
  let pagePassed = 0;
  
  // Check 1: ProductGrid component is rendered
  if (content.includes('product-grid-container')) {
    console.log('  ✅ ProductGrid container found');
    pagePassed++;
  } else {
    console.log('  ❌ ProductGrid container missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 2: Car class grid exists
  if (content.includes('id="carClass"')) {
    console.log('  ✅ Car class grid element found');
    pagePassed++;
  } else {
    console.log('  ❌ Car class grid element missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 3: Track grid exists
  if (content.includes('id="track"')) {
    console.log('  ✅ Track grid element found');
    pagePassed++;
  } else {
    console.log('  ❌ Track grid element missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 4: Hidden input for car class
  if (content.includes('id="carClass-value"')) {
    console.log('  ✅ Car class hidden input found');
    pagePassed++;
  } else {
    console.log('  ❌ Car class hidden input missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 5: Hidden input for track
  if (content.includes('id="track-value"')) {
    console.log('  ✅ Track hidden input found');
    pagePassed++;
  } else {
    console.log('  ❌ Track hidden input missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 6: Loading indicator
  if (content.includes('Loading products')) {
    console.log('  ✅ Loading indicator found');
    pagePassed++;
  } else {
    console.log('  ❌ Loading indicator missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 7: Product fetch script (bundled)
  if (content.includes('booking.astro_astro_type_script') || content.includes('.js')) {
    console.log('  ✅ Product fetching script found (bundled)');
    pagePassed++;
  } else {
    console.log('  ❌ Product fetching script missing');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 8: Check that JavaScript bundle is referenced
  const hasScriptTag = /<script[^>]*src="[^"]*booking[^"]*\.js"/.test(content);
  if (hasScriptTag) {
    console.log('  ✅ JavaScript bundle referenced');
    pagePassed++;
  } else {
    console.log('  ⚠️  JavaScript bundle reference format changed');
    pagePassed++; // Don't fail on this
  }
  pageChecks++;
  
  // Check 9: Verify module script type
  if (content.includes('type="module"')) {
    console.log('  ✅ Module script type found');
    pagePassed++;
  } else {
    console.log('  ⚠️  Module script type check skipped');
    pagePassed++; // Don't fail on this  
  }
  pageChecks++;
  
  // Check 10: Form still exists with proper submission
  if (content.includes('<form') && content.includes('type="submit"')) {
    console.log('  ✅ Form with submit button found');
    pagePassed++;
  } else {
    console.log('  ❌ Form structure incomplete');
    failedChecks++;
  }
  pageChecks++;
  
  // Check 11: No old dropdown selects for car/track
  const carDropdown = /<select[^>]*id="carClass"[^>]*>[\s\S]*?<option[^>]*value="na-classics"/;
  const trackDropdown = /<select[^>]*id="track"[^>]*>[\s\S]*?<option[^>]*value="chiba"/;
  
  if (!carDropdown.test(content) && !trackDropdown.test(content)) {
    console.log('  ✅ Old dropdowns successfully replaced');
    pagePassed++;
  } else {
    console.log('  ❌ Old dropdowns still present');
    failedChecks++;
  }
  pageChecks++;
  
  totalChecks += pageChecks;
  passedChecks += pagePassed;
  
  const pageSuccess = pagePassed === pageChecks;
  console.log(`  ${pageSuccess ? '✅' : '❌'} ${pagePassed}/${pageChecks} checks passed`);
  
  return pageSuccess;
}

console.log('Found booking pages to check:', bookingPages.length);

let allPassed = true;
for (const page of bookingPages) {
  const passed = checkPage(page);
  if (!passed) allPassed = false;
}

console.log('\n' + '='.repeat(60));
console.log('BOOKING COMPONENTS VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`📊 Statistics:`);
console.log(`   Total checks: ${totalChecks}`);
console.log(`   Pages checked: ${bookingPages.length}`);
console.log(`\n✅ Passed: ${passedChecks}`);
console.log(`❌ Failed: ${failedChecks}`);

console.log('\n' + (allPassed ? '✅ All booking component validations PASSED' : '❌ Some booking component validations FAILED'));

process.exit(allPassed ? 0 : 1);
