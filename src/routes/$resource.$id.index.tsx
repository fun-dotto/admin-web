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
import { ResourcePageHeader } from "#/components/admin/ResourcePageHeader";
import { Button } from "#/components/ui/button";
import { formatCell } from "#/lib/admin/fields";
import {
	deleteResource,
	errorMessage,
	getResource,
} from "#/lib/admin/requests";
import { findResource } from "#/lib/admin/resources";
import { decodeKey, getResourceView } from "#/lib/admin/view";

export const Route = createFileRoute("/$resource/$id/")({
	loader: async ({ params }) => {
		const resource = findResource(params.resource);
		if (!resource) throw notFound();
		return getResource(
			resource.slug,
			decodeKey(getResourceView(resource).keyNames, params.id),
		);
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

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [mutationError, setMutationError] = useState<string>();

	// loader で存在確認済み
	const resource = findResource(slug);
	const view = resource && getResourceView(resource);
	if (!resource || !view) return null;
	const key = decodeKey(view.keyNames, id);

	const handleDelete = async () => {
		setSubmitting(true);
		setMutationError(undefined);
		try {
			await deleteResource(slug, key);
			setDeleteOpen(false);
			await router.invalidate();
			await navigate({ to: "/$resource", params: { resource: slug } });
		} catch (error) {
			setMutationError(errorMessage(error));
		} finally {
			setSubmitting(false);
		}
	};

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
								<Button variant="outline" asChild>
									<Link
										to="/$resource/$id/edit"
										params={{ resource: slug, id }}
									>
										<Pencil />
										編集
									</Link>
								</Button>
							)}
							{view.deletable && (
								<Button
									variant="destructive"
									onClick={() => {
										setMutationError(undefined);
										setDeleteOpen(true);
									}}
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
			<DeleteResourceDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				target={id}
				deleting={submitting}
				error={mutationError}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
