import { describe, expect, it } from "bun:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { $ } from "bun";

// Options left to TypeScript's defaults do not appear in `tsc --showConfig`.
// Compile a small project against each preset to check their effect instead.
const createProject = async (preset: string, files: Record<string, string>) => {
	const root = await mkdtemp(join(tmpdir(), "tsconfigs-"));
	const config = { extends: resolve(preset) };
	await writeFile(join(root, "tsconfig.json"), JSON.stringify(config));
	await Promise.all(
		Object.entries(files).map(async ([path, content]) => {
			await mkdir(join(root, path, ".."), { recursive: true });
			await writeFile(join(root, path), content);
		}),
	);
	return root;
};

const jsonImport = `import data from "./data.json" with { type: "json" };
export const value: number = data.value;
`;
const jsonData = '{ "value": 1 }\n';

describe("JSON modules resolve without resolveJsonModule", () => {
	for (const [preset, sourceDir] of [
		["presets/base.json", ""],
		["presets/bundler/base.json", ""],
		["presets/tsc/base.json", "src/"],
	] as const) {
		it(preset, async () => {
			const root = await createProject(preset, {
				[`${sourceDir}data.json`]: jsonData,
				[`${sourceDir}index.ts`]: jsonImport,
				// NodeNext treats files as CommonJS without this.
				"package.json": '{ "type": "module" }\n',
			});
			const result = await $`tsc --project ${root}`.nothrow().quiet();
			expect(result.stdout.toString()).toBe("");
			expect(result.exitCode).toBe(0);
		});
	}
});

it("checkJs in the bundler preset also type-checks JavaScript files", async () => {
	const root = await createProject("presets/bundler/base.json", {
		"index.js": '/** @type {number} */\nexport const value = "text";\n',
	});
	const result = await $`tsc --project ${root}`.nothrow().quiet();
	expect(result.stdout.toString()).toContain("index.js");
	expect(result.stdout.toString()).toContain("TS2322");
	expect(result.exitCode).not.toBe(0);
});
