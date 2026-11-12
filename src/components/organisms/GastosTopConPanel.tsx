'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GastosTable } from '@/components/organisms/GastosTable';
import type { Gasto } from '@/lib/types/gastos';
import { formatCurrency } from '@/lib/format';
import { ChevronRight, List, X } from 'lucide-react';

const TOP_N = 5;

interface GastosTopConPanelProps {
  gastos: Gasto[];
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Muestra solo los gastos más grandes del período y un botón "Ver todos"
 * que abre el listado completo (con filtros y acciones) en un panel lateral.
 */
export function GastosTopConPanel({ gastos }: GastosTopConPanelProps) {
  const [open, setOpen] = useState(false);

  const top = [...gastos]
    .sort((a, b) => Number(b.monto) - Number(a.monto))
    .slice(0, TOP_N);

  return (
    <>
      <Card>
        <CardContent className="space-y-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {gastos.length > TOP_N
                ? `Los ${TOP_N} gastos más grandes de ${gastos.length}`
                : `${gastos.length} ${gastos.length === 1 ? 'gasto' : 'gastos'}, del más grande al más pequeño`}
            </p>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              <List className="size-4" />
              Ver todos ({gastos.length})
            </Button>
          </div>

          <ul className="divide-y divide-border">
            {top.map((gasto) => (
              <li key={gasto.id}>
                <Link
                  href={`/finanzas/${gasto.id}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium transition-colors group-hover:text-primary">
                      {gasto.descripcion}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center rounded-full bg-[#FEA372]/10 px-2 py-0.5 font-medium text-[#2F3031] dark:text-foreground">
                        {gasto.categoria}
                      </span>
                      <span>{formatDate(gasto.fecha)}</span>
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(gasto.monto)}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-background text-foreground shadow-xl ring-1 ring-border duration-150 data-open:animate-in data-open:slide-in-from-right-full data-closed:animate-out data-closed:slide-out-to-right-full sm:max-w-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <DialogPrimitive.Title className="font-heading text-xl tracking-wide">
                Todos los gastos ({gastos.length})
              </DialogPrimitive.Title>
              <DialogPrimitive.Close
                render={<Button variant="ghost" size="icon-sm" />}
              >
                <X className="size-4" />
                <span className="sr-only">Cerrar</span>
              </DialogPrimitive.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <GastosTable gastos={gastos} />
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
