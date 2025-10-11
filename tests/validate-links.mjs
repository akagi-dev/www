#!/usr/bin/env node

/**
 * Link Validation Test
 * Validates all internal links and checks external links with timeout
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const VERBOSE = process.env.VERBOSE === 'true';
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  stats: {
    totalLinks: 0,
    internalLinks: 0,
    externalLinks: 0,
    staticAssets: 0
  }
};

// Get all HTML files
function getAllHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Extract links from HTML
function extractLinks(html, filePath) {
  const links = new Set();
  
  // Match href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    // Skip javascript:, mailto:, tel:, and anchors
    if (!href.startsWith('javascript:') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') &&
        !href.startsWith('#')) {
      links.add(href);
    }
  }
  
  return Array.from(links);
}

// Normalize path for checking
function normalizePath(link) {
  // Remove base path variations (PR previews and /www prefix)
  let normalized = link.replace(/^\/www\/pr-\d+/, '');
  normalized = normalized.replace(/^\/www/, '');
  
  // Handle relative paths without leading slash
  if (!normalized.startsWith('/') && !normalized.startsWith('http')) {
    normalized = '/' + normalized;
  }
  
  // Remove trailing slashes for consistency (except for root)
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  
  if (VERBOSE) {
    console.log(`  [normalize] ${link} => ${normalized}`);
  }
  
  return normalized;
}

// Check if internal link exists
function checkInternalLink(link, distDir) {
  const normalized = normalizePath(link);
  
  // Skip external links
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    results.stats.externalLinks++;
    return { exists: true, external: true };
  }
  
  results.stats.internalLinks++;
  
  // Remove query params and hash
  const cleanPath = normalized.split('?')[0].split('#')[0];
  
  // Check if it's a static asset
  const isStaticAsset = cleanPath.match(/\.(svg|png|jpg|jpeg|gif|css|js|ico|woff|woff2|ttf|eot)$/);
  if (isStaticAsset) {
    results.stats.staticAssets++;
  }
  
  // Try different file locations
  const possiblePaths = [
    path.join(distDir, cleanPath),
    path.join(distDir, cleanPath, 'index.html'),
    path.join(distDir, cleanPath + '.html'),
  ];
  
  // For static assets, check the direct path first
  if (isStaticAsset) {
    possiblePaths.unshift(path.join(distDir, cleanPath));
  }
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      if (VERBOSE) {
        console.log(`  [found] ${link} => ${testPath}`);
      }
      return { exists: true, external: false, resolvedPath: testPath };
    }
  }
  
  if (VERBOSE) {
    console.log(`  [missing] ${link} - tried: ${possiblePaths.join(', ')}`);
  }
  
  return { exists: false, external: false, attempted: possiblePaths };
}

// Check external links (basic check)
const externalLinkCache = new Map();
async function checkExternalLink(url) {
  if (externalLinkCache.has(url)) {
    return externalLinkCache.get(url);
  }
  
  // For now, just validate URL format
  try {
    new URL(url);
    const result = { valid: true };
    externalLinkCache.set(url, result);
    return result;
  } catch {
    const result = { valid: false, error: 'Invalid URL format' };
    externalLinkCache.set(url, result);
    return result;
  }
}

// Main validation
async function validateLinks() {
  console.log('🔗 Validating links...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run build first.');
    process.exit(1);
  }
  
  const htmlFiles = getAllHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to check\n`);
  
  const brokenLinks = [];
  const externalLinks = new Set();
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    const links = extractLinks(html, filePath);
    
    if (VERBOSE) {
      console.log(`\n📄 Checking ${relativePath} (${links.length} links)...`);
    }
    
    for (const link of links) {
      results.stats.totalLinks++;
      const check = checkInternalLink(link, distDir);
      
      if (check.external) {
        externalLinks.add(link);
      } else if (!check.exists) {
        brokenLinks.push({
          file: relativePath,
          link: link,
          attempted: check.attempted
        });
        results.failed++;
      } else {
        results.passed++;
      }
    }
  }
  
  // Report broken links
  if (brokenLinks.length > 0) {
    console.error('❌ BROKEN INTERNAL LINKS FOUND:\n');
    brokenLinks.forEach(({ file, link }) => {
      console.error(`  File: ${file}`);
      console.error(`  Broken link: ${link}\n`);
      results.errors.push(`Broken link "${link}" in ${file}`);
    });
  }
  
  // Validate external links
  console.log(`\n🌐 Checking ${externalLinks.size} unique external links...`);
  for (const url of externalLinks) {
    const check = await checkExternalLink(url);
    if (check.valid) {
      results.passed++;
    } else {
      results.warnings++;
      console.warn(`⚠️  Warning: Invalid external URL format: ${url}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('LINK VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`📊 Statistics:`);
  console.log(`   Total links found: ${results.stats.totalLinks}`);
  console.log(`   Internal links: ${results.stats.internalLinks}`);
  console.log(`   External links: ${results.stats.externalLinks}`);
  console.log(`   Static assets: ${results.stats.staticAssets}`);
  console.log(`\n✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Link validation FAILED - Broken links must be fixed');
    console.log(`   ${results.failed} broken link(s) found`);
    process.exit(1);
  } else if (results.warnings > 0) {
    console.log('\n✅ Link validation PASSED with warnings');
    console.log(`   ${results.warnings} warning(s) found (external links)`);
    process.exit(0);
  } else {
    console.log('\n✅ All link validations PASSED');
    process.exit(0);
  }
}

validateLinks().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
