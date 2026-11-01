import type { FieldSpec } from "#/lib/admin/fields";

/** Story 用のサンプルデータ */
export const sampleFields: FieldSpec[] = [
	{ name: "title", label: "title", kind: "string", required: true },
	{ name: "url", label: "url", kind: "string", required: true },
	{ name: "priority", label: "priority", kind: "number", required: true },
	{
		name: "grade",
		label: "grade",
		kind: "enum",
		required: false,
		options: [
			{ value: "GRADE_B1", label: "B1" },
			{ value: "GRADE_B2", label: "B2" },
		],
	},
	{
		name: "availableFrom",
		label: "available_from",
		kind: "timestamp",
		required: true,
	},
	{ name: "date", label: "date", kind: "date", required: false },
	{
		name: "subjectId",
		label: "subject_id",
		kind: "reference",
		required: true,
		reference: { slug: "subjects", label: "科目" },
	},
	{
		name: "isPublished",
		label: "is_published",
		kind: "boolean",
		required: false,
	},
	{ name: "metadata", label: "metadata", kind: "json", required: false },
];

export const longText =
	"とても長い文字列がここに入ります。折り返しや省略表示が正しく行われるかを確認するためのテキストです。".repeat(
		3,
	);

export const sampleReferences = {
	subjectId: {
		options: [
			{ value: "subject-1", label: "情報処理演習", description: "subject-1" },
			{ value: "subject-2", label: "線形代数学", description: "subject-2" },
		],
	},
};
