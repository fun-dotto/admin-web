import type { JsonObject } from "@bufbuild/protobuf";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ResourcePageHeader } from "#/components/admin/ResourcePageHeader";
import { ResourcePagination } from "#/components/admin/ResourcePagination";
import { ResourceTable } from "#/components/admin/ResourceTable";
import { callAdminApi } from "#/lib/admin/api";
import { errorMessage } from "#/lib/admin/requests";
import { findResource } from "#/lib/admin/resources";
import { getItems, getResourceView, toRow } from "#/lib/admin/view";

const PAGE_SIZE = 50;

type ResourceSearch = {
	/** これまでに辿ったページトークン。末尾が現在のページ */
	pageTokens?: string[];
};

export const Route = createFileRoute("/$resource/")({
	validateSearch: (search: Record<string, unknown>): ResourceSearch => ({
		pageTokens: Array.isArray(search.pageTokens)
			? search.pageTokens.filter(
					(token): token is string => typeof token === "string",
				)
			: undefined,
	}),
	loaderDeps: ({ search }) => ({ pageToken: search.pageTokens?.at(-1) ?? "" }),
	loader: async ({ params, deps }) => {
		const resource = findResource(params.resource);
		if (!resource) throw notFound();
		try {
			const response = await callAdminApi({
				data: {
					slug: resource.slug,
					operation: "list",
					request: { pageSize: PAGE_SIZE, pageToken: deps.pageToken },
				},
			});
			return { response, error: undefined };
		} catch (error) {
			return { response: {} as JsonObject, error: errorMessage(error) };
		}
	},
	head: ({ params }) => ({
		meta: [
			{
				title: `${findResource(params.resource)?.label ?? "Not Found"} | Dotto Admin`,
			},
		],
	}),
	component: ResourcePage,
	notFoundComponent: () => (
		<p className="text-body">リソースが見つかりません。</p>
	),
});

function ResourcePage() {
	const { resource: slug } = Route.useParams();
	const { pageTokens = [] } = Route.useSearch();
	const { response, error } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	// loader で存在確認済み
	const resource = findResource(slug);
	const view = resource && getResourceView(resource);
	if (!resource || !view) return null;
	const items = getItems(response, view.listKey);
	const nextPageToken =
		typeof response.nextPageToken === "string" ? response.nextPageToken : "";

	return (
		<div className="flex flex-col gap-6">
			<ResourcePageHeader
				title={resource.label}
				description={resource.service.typeName}
				onCreate={
					view.createFields
						? () =>
								navigate({ to: "/$resource/new", params: { resource: slug } })
						: undefined
				}
			/>
			<ResourceTable
				columns={view.columns.map((column) => ({
					key: column.name,
					label: column.label,
				}))}
				resourceSlug={slug}
				rows={items.map((item) => toRow(view, item))}
				error={error}
			/>
			<ResourcePagination
				page={pageTokens.length + 1}
				hasPrevious={pageTokens.length > 0}
				hasNext={nextPageToken !== ""}
				onPrevious={() =>
					navigate({ search: { pageTokens: pageTokens.slice(0, -1) } })
				}
				onNext={() =>
					navigate({ search: { pageTokens: [...pageTokens, nextPageToken] } })
				}
			/>
		</div>
	);
}
