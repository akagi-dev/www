#!/usr/bin/env node

/**
 * SEO and Meta Validation
 * - Check for missing meta descriptions
 * - Validate title tags
 * - Ensure proper language declarations
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

// Extract meta tags
function extractMetaTags(html) {
  const meta = {
    title: null,
    description: null,
    lang: null,
    viewport: null,
    charset: null
  };
  
  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    meta.title = titleMatch[1].trim();
  }
  
  // Extract description
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (descMatch) {
    meta.description = descMatch[1].trim();
  }
  
  // Extract lang attribute
  const langMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (langMatch) {
    meta.lang = langMatch[1];
  }
  
  // Extract viewport
  const viewportMatch = html.match(/<meta[^>]+name=["']viewport["']/i);
  meta.viewport = !!viewportMatch;
  
  // Extract charset
  const charsetMatch = html.match(/<meta[^>]+charset=/i);
  meta.charset = !!charsetMatch;
  
  return meta;
}

// Validate title tags
function validateTitles(htmlFiles) {
  console.log('📝 Validating title tags...');
  
  const issues = [];
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Skip redirect pages
    if (html.includes('http-equiv="refresh"') || html.length < 500) {
      continue;
    }
    
    const meta = extractMetaTags(html);
    
    if (!meta.title) {
      issues.push({
        file: relativePath,
        issue: 'Missing title tag'
      });
      results.failed++;
    } else if (meta.title.length < 10) {
      issues.push({
        file: relativePath,
        issue: `Title too short: "${meta.title}" (${meta.title.length} chars)`
      });
      results.warnings++;
    } else if (meta.title.length > 60) {
      issues.push({
        file: relativePath,
        issue: `Title too long: "${meta.title}" (${meta.title.length} chars, recommended < 60)`
      });
      results.warnings++;
    } else {
      results.passed++;
    }
  }
  
  if (issues.length > 0) {
    issues.forEach(({ file, issue }) => {
      if (issue.includes('Missing')) {
        console.error(`❌ ${file}: ${issue}`);
        results.errors.push(`${issue} in ${file}`);
      } else {
        console.warn(`⚠️  ${file}: ${issue}`);
      }
    });
    console.log('');
  } else {
    console.log(`✅ All ${htmlFiles.length} pages have valid titles\n`);
  }
}

// Validate meta descriptions
function validateDescriptions(htmlFiles) {
  console.log('📄 Validating meta descriptions...');
  
  const issues = [];
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Skip redirect pages
    if (html.includes('http-equiv="refresh"') || html.length < 500) {
      continue;
    }
    
    const meta = extractMetaTags(html);
    
    if (!meta.description) {
      issues.push({
        file: relativePath,
        issue: 'Missing meta description'
      });
      results.failed++;
    } else if (meta.description.length < 50) {
      issues.push({
        file: relativePath,
        issue: `Description too short: ${meta.description.length} chars (recommended 120-160)`
      });
      results.warnings++;
    } else if (meta.description.length > 160) {
      issues.push({
        file: relativePath,
        issue: `Description too long: ${meta.description.length} chars (recommended 120-160)`
      });
      results.warnings++;
    } else {
      results.passed++;
    }
  }
  
  if (issues.length > 0) {
    issues.forEach(({ file, issue }) => {
      if (issue.includes('Missing')) {
        console.error(`❌ ${file}: ${issue}`);
        results.errors.push(`${issue} in ${file}`);
      } else {
        console.warn(`⚠️  ${file}: ${issue}`);
      }
    });
    console.log('');
  } else {
    console.log(`✅ All ${htmlFiles.length} pages have valid descriptions\n`);
  }
}

// Validate language declarations
function validateLanguageDeclarations(htmlFiles) {
  console.log('🌐 Validating language declarations...');
  
  const issues = [];
  const expectedLangs = {
    '/en/': 'en',
    '/ja/': 'ja',
    '/ru/': 'ru'
  };
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Skip redirect pages
    if (html.includes('http-equiv="refresh"') || html.length < 500) {
      continue;
    }
    
    const meta = extractMetaTags(html);
    
    if (!meta.lang) {
      issues.push({
        file: relativePath,
        issue: 'Missing lang attribute on <html> tag'
      });
      results.failed++;
    } else {
      // Determine expected language from path
      let expectedLang = null;
      for (const [pathSegment, lang] of Object.entries(expectedLangs)) {
        if (relativePath.includes(pathSegment)) {
          expectedLang = lang;
          break;
        }
      }
      
      if (expectedLang && meta.lang !== expectedLang) {
        issues.push({
          file: relativePath,
          issue: `Language mismatch: expected "${expectedLang}", got "${meta.lang}"`
        });
        results.warnings++;
      } else {
        results.passed++;
      }
    }
  }
  
  if (issues.length > 0) {
    issues.forEach(({ file, issue }) => {
      if (issue.includes('Missing')) {
        console.error(`❌ ${file}: ${issue}`);
        results.errors.push(`${issue} in ${file}`);
      } else {
        console.warn(`⚠️  ${file}: ${issue}`);
      }
    });
    console.log('');
  } else {
    console.log(`✅ All ${htmlFiles.length} pages have correct language declarations\n`);
  }
}

// Validate essential meta tags
function validateEssentialMeta(htmlFiles) {
  console.log('🔖 Validating essential meta tags...');
  
  const issues = [];
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Skip redirect pages
    if (html.includes('http-equiv="refresh"') || html.length < 500) {
      continue;
    }
    
    const meta = extractMetaTags(html);
    
    if (!meta.charset) {
      issues.push({
        file: relativePath,
        issue: 'Missing charset meta tag'
      });
      results.failed++;
    }
    
    if (!meta.viewport) {
      issues.push({
        file: relativePath,
        issue: 'Missing viewport meta tag'
      });
      results.failed++;
    }
    
    if (meta.charset && meta.viewport) {
      results.passed++;
    }
  }
  
  if (issues.length > 0) {
    console.error('❌ Essential meta tags missing:');
    issues.forEach(({ file, issue }) => {
      console.error(`  - ${file}: ${issue}`);
      results.errors.push(`${issue} in ${file}`);
    });
    console.log('');
  } else {
    console.log(`✅ All ${htmlFiles.length} pages have essential meta tags\n`);
  }
}

// Main validation
async function validateSeo() {
  console.log('🔍 Validating SEO and meta tags...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run build first.');
    process.exit(1);
  }
  
  const htmlFiles = getAllHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to check\n`);
  
  validateTitles(htmlFiles);
  validateDescriptions(htmlFiles);
  validateLanguageDeclarations(htmlFiles);
  validateEssentialMeta(htmlFiles);
  
  // Summary
  console.log('='.repeat(60));
  console.log('SEO & META VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed > 0) {
    console.log('\n❌ SEO validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ All SEO validations PASSED');
    if (results.warnings > 0) {
      console.log(`⚠️  Note: ${results.warnings} warnings found (non-critical)`);
    }
    process.exit(0);
  }
}

validateSeo().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
