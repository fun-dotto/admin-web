import { createFileRoute } from "@tanstack/react-router";
import { ResourceCard } from "#/components/admin/ResourceCard";
import { ResourcePageHeader } from "#/components/admin/ResourcePageHeader";
import { getNavGroups } from "#/lib/admin/view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="flex flex-col gap-8">
			<ResourcePageHeader
				title="ダッシュボード"
				description="管理するリソースを選択してください。"
			/>
			{getNavGroups().map((group) => (
				<section key={group.label} className="flex flex-col gap-3">
					<h2 className="text-title">{group.label}</h2>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{group.items.map((item) => (
							<ResourceCard
								key={item.slug}
								slug={item.slug}
								label={item.label}
							/>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
