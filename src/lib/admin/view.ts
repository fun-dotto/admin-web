import type { JsonObject, JsonValue } from "@bufbuild/protobuf";
import type { ResourceNavGroup } from "#/components/admin/ResourceNav";
import { type FieldSpec, formatCell, getFieldSpecs } from "./fields";
import {
	findMethod,
	getEntityListField,
	getEntityMessage,
	type Resource,
	resources,
} from "./resources";

export function getNavGroups(): ResourceNavGroup[] {
	const groups = new Map<string, ResourceNavGroup>();
	for (const resource of resources) {
		const group = groups.get(resource.group) ?? {
			label: resource.group,
			items: [],
		};
		group.items.push({ slug: resource.slug, label: resource.label });
		groups.set(resource.group, group);
	}
	return [...groups.values()];
}

export type ResourceView = {
	columns: FieldSpec[];
	createFields?: FieldSpec[];
	updateFields?: FieldSpec[];
	deletable: boolean;
	listKey: string;
};

export function getResourceView(resource: Resource): ResourceView {
	const entity = getEntityMessage(resource);
	const create = findMethod(resource, "create");
	const update = findMethod(resource, "update");
	return {
		columns: entity ? getFieldSpecs(entity) : [],
		createFields: create && getFieldSpecs(create.input),
		updateFields: update && getFieldSpecs(update.input, { exclude: ["id"] }),
		deletable: Boolean(findMethod(resource, "delete")),
		listKey: getEntityListField(resource)?.jsonName ?? "",
	};
}

export function getItems(response: JsonObject, listKey: string): JsonObject[] {
	const items = response[listKey];
	return Array.isArray(items) ? (items as JsonObject[]) : [];
}

export function toRow(columns: FieldSpec[], item: JsonObject) {
	const cells: Record<string, string> = {};
	for (const column of columns) {
		cells[column.name] = formatCell(
			column,
			item[column.name] as JsonValue | undefined,
		);
	}
	return { id: String(item.id ?? ""), cells };
}
