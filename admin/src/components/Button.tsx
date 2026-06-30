import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'danger' | 'ghost' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-teal-500 text-storm-950 hover:bg-teal-400 disabled:bg-teal-500/40',
  danger: 'bg-danger-500 text-paper-50 hover:bg-danger-400 disabled:bg-danger-500/40',
  ghost: 'bg-transparent text-paper-100 hover:bg-storm-700 border border-storm-600',
  outline: 'bg-transparent text-amber-400 border border-amber-500/40 hover:bg-amber-500/10',
};

export function Button({ variant = 'primary', isLoading, children, className = '', disabled, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-display text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
