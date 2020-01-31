#!/bin/bash -e

rm -rf node_modules

# If you have npm production dependencies, uncomment the following line
# npm install --production

shasum --algorithm 256 manifest.json package.json *.js LICENSE README.md > SHA256SUMS
find css js views -type f -exec shasum --algorithm 256 {} \; >> SHA256SUMS

# If you have npm production dependencies, uncomment the following line
# find node_modules \( -type f -o -type l \) -exec shasum --algorithm 256 {} \; >> SHA256SUMS

TARFILE=`npm pack`

# If you have npm production dependencies, uncomment the following 3 lines
# tar xzf ${TARFILE}
# cp -r node_modules ./package
# tar czf ${TARFILE} package

shasum --algorithm 256 ${TARFILE} > ${TARFILE}.sha256sum

rm -rf SHA256SUMS package
