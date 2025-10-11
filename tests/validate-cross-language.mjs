#!/usr/bin/env node

/**
 * Cross-Language Consistency Validation
 * - Verify all pages exist in all supported languages
 * - Check navigation consistency across language versions
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
    totalPages: 0,
    completePages: 0,
    partialPages: 0
  }
};

const LANGUAGES = ['en', 'ja', 'ru'];
const PORTALS = ['corporate', 'drift'];

// Get all HTML files grouped by language and portal
function getPageStructure() {
  const structure = {
    corporate: {
      en: new Set(),
      ja: new Set(),
      ru: new Set()
    },
    drift: {
      en: new Set(),
      ja: new Set(),
      ru: new Set()
    }
  };
  
  // Scan dist directory
  for (const lang of LANGUAGES) {
    // Corporate pages
    const corporatePath = path.join(distDir, lang);
    if (fs.existsSync(corporatePath)) {
      scanDirectory(corporatePath, '', structure.corporate[lang]);
    }
    
    // Drift pages
    const driftPath = path.join(distDir, 'drift', lang);
    if (fs.existsSync(driftPath)) {
      scanDirectory(driftPath, '', structure.drift[lang]);
    }
  }
  
  return structure;
}

function scanDirectory(dir, prefix, pageSet) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      scanDirectory(
        path.join(dir, entry.name),
        prefix ? `${prefix}/${entry.name}` : entry.name,
        pageSet
      );
    } else if (entry.name === 'index.html') {
      pageSet.add(prefix || 'index');
    }
  }
}

// Check page consistency across languages
function checkPageConsistency() {
  console.log('🌍 Checking cross-language page consistency...\n');
  
  const structure = getPageStructure();
  
  for (const portal of PORTALS) {
    console.log(`📂 ${portal.toUpperCase()} Portal:`);
    
    // Get all unique pages across all languages
    const allPages = new Set();
    for (const lang of LANGUAGES) {
      for (const page of structure[portal][lang]) {
        allPages.add(page);
      }
    }
    
    if (allPages.size === 0) {
      console.warn(`⚠️  No pages found for ${portal} portal\n`);
      results.warnings++;
      continue;
    }
    
    // Check each page exists in all languages
    const missingPages = [];
    const completePages = [];
    
    for (const page of allPages) {
      const existsIn = [];
      const missingIn = [];
      
      for (const lang of LANGUAGES) {
        if (structure[portal][lang].has(page)) {
          existsIn.push(lang);
        } else {
          missingIn.push(lang);
        }
      }
      
      if (missingIn.length > 0) {
        missingPages.push({
          page: page,
          existsIn: existsIn,
          missingIn: missingIn
        });
        results.stats.partialPages++;
        // Only treat as warning if page is missing in some but not all languages
        if (existsIn.includes('en')) {
          results.warnings++;
        } else {
          results.failed++;
        }
      } else {
        completePages.push(page);
        results.stats.completePages++;
        results.passed++;
      }
    }
    
    results.stats.totalPages += allPages.size;
    
    if (completePages.length > 0) {
      console.log(`✅ ${completePages.length} page(s) exist in all languages (${LANGUAGES.join(', ')})`);
    }
    
    if (missingPages.length > 0) {
      console.warn(`⚠️  ${missingPages.length} page(s) missing in some languages:`);
      missingPages.forEach(({ page, existsIn, missingIn }) => {
        const severity = existsIn.includes('en') ? '⚠️ ' : '❌';
        console.warn(`  ${severity} Page: "${page}"`);
        console.warn(`     Exists in: ${existsIn.join(', ')}`);
        console.warn(`     Missing in: ${missingIn.join(', ')}`);
        if (existsIn.includes('en')) {
          results.errors.push(`[Warning] Page "${page}" missing in ${missingIn.join(', ')} for ${portal} portal`);
        } else {
          results.errors.push(`[Critical] Page "${page}" missing in ${missingIn.join(', ')} for ${portal} portal`);
        }
      });
      console.log('');
      
      const enOnlyPages = missingPages.filter(p => p.existsIn.includes('en'));
      if (enOnlyPages.length > 0) {
        console.warn(`  💡 ${enOnlyPages.length} page(s) available only in English.`);
        console.warn(`     Consider adding translations for complete multi-language support.\n`);
      }
    } else {
      console.log(`  All pages are complete\n`);
    }
  }
}

// Extract navigation links from HTML
function extractNavLinks(html) {
  const links = new Set();
  
  // Look for navigation links in header/nav sections
  const navRegex = /<nav[^>]*>(.*?)<\/nav>/gis;
  const navMatch = navRegex.exec(html);
  
  if (navMatch) {
    const navContent = navMatch[1];
    const linkRegex = /href=["']([^"']+)["']/g;
    let match;
    
    while ((match = linkRegex.exec(navContent)) !== null) {
      const href = match[1];
      // Only internal links, skip external and special links
      if (!href.startsWith('http') && 
          !href.startsWith('mailto:') && 
          !href.startsWith('tel:') &&
          !href.startsWith('#')) {
        links.add(href);
      }
    }
  }
  
  return Array.from(links);
}

// Check navigation consistency
function checkNavigationConsistency() {
  console.log('🧭 Checking navigation consistency...\n');
  
  const structure = getPageStructure();
  
  for (const portal of PORTALS) {
    console.log(`📂 ${portal.toUpperCase()} Portal Navigation:`);
    
    // Get navigation from each language's index page
    const navStructures = {};
    
    for (const lang of LANGUAGES) {
      const indexPath = portal === 'corporate' 
        ? path.join(distDir, lang, 'index.html')
        : path.join(distDir, 'drift', lang, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf-8');
        const navLinks = extractNavLinks(html);
        navStructures[lang] = navLinks;
      }
    }
    
    // Compare navigation link counts
    const linkCounts = {};
    for (const [lang, links] of Object.entries(navStructures)) {
      linkCounts[lang] = links.length;
    }
    
    const counts = Object.values(linkCounts);
    const allSame = counts.every(c => c === counts[0]);
    
    if (!allSame) {
      console.warn(`⚠️  Navigation link count varies:`);
      for (const [lang, count] of Object.entries(linkCounts)) {
        console.warn(`    ${lang}: ${count} links`);
      }
      console.log('');
      results.warnings++;
    } else if (counts[0] > 0) {
      console.log(`✅ Navigation consistent: ${counts[0]} links in each language\n`);
      results.passed++;
    } else {
      console.warn(`⚠️  No navigation links found\n`);
      results.warnings++;
    }
  }
}

// Check language switcher presence
function checkLanguageSwitchers() {
  console.log('🔄 Checking language switcher presence...\n');
  
  const structure = getPageStructure();
  const issues = [];
  
  for (const portal of PORTALS) {
    for (const lang of LANGUAGES) {
      const indexPath = portal === 'corporate' 
        ? path.join(distDir, lang, 'index.html')
        : path.join(distDir, 'drift', lang, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf-8');
        
        // Check for links to other language versions
        const hasLanguageSwitcher = LANGUAGES.some(otherLang => {
          if (otherLang !== lang) {
            return html.includes(`/${otherLang}/`);
          }
          return true;
        });
        
        if (!hasLanguageSwitcher) {
          issues.push({
            portal: portal,
            lang: lang,
            issue: 'No language switcher found'
          });
          results.warnings++;
        } else {
          results.passed++;
        }
      }
    }
  }
  
  if (issues.length > 0) {
    console.warn('⚠️  Language switcher issues:');
    issues.forEach(({ portal, lang, issue }) => {
      console.warn(`  - ${portal}/${lang}: ${issue}`);
    });
    console.log('');
  } else {
    console.log('✅ All pages have language switchers\n');
  }
}

// Main validation
async function validateCrossLanguage() {
  console.log('🌐 Validating cross-language consistency...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: dist directory not found. Run build first.');
    process.exit(1);
  }
  
  checkPageConsistency();
  checkNavigationConsistency();
  checkLanguageSwitchers();
  
  // Summary
  console.log('='.repeat(60));
  console.log('CROSS-LANGUAGE CONSISTENCY SUMMARY');
  console.log('='.repeat(60));
  console.log(`📊 Statistics:`);
  console.log(`   Languages checked: ${LANGUAGES.join(', ')}`);
  console.log(`   Portals checked: ${PORTALS.join(', ')}`);
  console.log(`   Total pages: ${results.stats.totalPages}`);
  console.log(`   Complete (all languages): ${results.stats.completePages}`);
  console.log(`   Partial (some languages): ${results.stats.partialPages}`);
  console.log(`\n✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed > 0) {
    console.log('\n❌ Cross-language validation FAILED - Critical issues found');
    console.log(`   ${results.failed} critical issue(s) must be fixed`);
    process.exit(1);
  } else if (results.warnings > 0) {
    console.log('\n✅ Cross-language validation PASSED with warnings');
    console.log(`   ${results.warnings} non-critical issue(s) found`);
    if (results.warnings > 0) {
      console.log(`   💡 Some pages are available only in English - consider adding translations`);
    }
    process.exit(0);
  } else {
    console.log('\n✅ All cross-language validations PASSED');
    process.exit(0);
  }
}

validateCrossLanguage().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
