import { useEffect, useRef, useState } from "react";
import type {
	ReferenceOption,
	ReferenceOptionsState,
} from "#/components/admin/ResourceReferenceField";
import { callAdminApi } from "./api";
import type { FieldSpec } from "./fields";
import { errorMessage } from "./requests";
import {
	findResource,
	getDisplayField,
	getEntityListField,
	getKeyFields,
} from "./resources";

const PAGE_SIZE = 1000;
/** 取得件数の上限 (PAGE_SIZE × MAX_PAGES) */
const MAX_PAGES = 10;

/**
 * 参照先リソースを全件 (上限あり) 取得して選択肢にする。
 * List API に検索条件が無いため、絞り込みはクライアント側で行う。
 */
export async function fetchReferenceOptions(
	slug: string,
): Promise<ReferenceOption[]> {
	const resource = findResource(slug);
	if (!resource) return [];
	const listKey = getEntityListField(resource)?.jsonName ?? "";
	const keyName = getKeyFields(resource)[0]?.jsonName ?? "id";
	const displayName = getDisplayField(resource)?.jsonName;

	const options: ReferenceOption[] = [];
	let pageToken = "";
	for (let page = 0; page < MAX_PAGES; page++) {
		const response = await callAdminApi({
			data: {
				slug,
				operation: "list",
				request: { pageSize: PAGE_SIZE, pageToken },
			},
		});
		const items = Array.isArray(response[listKey]) ? response[listKey] : [];
		for (const item of items) {
			if (typeof item !== "object" || item === null || Array.isArray(item))
				continue;
			const value = String(item[keyName] ?? "");
			const label = displayName ? String(item[displayName] ?? "") : "";
			options.push({
				value,
				label: label || value,
				description: label ? value : undefined,
			});
		}
		pageToken =
			typeof response.nextPageToken === "string" ? response.nextPageToken : "";
		if (!pageToken) break;
	}
	return options;
}

/**
 * フォームの参照フィールドの選択肢を取得する。enabled の間だけ取得し、取得結果は保持する。
 * 戻り値はフィールド名 (proto3 JSON 名) ごとの状態。
 */
export function useReferenceOptions(
	fields: FieldSpec[] | undefined,
	enabled: boolean,
): Record<string, ReferenceOptionsState> {
	const [states, setStates] = useState<Record<string, ReferenceOptionsState>>(
		{},
	);
	const slugs = [
		...new Set(
			(fields ?? []).flatMap((field) =>
				field.reference ? [field.reference.slug] : [],
			),
		),
	];
	const slugsKey = slugs.join(",");

	// 取得開始済みの slug。エラー時は再取得できるよう削除する
	const requested = useRef(new Set<string>());

	useEffect(() => {
		if (!enabled || !slugsKey) return;
		for (const slug of slugsKey.split(",")) {
			if (requested.current.has(slug)) continue;
			requested.current.add(slug);
			setStates((current) => ({
				...current,
				[slug]: { options: [], loading: true },
			}));
			fetchReferenceOptions(slug)
				.then((options) =>
					setStates((current) => ({ ...current, [slug]: { options } })),
				)
				.catch((error) => {
					requested.current.delete(slug);
					setStates((current) => ({
						...current,
						[slug]: { options: [], error: errorMessage(error) },
					}));
				});
		}
	}, [enabled, slugsKey]);

	return Object.fromEntries(
		(fields ?? []).flatMap((field) =>
			field.reference
				? [
						[
							field.name,
							states[field.reference.slug] ?? { options: [], loading: true },
						],
					]
				: [],
		),
	);
}
