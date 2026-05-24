const fs = require('fs');
let c = fs.readFileSync('generate-napa-region.js', 'utf8');
c = c.replace("require('form-form')", "require('form-data')");
fs.writeFileSync('generate-napa-region.js', c);
console.log('Fixed!');
