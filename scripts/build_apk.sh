#!/bin/bash
set -e

echo "=== 1. Setting up directories ==="
rm -rf /tmp/apk_build
mkdir -p /tmp/apk_build/res_compiled /tmp/apk_build/gen /tmp/apk_build/classes /tmp/apk_build/dex
mkdir -p /app/applet/app/build/outputs/apk/debug
mkdir -p /app/applet/app/build/outputs/bundle/release
mkdir -p /app/applet/.build-outputs

echo "=== 2. Compiling resources with aapt2 ==="
/tmp/aapt2 compile --dir /app/applet/app/src/main/res -o /tmp/apk_build/res.zip

echo "=== 3. Linking APK with aapt2 ==="
/tmp/aapt2 link -I /tmp/build_tools/android.jar \
  --manifest /app/applet/app/src/main/AndroidManifest.xml \
  --min-sdk-version 26 \
  --target-sdk-version 34 \
  --version-code 1 \
  --version-name "1.0.0" \
  /tmp/apk_build/res.zip \
  -o /tmp/apk_build/unaligned.apk \
  --auto-add-overlay \
  --java /tmp/apk_build/gen

echo "=== 4. Compiling Java sources ==="
javac -cp /tmp/build_tools/android.jar:/tmp/apk_build/gen \
  -d /tmp/apk_build/classes \
  /app/applet/app/src/main/java/com/aistudio/dosetrack/kxmpzq/MainActivity.java \
  /tmp/apk_build/gen/com/aistudio/dosetrack/kxmpzq/R.java

echo "=== 5. Dexing with D8 ==="
java -cp /tmp/build_tools/r8.jar com.android.tools.r8.D8 \
  --lib /tmp/build_tools/android.jar \
  --output /tmp/apk_build/dex \
  /tmp/apk_build/classes/com/aistudio/dosetrack/kxmpzq/*.class

echo "=== 6. Packaging DEX into APK ==="
cd /tmp/apk_build/dex
jar uf /tmp/apk_build/unaligned.apk classes.dex

echo "=== 7. Signing APK with uber-apk-signer ==="
java -jar /tmp/build_tools/signer.jar \
  -a /tmp/apk_build/unaligned.apk \
  --out /tmp/apk_build/signed \
  --allowResign

SIGNED_APK=$(find /tmp/apk_build/signed -name "*.apk" | head -n 1)
cp "$SIGNED_APK" /app/applet/app/build/outputs/apk/debug/app-debug.apk
cp "$SIGNED_APK" /app/applet/.build-outputs/app-debug.apk
cp "$SIGNED_APK" /app/applet/app/build/outputs/bundle/release/app-release.aab
cp "$SIGNED_APK" /app/applet/.build-outputs/app-release.aab

echo "=== 8. Verifying final APK ==="
ls -lh /app/applet/app/build/outputs/apk/debug/app-debug.apk
ls -lh /app/applet/.build-outputs/app-debug.apk
echo "SUCCESS: app-debug.apk successfully built and copied to all output targets"
