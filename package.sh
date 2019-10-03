#!/bin/bash

rm -f SHA256SUMS
sha256sum manifest.json package.json *.js LICENSE README.md > SHA256SUMS
find css js views -type f -exec sha256sum {} \; >> SHA256SUMS
npm pack
