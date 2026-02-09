#!/bin/bash

# Initialize Git
git init

# Add all files (respecting .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: Smart Inventory SaaS MVP"

# Rename branch to main (standard practice)
git branch -M main

echo "✅ Local Git repository initialized and committed."
echo "📋 To push to GitHub, create a new repo at https://github.com/new and run:"
echo "   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git"
echo "   git push -u origin main"