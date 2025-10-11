#!/usr/bin/env node

/**
 * Content Quality Checks
 * - Detect duplicate content
 * - Check for missing translations
 * - Validate HTML structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const srcDir = path.join(__dirname, '../src');
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

// Extract main content (simplified - remove scripts, styles)
function extractMainContent(html) {
  // Remove script and style tags
  let content = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML tags but keep text
  content = content.replace(/<[^>]+>/g, ' ');
  
  // Normalize whitespace
  content = content.replace(/\s+/g, ' ').trim();
  
  return content;
}

// Check for duplicate content
function checkDuplicateContent(htmlFiles) {
  console.log('🔍 Checking for duplicate content...');
  
  const contentMap = new Map();
  const duplicates = [];
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    const content = extractMainContent(html);
    
    // Use content hash (simple length + first 100 chars)
    const contentSignature = `${content.length}:${content.substring(0, 100)}`;
    
    if (contentMap.has(contentSignature)) {
      duplicates.push({
        file1: contentMap.get(contentSignature),
        file2: relativePath,
        signature: contentSignature
      });
      results.warnings++;
    } else {
      contentMap.set(contentSignature, relativePath);
    }
  }
  
  if (duplicates.length > 0) {
    console.warn('⚠️  Potential duplicate content found:');
    duplicates.forEach(({ file1, file2 }) => {
      console.warn(`  - ${file1} ≈ ${file2}`);
    });
    console.log('');
  } else {
    console.log('✅ No duplicate content detected\n');
    results.passed++;
  }
}

// Check translation completeness in ui.ts
function checkTranslationCompleteness() {
  console.log('🌐 Checking translation completeness...');
  
  const uiPath = path.join(srcDir, 'i18n/ui.ts');
  if (!fs.existsSync(uiPath)) {
    console.error('❌ ui.ts not found');
    results.failed++;
    return;
  }
  
  const content = fs.readFileSync(uiPath, 'utf-8');
  
  // Extract the ui object structure
  const languages = ['en', 'ja', 'ru'];
  const translationKeys = new Set();
  const languageKeys = {};
  
  // Simple parsing - extract keys from each language section
  for (const lang of languages) {
    const langRegex = new RegExp(`${lang}:\\s*{([^}]+(?:{[^}]+}[^}]+)*)}`, 's');
    const match = content.match(langRegex);
    
    if (match) {
      const langContent = match[1];
      const keyRegex = /'([^']+)':/g;
      let keyMatch;
      
      languageKeys[lang] = new Set();
      
      while ((keyMatch = keyRegex.exec(langContent)) !== null) {
        const key = keyMatch[1];
        languageKeys[lang].add(key);
        translationKeys.add(key);
      }
    }
  }
  
  // Check if all languages have all keys
  const missingTranslations = [];
  
  for (const lang of languages) {
    const langKeys = languageKeys[lang] || new Set();
    
    for (const key of translationKeys) {
      if (!langKeys.has(key)) {
        missingTranslations.push({
          language: lang,
          key: key
        });
        results.warnings++;
      }
    }
  }
  
  if (missingTranslations.length > 0) {
    console.warn('⚠️  Missing translations found:');
    missingTranslations.forEach(({ language, key }) => {
      console.warn(`  - ${language}: "${key}"`);
    });
    console.log('');
  } else {
    console.log(`✅ All ${translationKeys.size} translation keys present in all languages\n`);
    results.passed++;
  }
}

// Validate HTML structure
function validateHtmlStructure(htmlFiles) {
  console.log('📝 Validating HTML structure...');
  
  const structureIssues = [];
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Skip redirect pages (they only have meta refresh)
    if (html.includes('http-equiv="refresh"') || html.length < 500) {
      continue;
    }
    
    // Check for basic structure
    const checks = [
      { name: 'DOCTYPE', regex: /<!DOCTYPE html>/i },
      { name: 'html tag', regex: /<html[\s>]/i },
      { name: 'head tag', regex: /<head[\s>]/i },
      { name: 'body tag', regex: /<body[\s>]/i },
      { name: 'title tag', regex: /<title[\s>]/i },
      { name: 'charset meta', regex: /<meta[^>]+charset=/i },
      { name: 'viewport meta', regex: /<meta[^>]+name="viewport"/i }
    ];
    
    for (const check of checks) {
      if (!check.regex.test(html)) {
        structureIssues.push({
          file: relativePath,
          issue: `Missing ${check.name}`
        });
        results.failed++;
      }
    }
  }
  
  if (structureIssues.length > 0) {
    console.error('❌ HTML structure issues found:');
    structureIssues.forEach(({ file, issue }) => {
      console.error(`  - ${file}: ${issue}`);
      results.errors.push(`${issue} in ${file}`);
    });
    console.log('');
  } else {
    console.log(`✅ All ${htmlFiles.length} HTML files have valid structure\n`);
    results.passed++;
  }
}

// Check for placeholder text
function checkPlaceholderText(htmlFiles) {
  console.log('📋 Checking for placeholder text...');
  
  const placeholders = [
    'Lorem ipsum',
    'TODO',
    'FIXME',
    'coming soon',
    'under construction'
  ];
  
  const found = [];
  
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(distDir, filePath);
    const html = fs.readFileSync(filePath, 'utf-8');
    
    for (const placeholder of placeholders) {
      if (html.toLowerCase().includes(placeholder.toLowerCase())) {
        found.push({
          file: relativePath,
          placeholder: placeholder
        });
        results.warnings++;
      }
    }
  }
  
  if (found.length > 0) {
    console.warn('⚠️  Placeholder text found:');
    found.forEach(({ file, placeholder }) => {
      console.warn(`  - ${file}: contains "${placeholder}"`);
    });
    console.log('');
  } else {
    console.log('✅ No placeholder text detected\n');
    results.passed++;
  }
}

// Main validation
async function validateContent() {
  console.log('📊 Validating content quality...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run build first.');
    process.exit(1);
  }
  
  const htmlFiles = getAllHtmlFiles(distDir);
  console.log(`Found ${htmlFiles.length} HTML files to check\n`);
  
  checkDuplicateContent(htmlFiles);
  checkTranslationCompleteness();
  validateHtmlStructure(htmlFiles);
  checkPlaceholderText(htmlFiles);
  
  // Summary
  console.log('='.repeat(60));
  console.log('CONTENT QUALITY SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Content validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ All content validations PASSED');
    if (results.warnings > 0) {
      console.log(`⚠️  Note: ${results.warnings} warnings found (non-critical)`);
    }
    process.exit(0);
  }
}

validateContent().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
