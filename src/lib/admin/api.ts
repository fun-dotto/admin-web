import {
	type DescMethodUnary,
	fromJson,
	type JsonObject,
	toJson,
} from "@bufbuild/protobuf";
import { createServerFn } from "@tanstack/react-start";
import { findMethod, findResource, type ResourceOperation } from "./resources";

export type AdminRequest = {
	slug: string;
	operation: ResourceOperation;
	request: JsonObject;
};

/**
 * Admin API を呼び出すサーバー関数。
 * ADMIN_API_BASE_URL はサーバー側の環境変数なので、ブラウザからは直接呼ばずにここを経由する。
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
		const baseUrl = process.env.ADMIN_API_BASE_URL;
		if (!baseUrl) {
			throw new Error("ADMIN_API_BASE_URL が設定されていません");
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
