import { ConnectError, type Interceptor } from "@connectrpc/connect";

/**
 * Cloudflare Access の Service Token。
 * admin-api は Cloudflare Access の背後にあり、サーバーからの呼び出しにはこのトークンが必要。
 * secret を含むので、サーバー側（process.env）でのみ扱い、ブラウザに渡さないこと。
 */
export type CfAccessCredentials = {
	clientId: string;
	clientSecret: string;
};

export const cfAccessClientIdEnvName = "CF_ACCESS_CLIENT_ID";
export const cfAccessClientSecretEnvName = "CF_ACCESS_CLIENT_SECRET";

/**
 * 環境変数から Service Token を読む。
 * どちらも未設定なら undefined（ローカルの admin-api に直接つなぐ開発用）。
 * 片方だけ設定されている場合は設定ミスとしてエラーにする。
 */
export function readCfAccessCredentials(
	env: Record<string, string | undefined> = process.env,
): CfAccessCredentials | undefined {
	const clientId = env[cfAccessClientIdEnvName] || undefined;
	const clientSecret = env[cfAccessClientSecretEnvName] || undefined;
	if (!clientId && !clientSecret) {
		return undefined;
	}
	if (!clientId || !clientSecret) {
		const missing = clientId
			? cfAccessClientSecretEnvName
			: cfAccessClientIdEnvName;
		throw new Error(
			`${cfAccessClientIdEnvName} と ${cfAccessClientSecretEnvName} は両方設定してください（${missing} が未設定です）`,
		);
	}
	return { clientId, clientSecret };
}

/**
 * すべてのリクエストに Service Token のヘッダーを付ける interceptor。
 * Access の認証に失敗するとログインページへのリダイレクトや HTML が返るので、
 * 原因が分かるエラーに置き換える（secret はメッセージに含めない）。
 */
export function createCfAccessInterceptor(
	credentials: CfAccessCredentials,
): Interceptor {
	return (next) => async (request) => {
		request.header.set("CF-Access-Client-Id", credentials.clientId);
		request.header.set("CF-Access-Client-Secret", credentials.clientSecret);
		try {
			return await next(request);
		} catch (error) {
			throw toCfAccessError(error) ?? error;
		}
	};
}

/** Cloudflare Access に拒否されたと判断できるエラーなら、分かりやすいエラーに変換する */
export function toCfAccessError(error: unknown): ConnectError | undefined {
	if (!(error instanceof ConnectError)) {
		return undefined;
	}
	const contentType = error.metadata.get("content-type") ?? "";
	const location = error.metadata.get("location") ?? "";
	const isHtml = contentType.toLowerCase().includes("text/html");
	const isAccessRedirect = location.includes("cloudflareaccess.com");
	if (!isHtml && !isAccessRedirect) {
		return undefined;
	}
	return new ConnectError(
		`Cloudflare Access の認証に失敗した可能性があります（${error.rawMessage}）。${cfAccessClientIdEnvName} / ${cfAccessClientSecretEnvName} と ADMIN_API_URL の設定を確認してください`,
		error.code,
		error.metadata,
		undefined,
		error,
	);
}
