interface ClienteBadgeProps {
  tipo: 'B2B' | 'B2C' | 'PDV';
}

const badgeStyles: Record<'B2B' | 'B2C' | 'PDV', { pill: string; dot: string }> = {
  B2B: {
    pill: 'bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800',
    dot: 'bg-sky-500',
  },
  B2C: {
    pill: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800',
    dot: 'bg-emerald-500',
  },
  PDV: {
    pill: 'bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:ring-violet-800',
    dot: 'bg-violet-500',
  },
};

const badgeLabels: Record<'B2B' | 'B2C' | 'PDV', string> = {
  B2B: 'Empresa',
  B2C: 'Persona',
  PDV: 'PDV',
};

export function ClienteBadge({ tipo }: ClienteBadgeProps) {
  const style = badgeStyles[tipo];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style.pill}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden />
      {badgeLabels[tipo]}
    </span>
  );
}
