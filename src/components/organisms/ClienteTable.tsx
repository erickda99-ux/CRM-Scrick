'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClienteBadge } from '@/components/molecules/ClienteBadge';
import { DeleteClienteDialog } from '@/components/organisms/DeleteClienteDialog';
import type { Cliente } from '@/lib/types/clientes';
import { Eye, Mail, MapPin, Pencil, Phone, Search, Trash2, X } from 'lucide-react';

interface ClienteTableProps {
  clientes: Cliente[];
}

type TipoFiltro = 'todos' | Cliente['tipo'];

const TIPO_OPCIONES: { value: TipoFiltro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'B2C', label: 'Personas' },
  { value: 'B2B', label: 'Empresas' },
  { value: 'PDV', label: 'PDV' },
];

const AVATAR_COLORS = [
  'bg-orange-100 text-orange-800',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-sky-100 text-sky-800',
  'bg-violet-100 text-violet-800',
  'bg-rose-100 text-rose-800',
];

function iniciales(nombre: string) {
  const partes = nombre
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (partes.length === 0) return '?';
  const primera = partes[0][0] ?? '';
  const segunda = partes.length > 1 ? partes[partes.length - 1][0] ?? '' : '';
  return (primera + segunda).toUpperCase();
}

function colorAvatar(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function ClienteTable({ clientes }: ClienteTableProps) {
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<TipoFiltro>('todos');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    nombre: string;
  }>({ open: false, id: '', nombre: '' });

  const conteos = useMemo(() => {
    const c: Record<TipoFiltro, number> = {
      todos: clientes.length,
      B2C: 0,
      B2B: 0,
      PDV: 0,
    };
    for (const cliente of clientes) c[cliente.tipo] += 1;
    return c;
  }, [clientes]);

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    return clientes.filter((cliente) => {
      if (tipo !== 'todos' && cliente.tipo !== tipo) return false;
      if (!q) return true;
      const campos = [
        cliente.nombre,
        cliente.email,
        cliente.telefono,
        cliente.ciudad,
        cliente.empresa,
      ];
      return campos.some((campo) => campo && normalizar(campo).includes(q));
    });
  }, [clientes, busqueda, tipo]);

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, email, teléfono…"
              aria-label="Buscar clientes"
              className="h-9 pl-8 pr-8"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap gap-1 rounded-lg bg-muted p-1"
            role="tablist"
            aria-label="Filtrar por tipo"
          >
            {TIPO_OPCIONES.map((opcion) => {
              const activo = tipo === opcion.value;
              return (
                <button
                  key={opcion.value}
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setTipo(opcion.value)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    activo
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opcion.label}
                  <span
                    className={`ml-1.5 text-xs tabular-nums ${
                      activo ? 'text-primary' : 'text-muted-foreground/70'
                    }`}
                  >
                    {conteos[opcion.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Search className="size-8 text-muted-foreground/40" />
            <p className="font-medium">No hay clientes que coincidan</p>
            <p className="text-sm text-muted-foreground">
              Probá con otro nombre o cambiá el filtro.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Cliente
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tipo
                </TableHead>
                <TableHead className="hidden h-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                  Fuente
                </TableHead>
                <TableHead className="hidden h-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">
                  Creado
                </TableHead>
                <TableHead className="h-10 pr-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((cliente) => {
                const contacto = [
                  cliente.email && { icon: Mail, text: cliente.email },
                  cliente.telefono && { icon: Phone, text: cliente.telefono },
                  cliente.ciudad && { icon: MapPin, text: cliente.ciudad },
                ].filter(Boolean) as { icon: typeof Mail; text: string }[];

                return (
                  <TableRow key={cliente.id} className="group">
                    <TableCell className="py-3 pl-4">
                      <Link
                        href={`/clientes/${cliente.id}`}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorAvatar(cliente.id)}`}
                          aria-hidden
                        >
                          {iniciales(cliente.nombre)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium transition-colors group-hover:text-primary">
                            {cliente.nombre}
                          </span>
                          {contacto.length > 0 ? (
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                              {contacto.map(({ icon: Icon, text }) => (
                                <span
                                  key={text}
                                  className="inline-flex items-center gap-1"
                                >
                                  <Icon className="size-3" />
                                  <span className="truncate">{text}</span>
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="mt-0.5 block text-xs text-muted-foreground/60">
                              Sin datos de contacto
                            </span>
                          )}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <ClienteBadge tipo={cliente.tipo} />
                    </TableCell>
                    <TableCell className="hidden py-3 text-sm text-muted-foreground md:table-cell">
                      {cliente.fuente ?? '—'}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap py-3 text-sm text-muted-foreground lg:table-cell">
                      {formatDate(cliente.created_at)}
                    </TableCell>
                    <TableCell className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-0.5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="max-sm:size-11"
                          render={<Link href={`/clientes/${cliente.id}`} />}
                        >
                          <Eye className="size-4" />
                          <span className="sr-only">Ver</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="max-sm:size-11"
                          render={<Link href={`/clientes/${cliente.id}/editar`} />}
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="max-sm:size-11 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: cliente.id,
                              nombre: cliente.nombre,
                            })
                          }
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Mostrando {filtrados.length} de {clientes.length} clientes
        </div>
      </div>

      <DeleteClienteDialog
        clienteId={deleteDialog.id}
        clienteNombre={deleteDialog.nombre}
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      />
    </>
  );
}
