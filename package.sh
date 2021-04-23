#!/bin/bash

rm -rf node_modules
npm install --production
rm -rf node_modules/.bin

TARFILE=`npm pack`
tar xzf ${TARFILE}
cp -r node_modules ./package || true
pushd package
find . -type f -exec shasum --algorithm 256 {} \; >> SHA256SUMS
popd
tar czf ${TARFILE} package

shasum --algorithm 256 ${TARFILE} > ${TARFILE}.sha256sum

rm -rf SHA256SUMS package
