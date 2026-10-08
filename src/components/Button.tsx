import { cva } from 'class-variance-authority';

import { cn } from '#/lib/utils';

const buttonVariants = cva(
  'inline-block cursor-pointer rounded-full px-5 py-3 text-subtitle-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-brand',
  {
    variants: {
      primary: {
        true: 'bg-accent-brand text-label-tertiary',
        false: 'border border-border-primary bg-background-secondary text-label-primary',
      },
    },
    defaultVariants: { primary: false },
  },
);

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ primary }))}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};
