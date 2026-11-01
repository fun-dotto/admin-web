import { once } from "node:events";
import { createServer, type IncomingHttpHeaders, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { create } from "@bufbuild/protobuf";
import { ConnectError } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { afterEach, describe, expect, it } from "vitest";
import { ListStopsRequestSchema, StopService } from "#/api/admin/v1/stop_pb";
import {
	createCfAccessInterceptor,
	readCfAccessCredentials,
} from "./cf-access";

const credentials = { clientId: "id.access", clientSecret: "s3cr3t" };

describe("readCfAccessCredentials", () => {
	it("どちらも未設定なら undefined", () => {
		expect(readCfAccessCredentials({})).toBeUndefined();
		expect(
			readCfAccessCredentials({
				CF_ACCESS_CLIENT_ID: "",
				CF_ACCESS_CLIENT_SECRET: "",
			}),
		).toBeUndefined();
	});

	it("両方設定されていれば返す", () => {
		expect(
			readCfAccessCredentials({
				CF_ACCESS_CLIENT_ID: "id.access",
				CF_ACCESS_CLIENT_SECRET: "s3cr3t",
			}),
		).toEqual(credentials);
	});

	it("片方だけならエラー（secret は含めない）", () => {
		expect(() =>
			readCfAccessCredentials({ CF_ACCESS_CLIENT_ID: "id.access" }),
		).toThrow(/CF_ACCESS_CLIENT_SECRET が未設定/);
		expect(() =>
			readCfAccessCredentials({ CF_ACCESS_CLIENT_SECRET: "s3cr3t" }),
		).toThrow(/CF_ACCESS_CLIENT_ID が未設定/);
		try {
			readCfAccessCredentials({ CF_ACCESS_CLIENT_SECRET: "s3cr3t" });
		} catch (error) {
			expect(String(error)).not.toContain("s3cr3t");
		}
	});
});

describe("createCfAccessInterceptor", () => {
	let server: Server | undefined;
	afterEach(() => {
		server?.closeAllConnections();
		server?.close();
		server = undefined;
	});

	async function serve(
		handler: (
			headers: IncomingHttpHeaders,
		) => [number, Record<string, string>, string],
	) {
		const received: IncomingHttpHeaders[] = [];
		server = createServer((req, res) => {
			received.push(req.headers);
			req.resume();
			req.on("end", () => {
				const [status, headers, body] = handler(req.headers);
				res.writeHead(status, { ...headers, connection: "close" }).end(body);
			});
		});
		server.listen(0, "127.0.0.1");
		await once(server, "listening");
		const { port } = server.address() as AddressInfo;
		return { baseUrl: `http://127.0.0.1:${port}`, received };
	}

	function call(baseUrl: string, withToken: boolean) {
		const transport = createConnectTransport({
			baseUrl,
			httpVersion: "1.1",
			useBinaryFormat: false,
			interceptors: withToken ? [createCfAccessInterceptor(credentials)] : [],
		});
		return transport.unary(
			StopService.method.listStops,
			undefined,
			undefined,
			undefined,
			create(ListStopsRequestSchema),
		);
	}

	const ok = (): [number, Record<string, string>, string] => [
		200,
		{ "content-type": "application/json" },
		"{}",
	];

	it("Service Token のヘッダーを付ける", async () => {
		const { baseUrl, received } = await serve(ok);
		await call(baseUrl, true);
		expect(received[0]["cf-access-client-id"]).toBe("id.access");
		expect(received[0]["cf-access-client-secret"]).toBe("s3cr3t");
	});

	it("interceptor なしならヘッダーを付けない", async () => {
		const { baseUrl, received } = await serve(ok);
		await call(baseUrl, false);
		expect(received[0]["cf-access-client-id"]).toBeUndefined();
		expect(received[0]["cf-access-client-secret"]).toBeUndefined();
	});

	it("Access のログインページへのリダイレクトを分かるエラーにする", async () => {
		const { baseUrl } = await serve(() => [
			302,
			{
				location: "https://example.cloudflareaccess.com/cdn-cgi/access/login",
				"content-type": "text/html",
			},
			"<html></html>",
		]);
		const error = await call(baseUrl, true).catch((e) => e);
		expect(error).toBeInstanceOf(ConnectError);
		expect(error.rawMessage).toContain("Cloudflare Access");
		expect(error.rawMessage).not.toContain("s3cr3t");
	});

	it("HTML の 403 を分かるエラーにする", async () => {
		const { baseUrl } = await serve(() => [
			403,
			{ "content-type": "text/html; charset=UTF-8" },
			"<html>Forbidden</html>",
		]);
		const error = await call(baseUrl, true).catch((e) => e);
		expect(error.rawMessage).toContain("Cloudflare Access");
		expect(error.rawMessage).toContain("HTTP 403");
		expect(error.rawMessage).not.toContain("s3cr3t");
	});

	it("Connect のエラーはそのまま返す", async () => {
		const { baseUrl } = await serve(() => [
			404,
			{ "content-type": "application/json" },
			JSON.stringify({ code: "not_found", message: "stop not found" }),
		]);
		const error = await call(baseUrl, true).catch((e) => e);
		expect(error.rawMessage).toBe("stop not found");
	});
});
