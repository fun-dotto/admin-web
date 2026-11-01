import { defineConfig } from "vitest/config";

// ユニットテスト用の設定。vite.config.ts の開発用プラグイン（devtools, nitro など）は読み込まない
export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		name: "unit",
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
});
