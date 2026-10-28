#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p tools/sdk
curl -L --fail -o tools/build-tools.zip https://dl.google.com/android/repository/build-tools_r35_linux.zip
curl -L --fail -o tools/platform.zip https://dl.google.com/android/repository/platform-35_r02.zip
curl -L --fail -o tools/ecj.jar https://repo.maven.apache.org/maven2/org/eclipse/jdt/ecj/3.38.0/ecj-3.38.0.jar
unzip -qo tools/build-tools.zip -d tools/sdk
unzip -qo tools/platform.zip -d tools/sdk
