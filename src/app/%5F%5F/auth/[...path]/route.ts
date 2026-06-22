type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const firebaseAuthHelperOrigin = "https://swift2023groupc.firebaseapp.com";

async function proxyFirebaseAuthHelper(
  request: Request,
  { params }: RouteContext,
): Promise<Response> {
  const { path = [] } = await params;
  const requestUrl = new URL(request.url);
  const targetUrl = new URL(
    `/__/auth/${path.join("/")}${requestUrl.search}`,
    firebaseAuthHelperOrigin,
  );

  return fetch(
    new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      redirect: "manual",
    }),
  );
}

export const GET = proxyFirebaseAuthHelper;
export const POST = proxyFirebaseAuthHelper;
export const PUT = proxyFirebaseAuthHelper;
export const PATCH = proxyFirebaseAuthHelper;
export const DELETE = proxyFirebaseAuthHelper;
export const OPTIONS = proxyFirebaseAuthHelper;
export const HEAD = proxyFirebaseAuthHelper;
