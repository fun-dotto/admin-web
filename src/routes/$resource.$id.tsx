import type { JsonObject } from "@bufbuild/protobuf";
import {
	createFileRoute,
	Link,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteResourceDialog } from "#/components/admin/DeleteResourceDialog";
import { ResourceDetail } from "#/components/admin/ResourceDetail";
import { ResourceFormDialog } from "#/components/admin/ResourceFormDialog";
import { ResourcePageHeader } from "#/components/admin/ResourcePageHeader";
import { Button } from "#/components/ui/button";
import { callAdminApi } from "#/lib/admin/api";
import { type FormValues, formatCell, toFormValues } from "#/lib/admin/fields";
import { useReferenceOptions } from "#/lib/admin/references";
import {
	deleteResource,
	errorMessage,
	updateResource,
} from "#/lib/admin/requests";
import { findResource } from "#/lib/admin/resources";
import { decodeKey, getResourceView } from "#/lib/admin/view";

type DialogState = "closed" | "edit" | "delete";

export const Route = createFileRoute("/$resource/$id")({
	loader: async ({ params }) => {
		const resource = findResource(params.resource);
		if (!resource) throw notFound();
		try {
			const response = await callAdminApi({
				data: {
					slug: resource.slug,
					operation: "get",
					request: decodeKey(getResourceView(resource).keyNames, params.id),
				},
			});
			// Get レスポンスはリソース本体を 1 フィールドだけ持つ
			const item = Object.values(response).find(
				(value): value is JsonObject =>
					typeof value === "object" && value !== null && !Array.isArray(value),
			);
			return { item, error: item ? undefined : "データが見つかりません" };
		} catch (error) {
			return { item: undefined, error: errorMessage(error) };
		}
	},
	head: ({ params }) => ({
		meta: [
			{
				title: `${params.id} | ${findResource(params.resource)?.label ?? "Not Found"} | Dotto Admin`,
			},
		],
	}),
	component: ResourceDetailPage,
	notFoundComponent: () => (
		<p className="text-body">リソースが見つかりません。</p>
	),
});

function ResourceDetailPage() {
	const { resource: slug, id } = Route.useParams();
	const { item, error } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const router = useRouter();

	const [dialog, setDialog] = useState<DialogState>("closed");
	const [submitting, setSubmitting] = useState(false);
	const [mutationError, setMutationError] = useState<string>();

	// loader で存在確認済み
	const resource = findResource(slug);
	const view = resource && getResourceView(resource);
	const references = useReferenceOptions(view?.updateFields, dialog === "edit");
	if (!resource || !view) return null;
	const key = decodeKey(view.keyNames, id);

	const openDialog = (next: DialogState) => {
		setMutationError(undefined);
		setDialog(next);
	};

	const mutate = async (
		run: () => Promise<unknown>,
		onSuccess: () => Promise<void>,
	) => {
		setSubmitting(true);
		setMutationError(undefined);
		try {
			await run();
			setDialog("closed");
			await onSuccess();
		} catch (error) {
			setMutationError(errorMessage(error));
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdate = (values: FormValues) =>
		mutate(
			() => updateResource(slug, key, view.updateFields ?? [], values),
			() => router.invalidate(),
		);

	const handleDelete = () =>
		mutate(
			() => deleteResource(slug, key),
			() => navigate({ to: "/$resource", params: { resource: slug } }),
		);

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/$resource"
				params={{ resource: slug }}
				className="flex items-center gap-1 self-start rounded-md text-body text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
			>
				<ChevronLeft className="size-4" />
				{resource.label}一覧
			</Link>
			<ResourcePageHeader
				title={resource.label}
				description={`ID: ${id}`}
				actions={
					item && (
						<>
							{view.updateFields && (
								<Button variant="outline" onClick={() => openDialog("edit")}>
									<Pencil />
									編集
								</Button>
							)}
							{view.deletable && (
								<Button
									variant="destructive"
									onClick={() => openDialog("delete")}
								>
									<Trash2 />
									削除
								</Button>
							)}
						</>
					)
				}
			/>
			<ResourceDetail
				items={view.columns.map((column) => ({
					key: column.name,
					label: column.label,
					value:
						column.kind === "json"
							? JSON.stringify(item?.[column.name] ?? null, null, 2)
							: formatCell(column, item?.[column.name]),
				}))}
				error={error}
			/>
			{item && view.updateFields && (
				<ResourceFormDialog
					open={dialog === "edit"}
					onOpenChange={(open) => !open && setDialog("closed")}
					title={`${resource.label}を編集`}
					description={`ID: ${id}`}
					fields={view.updateFields}
					defaultValues={toFormValues(view.updateFields, item)}
					submitting={submitting}
					error={mutationError}
					references={references}
					onSubmit={handleUpdate}
				/>
			)}
			<DeleteResourceDialog
				open={dialog === "delete"}
				onOpenChange={(open) => !open && setDialog("closed")}
				target={id}
				deleting={submitting}
				error={mutationError}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
