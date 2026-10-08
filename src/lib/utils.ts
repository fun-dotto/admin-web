import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// styles.css で定義した独自の font-size トークンを登録し、
// text-label-* などの文字色と競合して除去されないようにする
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'large-title',
        'title',
        'subtitle-1',
        'subtitle-2',
        'body',
        'caption-1',
        'caption-2',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
