import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const privateDir = ".calendar-local";
const env = privateDir + "/accounts.env";
mkdirSync(privateDir, { recursive: true });
if (!existsSync(env)) {
    const keys = ["DB_PASSWORD", "SZYMEK_PASSWORD", "OLIWUSIA_PASSWORD"];
    writeFileSync(env, keys.map((key) => key + "=" + randomBytes(18).toString("hex")).join("\n") + "\n", {
        flag: "wx",
        mode: 0o600,
    });
}
function run(command, args) {
    const result = spawnSync(command, args, { stdio: "inherit", shell: false });
    if (result.status !== 0) process.exit(result.status ?? 1);
}
run("docker", [
    "run",
    "--rm",
    "-v",
    resolve("backend") + ":/app",
    "-w",
    "/app",
    "composer:2",
    "install",
    "--no-dev",
    "--no-interaction",
    "--ignore-platform-req=ext-mbstring",
]);
run(process.execPath, [process.env.npm_execpath, "run", "build"]);
run("docker", ["compose", "--env-file", env, "up", "--build", "-d", "--wait"]);
console.log(
    "Kalendarz: http://localhost:8088/kalendarz/\nLoginy: szymek, oliwusia. Hasła lokalne: " + resolve(env),
);
