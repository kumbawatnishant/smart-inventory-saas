const fs = require('fs');
const path = require('path');

const middlewareDir = path.join(__dirname, 'src', 'middleware');
const controllerDir = path.join(__dirname, 'src', 'controllers');
const targetFile = path.join(middlewareDir, 'authMiddleware.js');
const sourceFile = path.join(controllerDir, 'authMiddleware.js');

// Ensure src/middleware exists
if (!fs.existsSync(middlewareDir)) {
  fs.mkdirSync(middlewareDir, { recursive: true });
  console.log('Created directory: src/middleware');
}

// Move the file if it exists in the wrong place
if (fs.existsSync(sourceFile)) {
  fs.renameSync(sourceFile, targetFile);
  console.log('Moved authMiddleware.js from src/controllers to src/middleware');
} else if (!fs.existsSync(targetFile)) {
  // If it's not in source and not in target, create it
  const content = `const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};`;
  fs.writeFileSync(targetFile, content);
  console.log('Created src/middleware/authMiddleware.js');
} else {
  console.log('authMiddleware.js is already in the correct location.');
}