#!/usr/bin/env node

/**
 * Test Runner - Executes all validation tests
 * Run with: node tests/run-all-tests.mjs
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tests = [
  { name: 'Link Validation', script: 'validate-links.mjs', critical: false },
  { name: 'Resource Validation', script: 'validate-resources.mjs', critical: true },
  { name: 'Content Quality', script: 'validate-content.mjs', critical: false },
  { name: 'SEO & Meta Tags', script: 'validate-seo.mjs', critical: true },
  { name: 'Cross-Language Consistency', script: 'validate-cross-language.mjs', critical: false },
  { name: 'Booking Components', script: 'validate-booking-components.mjs', critical: true }
];

const results = [];

function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧪 Running: ${test.name}`);
    console.log('='.repeat(70));
    
    const startTime = Date.now();
    const scriptPath = path.join(__dirname, test.script);
    const proc = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    proc.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      results.push({
        name: test.name,
        passed: code === 0,
        critical: test.critical,
        duration: duration
      });
      
      if (code === 0) {
        console.log(`\n✅ ${test.name} completed successfully (${duration}s)`);
      } else {
        console.log(`\n❌ ${test.name} failed (${duration}s)`);
      }
      
      resolve();
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...\n');
  const totalStartTime = Date.now();
  
  // Run tests sequentially
  for (const test of tests) {
    await runTest(test);
  }
  
  const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
  
  // Print summary
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const criticalFailed = results.filter(r => !r.passed && r.critical).length;
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    const critical = result.critical ? '(critical)' : '(warning)';
    console.log(`${icon} ${result.name.padEnd(35)} ${result.duration}s ${result.critical ? critical : ''}`);
  });
  
  console.log('='.repeat(70));
  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed} (${criticalFailed} critical)`);
  console.log(`⏱️  Total time: ${totalDuration}s`);
  console.log('='.repeat(70));
  
  if (criticalFailed > 0) {
    console.log('\n❌ CRITICAL TESTS FAILED - Quality gate not passed');
    process.exit(1);
  } else if (failed > 0) {
    console.log('\n⚠️  Some non-critical tests failed - Review warnings');
    process.exit(0);
  } else {
    console.log('\n✅ ALL TESTS PASSED - Quality gate passed');
    process.exit(0);
  }
}

runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
