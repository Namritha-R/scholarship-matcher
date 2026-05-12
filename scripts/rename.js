import fs from 'fs';
import path from 'path';

const files = [
  'README.md',
  'HOW_IT_WORKS.md',
  'DEPLOYMENT_GUIDE.md',
  'index.html',
  'js/utils/storage.js',
  'js/utils/helpers.js',
  'js/main.js',
  'js/components/hero.js',
  'css/index.css'
];

files.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace case sensitive
    content = content.replace(/ScholarPath/g, 'SkolarX');
    content = content.replace(/scholarpath/g, 'skolarx');
    fs.writeFileSync(filePath, content);
    console.log(`✅ Renamed in ${file}`);
  }
});

console.log("🎉 Renaming complete!");
