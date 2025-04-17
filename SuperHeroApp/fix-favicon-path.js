const fs = require('fs');
const path = './dist/index.html';

let html = fs.readFileSync(path, 'utf8');

// Replace absolute favicon path with relative path
html = html.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');

fs.writeFileSync(path, html);
console.log('✅ Fixed favicon path to be relative.');
