export type EnvironmentKey = "local" | "dev" | "stg" | "prd";

export type Environment = {
  key: EnvironmentKey;
  label: string;
  url: string;
};

export const environments: Environment[] = [
  {
    key: "local",
    label: "Local",
    url: "http://localhost:3000",
  },
  {
    key: "dev",
    label: "Development",
    url: process.env.NEXT_PUBLIC_APP_URL_DEV ?? "",
  },
  {
    key: "stg",
    label: "Staging",
    url: process.env.NEXT_PUBLIC_APP_URL_STG ?? "",
  },
  {
    key: "prd",
    label: "Production",
    url: process.env.NEXT_PUBLIC_APP_URL_PRD ?? "",
  },
];

export function detectCurrentEnvironment(origin: string): EnvironmentKey {
  const normalize = (url: string) => url.replace(/\/$/, "");
  const current = normalize(origin);

  if (
    current.startsWith("http://localhost") ||
    current.startsWith("http://127.0.0.1")
  ) {
    return "local";
  }

  const match = environments.find(
    (env) => env.url && normalize(env.url) === current,
  );
  return match?.key ?? "local";
}
