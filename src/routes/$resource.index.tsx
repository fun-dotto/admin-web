import type { JsonObject } from "@bufbuild/protobuf";
import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { DeleteResourceDialog } from "#/components/admin/DeleteResourceDialog";
import { ResourceFormDialog } from "#/components/admin/ResourceFormDialog";
import { ResourcePageHeader } from "#/components/admin/ResourcePageHeader";
import { ResourcePagination } from "#/components/admin/ResourcePagination";
import { ResourceTable } from "#/components/admin/ResourceTable";
import { callAdminApi } from "#/lib/admin/api";
import { type FormValues, toFormValues } from "#/lib/admin/fields";
import { useReferenceOptions } from "#/lib/admin/references";
import {
	createResource,
	deleteResource,
	errorMessage,
	updateResource,
} from "#/lib/admin/requests";
import { findResource } from "#/lib/admin/resources";
import {
	decodeKey,
	getItemKey,
	getItems,
	getResourceView,
	toRow,
} from "#/lib/admin/view";

const PAGE_SIZE = 50;

type ResourceSearch = {
	/** これまでに辿ったページトークン。末尾が現在のページ */
	pageTokens?: string[];
};

type DialogState =
	| { type: "closed" }
	| { type: "create" }
	| { type: "edit"; item: JsonObject }
	| { type: "delete"; id: string };

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
	const router = useRouter();

	const [dialog, setDialog] = useState<DialogState>({ type: "closed" });
	const [submitting, setSubmitting] = useState(false);
	const [mutationError, setMutationError] = useState<string>();

	// loader で存在確認済み
	const resource = findResource(slug);
	const view = resource && getResourceView(resource);
	const createReferences = useReferenceOptions(
		view?.createFields,
		dialog.type === "create",
	);
	const updateReferences = useReferenceOptions(
		view?.updateFields,
		dialog.type === "edit",
	);
	if (!resource || !view) return null;
	const items = getItems(response, view.listKey);
	const nextPageToken =
		typeof response.nextPageToken === "string" ? response.nextPageToken : "";

	const openDialog = (next: DialogState) => {
		setMutationError(undefined);
		setDialog(next);
	};
	const closeDialog = () => setDialog({ type: "closed" });

	const mutate = async (run: () => Promise<unknown>) => {
		setSubmitting(true);
		setMutationError(undefined);
		try {
			await run();
			closeDialog();
			await router.invalidate();
		} catch (error) {
			setMutationError(errorMessage(error));
		} finally {
			setSubmitting(false);
		}
	};

	const handleCreate = (values: FormValues) =>
		mutate(() => createResource(slug, view.createFields ?? [], values));

	const handleUpdate = (item: JsonObject, values: FormValues) =>
		mutate(() =>
			updateResource(
				slug,
				getItemKey(view.keyNames, item),
				view.updateFields ?? [],
				values,
			),
		);

	const handleDelete = (id: string) =>
		mutate(() => deleteResource(slug, decodeKey(view.keyNames, id)));

	return (
		<div className="flex flex-col gap-6">
			<ResourcePageHeader
				title={resource.label}
				description={resource.service.typeName}
				onCreate={
					view.createFields ? () => openDialog({ type: "create" }) : undefined
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
				onEdit={
					view.updateFields
						? (id) => {
								const item = items.find(
									(candidate) => toRow(view, candidate).id === id,
								);
								if (item) openDialog({ type: "edit", item });
							}
						: undefined
				}
				onDelete={
					view.deletable
						? (id) => openDialog({ type: "delete", id })
						: undefined
				}
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
			{view.createFields && (
				<ResourceFormDialog
					open={dialog.type === "create"}
					onOpenChange={(open) => !open && closeDialog()}
					title={`${resource.label}を作成`}
					fields={view.createFields}
					submitLabel="作成"
					references={createReferences}
					submitting={submitting}
					error={mutationError}
					onSubmit={handleCreate}
				/>
			)}
			{view.updateFields && dialog.type === "edit" && (
				<ResourceFormDialog
					key={toRow(view, dialog.item).id}
					open
					onOpenChange={(open) => !open && closeDialog()}
					title={`${resource.label}を編集`}
					description={`ID: ${toRow(view, dialog.item).id}`}
					references={updateReferences}
					fields={view.updateFields}
					defaultValues={toFormValues(view.updateFields, dialog.item)}
					submitting={submitting}
					error={mutationError}
					onSubmit={(values) => handleUpdate(dialog.item, values)}
				/>
			)}
			<DeleteResourceDialog
				open={dialog.type === "delete"}
				onOpenChange={(open) => !open && closeDialog()}
				target={dialog.type === "delete" ? dialog.id : ""}
				deleting={submitting}
				error={mutationError}
				onConfirm={() => dialog.type === "delete" && handleDelete(dialog.id)}
			/>
		</div>
	);
}
