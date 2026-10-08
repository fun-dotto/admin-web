// デザインシステムに合わせ、Tailwind 標準の text-* / font-semibold / bg-black をテーマトークン (text-body, text-caption-1, text-title, font-medium, bg-foreground) に置き換え
import { cn } from "#/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse rounded-md bg-accent", className)}
			{...props}
		/>
	);
}

export { Skeleton };
