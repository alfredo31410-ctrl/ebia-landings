import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname } from "node:path";

const command = process.argv[2];
if (command !== "dev" && command !== "build") {
  throw new Error("next_command_must_be_dev_or_build");
}

const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next");
const args = [nextCli, command];
const env = { ...process.env };

// Windows Application Control can block the native SWC binary. The official
// WASM package plus Webpack preserves local development and validation without
// changing the Linux production build, which continues to use native SWC.
if (process.platform === "win32") {
  env.NEXT_TEST_WASM_DIR = dirname(
    require.resolve("@next/swc-wasm-nodejs"),
  );
  args.push("--webpack");
}

const result = spawnSync(process.execPath, args, {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
