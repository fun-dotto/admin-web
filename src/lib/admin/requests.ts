import type { JsonObject } from "@bufbuild/protobuf";
import { callAdminApi } from "./api";
import { type FieldSpec, type FormValues, fromFormValues } from "./fields";

export function errorMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

export function createResource(
	slug: string,
	fields: FieldSpec[],
	values: FormValues,
) {
	return callAdminApi({
		data: {
			slug,
			operation: "create",
			request: fromFormValues(fields, values),
		},
	});
}

/** フォームに表示したすべての項目を update_mask に指定して更新する */
export function updateResource(
	slug: string,
	key: JsonObject,
	fields: FieldSpec[],
	values: FormValues,
) {
	return callAdminApi({
		data: {
			slug,
			operation: "update",
			request: {
				...fromFormValues(fields, values),
				...key,
				updateMask: fields.map((field) => field.name).join(","),
			},
		},
	});
}

export function deleteResource(slug: string, key: JsonObject) {
	return callAdminApi({ data: { slug, operation: "delete", request: key } });
}

/** Get API でリソース本体を 1 件取得する */
export async function getResource(slug: string, key: JsonObject) {
	try {
		const response = await callAdminApi({
			data: { slug, operation: "get", request: key },
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
}
