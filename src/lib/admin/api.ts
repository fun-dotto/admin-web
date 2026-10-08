import {
	type DescMethodUnary,
	fromJson,
	type JsonObject,
	toJson,
} from "@bufbuild/protobuf";
import { createServerFn } from "@tanstack/react-start";
import { baseUrlEnvName, readAdminEnvironment } from "./environments";
import { findMethod, findResource, type ResourceOperation } from "./resources";

export type AdminRequest = {
	slug: string;
	operation: ResourceOperation;
	request: JsonObject;
};

/**
 * Admin API を呼び出すサーバー関数。
 * 接続先は Cookie で選択中の環境の ADMIN_API_BASE_URL_<ENV>（サーバー側の環境変数）で決まるので、
 * ブラウザからは直接呼ばずにここを経由する。
 */
export const callAdminApi = createServerFn({ method: "POST" })
	.inputValidator((data: AdminRequest) => data)
	.handler(async ({ data }): Promise<JsonObject> => {
		const { ConnectError } = await import("@connectrpc/connect");
		const { createConnectTransport } = await import("@connectrpc/connect-node");

		const resource = findResource(data.slug);
		const method = resource && findMethod(resource, data.operation);
		if (!method || method.methodKind !== "unary") {
			throw new Error(`未対応の操作です: ${data.slug}.${data.operation}`);
		}
		const envName = baseUrlEnvName(await readAdminEnvironment());
		const baseUrl = process.env[envName];
		if (!baseUrl) {
			throw new Error(`${envName} が設定されていません`);
		}

		// methodKind は上で検証済み
		const unary = method as DescMethodUnary;
		const transport = createConnectTransport({ baseUrl, httpVersion: "1.1" });
		try {
			const response = await transport.unary(
				unary,
				undefined,
				undefined,
				undefined,
				fromJson(unary.input, data.request),
			);
			return toJson(unary.output, response.message, {
				alwaysEmitImplicit: true,
			}) as JsonObject;
		} catch (error) {
			throw new Error(ConnectError.from(error).rawMessage);
		}
	});
