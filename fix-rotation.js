const fs = require('fs');
let c = fs.readFileSync('daily-wine-fixed.js', 'utf8');
c = c.replace(
  'const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));\n  return WINE_DATABASE[dayOfYear % WINE_DATABASE.length];',
  'const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;\n  let hash = 0;\n  for (let i = 0; i < dateStr.length; i++) {\n    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);\n    hash = hash & hash;\n  }\n  return WINE_DATABASE[Math.abs(hash) % WINE_DATABASE.length];'
);
fs.writeFileSync('daily-wine-fixed.js', c);
console.log('Fixed wine rotation!');
