#!/usr/bin/env node

/**
 * Resource Validation Test
 * Validates all images, CSS, JS, and static assets
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

// Extract resource references from HTML
function extractResources(html) {
  const resources = {
    images: new Set(),
    css: new Set(),
    js: new Set(),
    other: new Set()
  };
  
  // Extract img src
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    resources.images.add(match[1]);
  }
  
  // Extract link href (CSS and favicon)
  const linkRegex = /<link[^>]+href=["']([^"']+)["']/g;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (href.endsWith('.css')) {
      resources.css.add(href);
    } else if (href.match(/\.(ico|svg|png)$/)) {
      resources.images.add(href);
    } else {
      resources.other.add(href);
    }
  }
  
  // Extract script src
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
  while ((match = scriptRegex.exec(html)) !== null) {
    resources.js.add(match[1]);
  }
  
  return resources;
}

// Normalize path
function normalizePath(resourcePath) {
  let normalized = resourcePath.replace(/^\/www\/pr-\d+/, '');
  normalized = normalized.replace(/^\/www/, '');
  
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  return normalized;
}

// Check if resource exists
function checkResource(resourcePath, distDir) {
  // Skip external resources
  if (resourcePath.startsWith('http://') || resourcePath.startsWith('https://')) {
    return { exists: true, external: true };
  }
  
  const normalized = normalizePath(resourcePath);
  const filePath = path.join(distDir, normalized);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    return { 
      exists: true, 
      external: false, 
      size: stats.size,
      path: filePath 
    };
  }
  
  return { exists: false, external: false, attempted: filePath };
}

// Main validation
async function validateResources() {
  console.log('📦 Validating resources...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run build first.');
    process.exit(1);
  }
  
  const htmlFiles = getAllHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to check\n`);
  
  const missingResources = [];
  const allResources = {
    images: new Set(),
    css: new Set(),
    js: new Set(),
    other: new Set()
  };
  
  // Collect all resources from all HTML files
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    const resources = extractResources(html);
    
    // Check each resource type
    for (const [type, resourceSet] of Object.entries(resources)) {
      for (const resource of resourceSet) {
        allResources[type].add(resource);
        
        const check = checkResource(resource, distDir);
        
        if (!check.external && !check.exists) {
          missingResources.push({
            file: relativePath,
            type: type,
            resource: resource,
            attempted: check.attempted
          });
          results.failed++;
        } else if (!check.external) {
          results.passed++;
        }
      }
    }
  }
  
  // Check for favicon.svg specifically
  const faviconPath = path.join(distDir, 'favicon.svg');
  if (!fs.existsSync(faviconPath)) {
    missingResources.push({
      file: 'root',
      type: 'favicon',
      resource: '/favicon.svg',
      attempted: faviconPath
    });
    results.failed++;
  } else {
    results.passed++;
  }
  
  // Report missing resources
  if (missingResources.length > 0) {
    console.error('❌ MISSING RESOURCES FOUND:\n');
    missingResources.forEach(({ file, type, resource, attempted }) => {
      console.error(`  File: ${file}`);
      console.error(`  Type: ${type}`);
      console.error(`  Missing: ${resource}`);
      console.error(`  Attempted: ${attempted}\n`);
      results.errors.push(`Missing ${type} resource "${resource}" referenced in ${file}`);
    });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RESOURCE VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Images referenced: ${allResources.images.size}`);
  console.log(`CSS files referenced: ${allResources.css.size}`);
  console.log(`JS files referenced: ${allResources.js.size}`);
  console.log(`Other resources: ${allResources.other.size}`);
  console.log(`\n✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Resource validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ All resource validations PASSED');
    process.exit(0);
  }
}

validateResources().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
