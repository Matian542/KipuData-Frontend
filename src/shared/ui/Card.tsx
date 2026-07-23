import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  interactivo?: boolean;
}

export function Card({ className = '', interactivo = false, ...props }: Props) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-150 ${
        interactivo ? 'cursor-pointer hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md' : ''
      } ${className}`}
      {...props}
    />
  );
}
