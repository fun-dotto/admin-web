import { createServerFn } from "@tanstack/react-start";

export const adminEnvironments = [
	{ id: "production", label: "Production" },
	{ id: "staging", label: "Staging" },
	{ id: "development", label: "Development" },
] as const;

export type AdminEnvironment = (typeof adminEnvironments)[number]["id"];

export const defaultAdminEnvironment: AdminEnvironment = "development";

const cookieName = "admin-environment";

export function isAdminEnvironment(value: unknown): value is AdminEnvironment {
	return adminEnvironments.some((environment) => environment.id === value);
}

/** 接続先環境ごとの Admin API のベース URL を指定する環境変数名 */
export function baseUrlEnvName(environment: AdminEnvironment) {
	return `ADMIN_API_BASE_URL_${environment.toUpperCase()}`;
}

/** 選択中の環境を Cookie から読む。サーバー側でのみ呼べる */
export async function readAdminEnvironment(): Promise<AdminEnvironment> {
	const { getCookie } = await import("@tanstack/react-start/server");
	const value = getCookie(cookieName);
	return isAdminEnvironment(value) ? value : defaultAdminEnvironment;
}

export const getAdminEnvironment = createServerFn({ method: "GET" }).handler(
	() => readAdminEnvironment(),
);

export const setAdminEnvironment = createServerFn({ method: "POST" })
	.inputValidator((data: AdminEnvironment) => {
		if (!isAdminEnvironment(data)) {
			throw new Error(`不明な環境です: ${String(data)}`);
		}
		return data;
	})
	.handler(async ({ data }) => {
		const { setCookie } = await import("@tanstack/react-start/server");
		setCookie(cookieName, data, {
			path: "/",
			sameSite: "lax",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 365,
		});
		return data;
	});
