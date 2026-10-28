#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
BT=tools/sdk/android-15
PLATFORM=tools/sdk/android-35/android.jar
mkdir -p build/classes dist
java -jar tools/ecj.jar -8 -nowarn -bootclasspath "$PLATFORM:$BT/core-lambda-stubs.jar" -d build/classes android/MainActivity.java
"$BT/aapt2" compile --dir android/res -o build/resources.zip
"$BT/aapt2" link -o build/base.apk -I "$PLATFORM" --manifest android/AndroidManifest.xml -R build/resources.zip -A web
jar_cf=build/classes.jar
python3 - <<'PY'
from pathlib import Path
import zipfile
with zipfile.ZipFile('build/classes.jar','w') as z:
 for p in Path('build/classes').rglob('*.class'): z.write(p,str(p.relative_to('build/classes')))
PY
"$BT/d8" --min-api 26 --lib "$PLATFORM" --output build "$jar_cf"
(cd build && zip -q base.apk classes.dex)
"$BT/zipalign" -f -p 4 build/base.apk build/aligned.apk
if [ ! -f tools/development.keystore ]; then
 keytool -genkeypair -keystore tools/development.keystore -storepass android -keypass android -alias development -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=ADN Salvaje Development'
fi
"$BT/apksigner" sign --ks tools/development.keystore --ks-pass pass:android --key-pass pass:android --ks-key-alias development --out dist/ADN-Salvaje.apk build/aligned.apk
"$BT/apksigner" verify --verbose dist/ADN-Salvaje.apk
