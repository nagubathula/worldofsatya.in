const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  const newContent = content.replace(/dark:[^\s"']+/g, '');
  if (content !== newContent) {
    fs.writeFileSync(p, newContent);
    console.log(`Updated ${p}`);
  }
});
