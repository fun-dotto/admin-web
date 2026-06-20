import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@/types/openapi";

const loggingMiddleware: Middleware = {
  async onRequest({ request }) {
    console.log(`[API Request] ${request.method} ${request.url}`);
    return request;
  },
  async onResponse({ request, response }) {
    console.log(`[API Response] ${request.method} ${request.url} -> ${response.status}`);
    return response;
  },
};

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    let token: string | undefined;

    if (typeof window !== "undefined") {
      // クライアントサイド: Firebase Authからトークンを取得
      const [{ getToken }, { appCheck, auth }] = await Promise.all([
        import("firebase/app-check"),
        import("@/lib/firebase"),
      ]);
      token = await auth.currentUser?.getIdToken();

      if (appCheck) {
        const appCheckToken = await getToken(appCheck);
        request.headers.set("X-Firebase-AppCheck", appCheckToken.token);
      }
    } else {
      // サーバーサイド: Cookieからトークンを取得
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("firebase-auth-token")?.value;
    }

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
};

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  querySerializer: {
    array: { style: "form", explode: false },
  },
});

api.use(loggingMiddleware);
api.use(authMiddleware);
