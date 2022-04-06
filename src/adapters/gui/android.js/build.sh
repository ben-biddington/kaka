#!/bin/bash
set -eou pipefail

cd ../../../../

npx tsc -p ./tsconfig.json --listEmittedFiles

echo "Compiling"

npx webpack --config ./webpack.config

cp "./dist/ui.solid.bundle.js" ./src/adapters/gui/android.js/build/assets
cp "./dist/adapters.bundle.js" ./src/adapters/gui/android.js/build/assets

cd - 

cd build

echo "Packing"

npx androidjs b --release

cd - 