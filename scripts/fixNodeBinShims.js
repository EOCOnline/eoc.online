// Hugo's PostCSS resource transform (css.PostCSS) locates the "postcss"
// binary in node_modules/.bin and only recognizes it as a Node.js script if
// it's a symlink to a .js file, or the file itself starts with a Node.js
// shebang. npm satisfies this by symlinking node_modules/.bin/postcss
// straight to postcss-cli's entry file, but pnpm instead writes a POSIX
// shell wrapper that sets NODE_PATH before exec-ing node. Hugo's fallback
// parser for that wrapper format picks up the NODE_PATH assignment instead
// of the real entry point, so the build fails with:
//   binary "postcss" is not a Node.js script
// This is an open upstream bug: https://github.com/gohugoio/hugo/issues/14852
//
// Run after every install (see package.json "postinstall") to replace
// pnpm's shim with a symlink to the real entry point, matching what npm
// produces and what Hugo expects.

const fs = require("fs");
const path = require("path");

const bins = [{ name: "postcss", pkg: "postcss-cli" }];

for (const { name, pkg } of bins) {
  const binDir = path.join(__dirname, "..", "node_modules", ".bin");
  const shimPath = path.join(binDir, name);

  if (!fs.existsSync(shimPath)) continue;

  let pkgJsonPath;
  try {
    pkgJsonPath = require.resolve(`${pkg}/package.json`);
  } catch {
    continue;
  }

  const pkgDir = path.dirname(pkgJsonPath);
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const binField = typeof pkgJson.bin === "string" ? pkgJson.bin : pkgJson.bin[name];
  const entry = path.join(pkgDir, binField);

  if (!fs.existsSync(entry)) {
    console.warn(`fixNodeBinShims: entry point not found for "${name}" (${entry}), skipping`);
    continue;
  }

  fs.rmSync(shimPath, { force: true });

  try {
    fs.symlinkSync(path.relative(binDir, entry), shimPath);
  } catch (err) {
    // Symlinks need Developer Mode or admin rights on Windows; fall back to
    // a plain copy so local installs don't break. CI (Linux) always hits
    // the symlink path above, which is what Hugo actually needs.
    fs.copyFileSync(entry, shimPath);
    fs.chmodSync(shimPath, 0o755);
  }
}
