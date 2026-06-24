import { describe, expect, it } from "bun:test";
import { resolve } from "node:path";

import { $ } from "bun";

import { exports } from "../package.json" with { type: "json" };

const tsconfigPaths: string[] = [
	...new Set(
		Object.entries(exports)
			.filter(([exportPath]) => !exportPath.endsWith("package.json"))
			.map(([, configPath]) => configPath),
	),
];

describe("tsc --showConfig", async () => {
	for await (const path of tsconfigPaths) {
		it(path, async () => {
			const output = await $`tsc --showConfig --project ${path}`.text();
			const rootDir = resolve(path, "..");
			expect(output.replaceAll(rootDir, ".")).toMatchSnapshot();
		});
	}
});

describe("tsc", async () => {
	for await (const path of tsconfigPaths) {
		it(path, async () => {
			await $`tsc --project ${path}`;
		});
	}
});
