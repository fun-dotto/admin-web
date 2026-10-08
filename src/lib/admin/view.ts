import type { JsonObject, JsonValue } from "@bufbuild/protobuf";
import type { ResourceNavGroup } from "#/components/admin/ResourceNav";
import { type FieldSpec, formatCell, getFieldSpecs } from "./fields";
import {
	findMethod,
	findReferenceTarget,
	getEntityListField,
	getEntityMessage,
	getKeyFields,
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
	/** 主キーを除いた更新可能な項目 */
	updateFields?: FieldSpec[];
	/** 主キーのフィールド名 (proto3 JSON 名) */
	keyNames: string[];
	deletable: boolean;
	listKey: string;
};

export function getResourceView(resource: Resource): ResourceView {
	const entity = getEntityMessage(resource);
	const create = findMethod(resource, "create");
	const update = findMethod(resource, "update");
	const keyFields = getKeyFields(resource);
	const resolveReference = (fieldName: string) => {
		const target = findReferenceTarget(resource, fieldName);
		return target && { slug: target.slug, label: target.label };
	};
	return {
		columns: entity ? getFieldSpecs(entity) : [],
		createFields: create && getFieldSpecs(create.input, { resolveReference }),
		updateFields:
			update &&
			getFieldSpecs(update.input, {
				exclude: keyFields.map((field) => field.name),
				resolveReference,
			}),
		keyNames: keyFields.map((field) => field.jsonName),
		deletable: Boolean(findMethod(resource, "delete")),
		listKey: getEntityListField(resource)?.jsonName ?? "",
	};
}

export function getItems(response: JsonObject, listKey: string): JsonObject[] {
	const items = response[listKey];
	return Array.isArray(items) ? (items as JsonObject[]) : [];
}

export function getItemKey(keyNames: string[], item: JsonObject): JsonObject {
	return Object.fromEntries(keyNames.map((name) => [name, item[name] ?? null]));
}

/**
 * 主キーを URL パラメータ用の文字列にする。
 * 単一の文字列キーはそのまま、複合キーや文字列以外は JSON にする。
 */
export function encodeKey(key: JsonObject): string {
	const values = Object.values(key);
	return values.length === 1 && typeof values[0] === "string"
		? values[0]
		: JSON.stringify(key);
}

export function decodeKey(keyNames: string[], encoded: string): JsonObject {
	if (keyNames.length === 1 && !encoded.startsWith("{")) {
		return { [keyNames[0]]: encoded };
	}
	try {
		return JSON.parse(encoded) as JsonObject;
	} catch {
		return {};
	}
}

export function toRow(view: ResourceView, item: JsonObject) {
	const cells: Record<string, string> = {};
	for (const column of view.columns) {
		cells[column.name] = formatCell(
			column,
			item[column.name] as JsonValue | undefined,
		);
	}
	return { id: encodeKey(getItemKey(view.keyNames, item)), cells };
}
