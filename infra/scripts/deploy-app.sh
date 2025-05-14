#!/bin/bash

set -e

REPO_URL="https://github.com/anmol111pal/blog-app-api.git"
REPO_DIR="/home/ubuntu/app"

# Clone only if not already cloned
if [ ! -d "$REPO_DIR/.git" ]; then
    git clone $REPO_URL $REPO_DIR
else
    cd $REPO_DIR
    git pull --no-rebase origin master
fi

cd $REPO_DIR

echo "Installing dependencies"
npm install

echo "Building the application"
npx tsc
TS_EXIT_CODE=$?

if [ $TS_EXIT_CODE -ne 0 ]; then
  echo "TypeScript compilation failed with exit code $TS_EXIT_CODE"
  exit $TS_EXIT_CODE
fi

if [ ! -f "dist/index.js" ]; then
  echo "ERROR: dist/index.js not found. Compilation may have failed or not yet completed."
  echo "Contents of dist directory:"
  ls -l dist
  exit 1
fi


echo "Starting the Express application"
node dist/index.js > dist/app.log 2>&1 &
echo "Application started & you can view the logs in app.log"
