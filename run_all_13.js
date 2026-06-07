const files = [
  'generate-sichuan_pairing.js', 'generate-canton_pairing.js',
  'generate-hotpot_pairing.js', 'generate-bbq_pairing.js',
  'generate-chinese_banquet_pairing.js',
  'generate-nebbiolo_dive.js', 'generate-sangiovese_dive.js',
  'generate-tempranillo_dive.js', 'generate-malbec_dive.js',
  'generate-grenache_dive.js', 'generate-gewurztraminer_dive.js',
  'generate-wine_storage_guide.js', 'generate-wine_tasting_101.js',
];

const {execSync} = require('child_process');

let success = 0;
let fail = 0;

for (const f of files) {
  console.log(`\n=== Running ${f} ===`);
  try {
    const out = execSync(`node "${f}"`, {timeout: 30000, encoding: 'utf-8'});
    console.log(out.trim());
    if (out.includes('media_id: undefined') || out.includes('❌')) {
      console.log(`  ❌ ${f} - FAILED`);
      fail++;
    } else {
      console.log(`  ✅ ${f} - OK`);
      success++;
    }
  } catch(e) {
    console.log(`  ❌ ${f} - ERROR: ${e.message}`);
    fail++;
  }
}

console.log(`\n===== Done: ${success} success, ${fail} failed =====`);
