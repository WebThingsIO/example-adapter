#!/bin/bash

rm -f SHA256SUMS
sha256sum manifest.json package.json *.js LICENSE README.md > SHA256SUMS
npm pack
