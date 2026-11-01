import {
	createFileRoute,
	Link,
	notFound,
	useRouter,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { ResourceForm } from "#/components/admin/ResourceForm";
import { ResourcePageHeader } from "#/components/admin/ResourcePageHeader";
import { type FormValues, toFormValues } from "#/lib/admin/fields";
import { useReferenceOptions } from "#/lib/admin/references";
import {
	errorMessage,
	getResource,
	updateResource,
} from "#/lib/admin/requests";
import { findResource } from "#/lib/admin/resources";
import { decodeKey, getResourceView } from "#/lib/admin/view";

export const Route = createFileRoute("/$resource/$id/edit")({
	loader: async ({ params }) => {
		const resource = findResource(params.resource);
		if (!resource) throw notFound();
		const view = getResourceView(resource);
		if (!view.updateFields) throw notFound();
		return getResource(resource.slug, decodeKey(view.keyNames, params.id));
	},
	head: ({ params }) => ({
		meta: [
			{
				title: `編集 | ${params.id} | ${findResource(params.resource)?.label ?? "Not Found"} | Dotto Admin`,
			},
		],
	}),
	component: ResourceEditPage,
	notFoundComponent: () => (
		<p className="text-body">リソースが見つかりません。</p>
	),
});

function ResourceEditPage() {
	const { resource: slug, id } = Route.useParams();
	const { item, error: loadError } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const router = useRouter();

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>();

	// loader で存在確認済み
	const resource = findResource(slug);
	const view = resource && getResourceView(resource);
	const references = useReferenceOptions(view?.updateFields, Boolean(item));
	if (!resource || !view?.updateFields) return null;
	const fields = view.updateFields;

	const backToDetail = () =>
		navigate({ to: "/$resource/$id", params: { resource: slug, id } });

	const handleSubmit = async (values: FormValues) => {
		setSubmitting(true);
		setError(undefined);
		try {
			await updateResource(slug, decodeKey(view.keyNames, id), fields, values);
			await router.invalidate();
			await backToDetail();
		} catch (error) {
			setError(errorMessage(error));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<Link
				to="/$resource/$id"
				params={{ resource: slug, id }}
				className="flex items-center gap-1 self-start rounded-md text-body text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
			>
				<ChevronLeft className="size-4" />
				詳細に戻る
			</Link>
			<ResourcePageHeader
				title={`${resource.label}を編集`}
				description={`ID: ${id}`}
			/>
			{item ? (
				<div className="max-w-2xl rounded-lg border bg-card p-6">
					<ResourceForm
						fields={fields}
						defaultValues={toFormValues(fields, item)}
						references={references}
						submitting={submitting}
						error={error}
						onSubmit={handleSubmit}
						onCancel={backToDetail}
					/>
				</div>
			) : (
				<p className="text-body text-destructive">{loadError}</p>
			)}
		</div>
	);
}
