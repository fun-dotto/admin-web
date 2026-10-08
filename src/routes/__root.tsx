import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import * as React from "react";
import { AdminShell } from "#/components/admin/AdminShell";
import { EnvironmentSelect } from "#/components/admin/EnvironmentSelect";
import { ResourceNav } from "#/components/admin/ResourceNav";
import {
	adminEnvironments,
	getAdminEnvironment,
	isAdminEnvironment,
	setAdminEnvironment,
} from "#/lib/admin/environments";
import { getNavGroups } from "#/lib/admin/view";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Dotto Admin",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{ rel: "icon", href: "/icon.png", type: "image/png", sizes: "1024x1024" },
		],
	}),
	loader: async () => ({ environment: await getAdminEnvironment() }),
	shellComponent: RootDocument,
	component: RootLayout,
});

function RootLayout() {
	const { environment } = Route.useLoaderData();
	const router = useRouter();
	const [pending, startTransition] = React.useTransition();

	const changeEnvironment = (value: string) => {
		if (!isAdminEnvironment(value)) return;
		startTransition(async () => {
			await setAdminEnvironment({ data: value });
			await router.invalidate();
		});
	};

	return (
		<AdminShell
			nav={<ResourceNav groups={getNavGroups()} />}
			environment={environment}
			sidebarHeader={
				<EnvironmentSelect
					options={adminEnvironments}
					value={environment}
					onValueChange={changeEnvironment}
					loading={pending}
				/>
			}
		>
			<Outlet />
		</AdminShell>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
