const fs = require('fs');
const path = require('path');

const dirs = [
  'src/config',
  'src/controllers',
  'src/repositories',
  'src/routes',
  'src/services',
  'src/components'
];

const filesToMove = {
  'db.js': 'src/config/db.js',
  'inventoryRepository.js': 'src/repositories/inventoryRepository.js',
  'aiService.js': 'src/services/aiService.js',
  'inventoryService.js': 'src/services/inventoryService.js',
  'analyticsController.js': 'src/controllers/analyticsController.js',
  'analyticsRoutes.js': 'src/routes/analyticsRoutes.js',
  'Dashboard.jsx': 'src/components/Dashboard.jsx'
};

// Create directories
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Move files
Object.entries(filesToMove).forEach(([src, dest]) => {
  const srcPath = path.join(__dirname, src);
  const destPath = path.join(__dirname, dest);
  
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
    console.log(`Moved ${src} -> ${dest}`);
  } else if (fs.existsSync(destPath)) {
    console.log(`File already in place: ${dest}`);
  } else {
    console.log(`Note: ${src} not found (might already be moved).`);
  }
});

console.log('Project structure organized successfully.');