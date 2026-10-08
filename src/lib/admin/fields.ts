import type { JsonObject, JsonValue } from "@bufbuild/protobuf";
import {
	type DescField,
	type DescMessage,
	ScalarType,
} from "@bufbuild/protobuf";

export type FieldKind =
	| "string"
	| "number"
	| "boolean"
	| "timestamp"
	| "date"
	| "enum"
	| "reference"
	| "json";

export type FieldOption = { value: string; label: string };

export type FieldSpec = {
	/** proto3 JSON のフィールド名 (lowerCamelCase) */
	name: string;
	label: string;
	kind: FieldKind;
	required: boolean;
	options?: FieldOption[];
	/** kind が reference のときの参照先リソース */
	reference?: FieldReference;
};

export type FieldReference = { slug: string; label: string };

export type FormValues = Record<string, string | boolean>;

/** 一覧・フォームで扱わないフィールド */
const hiddenFieldNames = new Set(["update_mask"]);

const numberScalars = new Set([
	ScalarType.INT32,
	ScalarType.INT64,
	ScalarType.UINT32,
	ScalarType.UINT64,
	ScalarType.SINT32,
	ScalarType.SINT64,
	ScalarType.FIXED32,
	ScalarType.FIXED64,
	ScalarType.SFIXED32,
	ScalarType.SFIXED64,
	ScalarType.FLOAT,
	ScalarType.DOUBLE,
]);

function toFieldSpec(field: DescField): FieldSpec {
	const base = {
		name: field.jsonName,
		label: field.name,
		required:
			field.fieldKind !== "list" &&
			field.fieldKind !== "map" &&
			!field.proto.proto3Optional,
	};
	switch (field.fieldKind) {
		case "scalar":
			if (field.scalar === ScalarType.BOOL) {
				return { ...base, kind: "boolean", required: false };
			}
			if (numberScalars.has(field.scalar)) {
				return { ...base, kind: "number" };
			}
			return {
				...base,
				kind: field.scalar === ScalarType.STRING ? "string" : "json",
			};
		case "enum":
			return {
				...base,
				kind: "enum",
				options: field.enum.values
					.filter((value) => value.number !== 0)
					.map((value) => ({ value: value.name, label: value.localName })),
			};
		case "message":
			if (field.message.typeName === "google.protobuf.Timestamp") {
				return { ...base, kind: "timestamp" };
			}
			if (field.message.typeName === "google.type.Date") {
				return { ...base, kind: "date" };
			}
			return { ...base, kind: "json" };
		default:
			return { ...base, kind: "json" };
	}
}

export type FieldSpecOptions = {
	exclude?: string[];
	/** 別リソースの ID を持つフィールドの参照先を返す */
	resolveReference?: (fieldName: string) => FieldReference | undefined;
};

export function getFieldSpecs(
	message: DescMessage,
	options: FieldSpecOptions = {},
): FieldSpec[] {
	const exclude = new Set([...hiddenFieldNames, ...(options.exclude ?? [])]);
	return message.fields
		.filter((field) => !exclude.has(field.name))
		.map((field) => {
			const spec = toFieldSpec(field);
			const reference =
				spec.kind === "string"
					? options.resolveReference?.(field.name)
					: undefined;
			return reference ? { ...spec, kind: "reference", reference } : spec;
		});
}

const pad = (value: number) => String(value).padStart(2, "0");

function isDateJson(
	value: JsonValue,
): value is { year: number; month: number; day: number } {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		"year" in value
	);
}

/** proto3 JSON の値を一覧表示用の文字列にする */
export function formatCell(
	spec: FieldSpec,
	value: JsonValue | undefined,
): string {
	if (value === undefined || value === null || value === "") return "";
	switch (spec.kind) {
		case "timestamp":
			return typeof value === "string"
				? new Date(value).toLocaleString("ja-JP")
				: "";
		case "date":
			return isDateJson(value)
				? `${value.year}-${pad(value.month)}-${pad(value.day)}`
				: "";
		case "enum":
			return (
				spec.options?.find((option) => option.value === value)?.label ??
				String(value)
			);
		case "boolean":
			return value ? "はい" : "いいえ";
		case "json":
			return JSON.stringify(value);
		default:
			return String(value);
	}
}

function toDateTimeLocal(value: string): string {
	const date = new Date(value);
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** proto3 JSON をフォームの初期値に変換する */
export function toFormValues(specs: FieldSpec[], json: JsonObject): FormValues {
	const values: FormValues = {};
	for (const spec of specs) {
		const value = json[spec.name];
		if (spec.kind === "boolean") {
			values[spec.name] = value === true;
		} else if (value === undefined || value === null) {
			values[spec.name] = "";
		} else if (spec.kind === "timestamp") {
			values[spec.name] =
				typeof value === "string" ? toDateTimeLocal(value) : "";
		} else if (spec.kind === "date") {
			values[spec.name] = formatCell(spec, value);
		} else if (spec.kind === "json") {
			values[spec.name] = JSON.stringify(value, null, 2);
		} else {
			values[spec.name] = String(value);
		}
	}
	return values;
}

/** フォームの値を proto3 JSON に変換する。不正な値があれば Error を投げる */
export function fromFormValues(
	specs: FieldSpec[],
	values: FormValues,
): JsonObject {
	const json: JsonObject = {};
	for (const spec of specs) {
		const value = values[spec.name];
		if (spec.kind === "boolean") {
			json[spec.name] = value === true;
			continue;
		}
		if (typeof value !== "string" || value === "") continue;
		switch (spec.kind) {
			case "number": {
				const number = Number(value);
				if (Number.isNaN(number))
					throw new Error(`${spec.label} は数値で入力してください`);
				json[spec.name] = number;
				break;
			}
			case "timestamp":
				json[spec.name] = new Date(value).toISOString();
				break;
			case "date": {
				const [year, month, day] = value.split("-").map(Number);
				json[spec.name] = { year, month, day };
				break;
			}
			case "json":
				try {
					json[spec.name] = JSON.parse(value);
				} catch {
					throw new Error(`${spec.label} は JSON 形式で入力してください`);
				}
				break;
			default:
				json[spec.name] = value;
		}
	}
	return json;
}
