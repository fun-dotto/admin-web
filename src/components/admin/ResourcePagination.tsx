import { ChevronLeft, ChevronRight } from "lucide-react";
import type * as React from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export type ResourcePaginationProps = React.ComponentProps<"nav"> & {
	page: number;
	hasPrevious: boolean;
	hasNext: boolean;
	onPrevious: () => void;
	onNext: () => void;
};

export function ResourcePagination({
	page,
	hasPrevious,
	hasNext,
	onPrevious,
	onNext,
	className,
	...props
}: ResourcePaginationProps) {
	return (
		<nav
			aria-label="ページ送り"
			className={cn("flex items-center justify-end gap-2", className)}
			{...props}
		>
			<Button
				variant="outline"
				size="sm"
				disabled={!hasPrevious}
				onClick={onPrevious}
			>
				<ChevronLeft />
				前へ
			</Button>
			<span className="text-body text-muted-foreground">{page} ページ</span>
			<Button variant="outline" size="sm" disabled={!hasNext} onClick={onNext}>
				次へ
				<ChevronRight />
			</Button>
		</nav>
	);
}
