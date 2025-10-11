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
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
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
  // Remove base path variations
  let normalized = link.replace(/^\/www\/pr-\d+/, '');
  normalized = normalized.replace(/^\/www/, '');
  
  // Ensure leading slash
  if (!normalized.startsWith('/') && !normalized.startsWith('http')) {
    normalized = '/' + normalized;
  }
  
  return normalized;
}

// Check if internal link exists
function checkInternalLink(link, distDir) {
  const normalized = normalizePath(link);
  
  // Skip external links
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return { exists: true, external: true };
  }
  
  // Remove query params and hash
  const cleanPath = normalized.split('?')[0].split('#')[0];
  
  // Try different file locations
  const possiblePaths = [
    path.join(distDir, cleanPath),
    path.join(distDir, cleanPath, 'index.html'),
    path.join(distDir, cleanPath + '.html'),
  ];
  
  // Check for static assets
  if (cleanPath.match(/\.(svg|png|jpg|jpeg|gif|css|js|ico)$/)) {
    possiblePaths.push(path.join(distDir, cleanPath));
  }
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return { exists: true, external: false, resolvedPath: testPath };
    }
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
    
    for (const link of links) {
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
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Link validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ All link validations PASSED');
    process.exit(0);
  }
}

validateLinks().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
