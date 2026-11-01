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
