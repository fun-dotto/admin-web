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
import type { FormValues } from "#/lib/admin/fields";
import { useReferenceOptions } from "#/lib/admin/references";
import { createResource, errorMessage } from "#/lib/admin/requests";
import { findResource } from "#/lib/admin/resources";
import { getResourceView } from "#/lib/admin/view";

export const Route = createFileRoute("/$resource/new")({
	loader: ({ params }) => {
		const resource = findResource(params.resource);
		if (!resource || !getResourceView(resource).createFields) throw notFound();
	},
	head: ({ params }) => ({
		meta: [
			{
				title: `新規作成 | ${findResource(params.resource)?.label ?? "Not Found"} | Dotto Admin`,
			},
		],
	}),
	component: ResourceCreatePage,
	notFoundComponent: () => (
		<p className="text-body">リソースが見つかりません。</p>
	),
});

function ResourceCreatePage() {
	const { resource: slug } = Route.useParams();
	const navigate = Route.useNavigate();
	const router = useRouter();

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>();

	// loader で存在確認済み
	const resource = findResource(slug);
	const view = resource && getResourceView(resource);
	const references = useReferenceOptions(view?.createFields, true);
	if (!resource || !view?.createFields) return null;
	const fields = view.createFields;

	const backToList = () =>
		navigate({ to: "/$resource", params: { resource: slug } });

	const handleSubmit = async (values: FormValues) => {
		setSubmitting(true);
		setError(undefined);
		try {
			await createResource(slug, fields, values);
			await router.invalidate();
			await backToList();
		} catch (error) {
			setError(errorMessage(error));
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
				title={`${resource.label}を作成`}
				description="各項目を入力してください。"
			/>
			<div className="max-w-2xl rounded-lg border bg-card p-6">
				<ResourceForm
					fields={fields}
					submitLabel="作成"
					references={references}
					submitting={submitting}
					error={error}
					onSubmit={handleSubmit}
					onCancel={backToList}
				/>
			</div>
		</div>
	);
}
