import React, { useState } from 'react';
import { SnapshotDiffResult } from '../useCases/CompareSnapshotsUseCase';

interface DiffViewerProps {
  diff: SnapshotDiffResult | null;
  loading: boolean;
  error: string | null;
}

type SectionKey = 'added' | 'deleted' | 'updated';

const SECTIONS: { key: SectionKey; label: string; colorClass: string; bgClass: string }[] = [
  { key: 'added',   label: 'Adicionados', colorClass: 'text-green-700',  bgClass: 'bg-green-50 border-green-200' },
  { key: 'deleted', label: 'Removidos',   colorClass: 'text-red-700',    bgClass: 'bg-red-50 border-red-200'     },
  { key: 'updated', label: 'Alterados',   colorClass: 'text-yellow-700', bgClass: 'bg-yellow-50 border-yellow-200' },
];

function count(data: Record<string, unknown> | undefined): number {
  return data ? Object.keys(data).length : 0;
}

function CollapsibleSection({
  label,
  data,
  colorClass,
  bgClass,
}: {
  label: string;
  data: Record<string, unknown>;
  colorClass: string;
  bgClass: string;
}) {
  const [open, setOpen] = useState(true);
  const total = Object.keys(data).length;

  return (
    <div className={`mb-4 rounded-md border ${bgClass} overflow-hidden`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`font-semibold ${colorClass}`}>
          {label}{' '}
          <span className="font-normal text-sm opacity-70">({total} {total === 1 ? 'item' : 'itens'})</span>
        </span>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-current border-opacity-10">
          {Object.entries(data).map(([path, value]) => (
            <details key={path} className="border-b last:border-b-0 border-current border-opacity-10">
              <summary className="px-4 py-2 cursor-pointer font-mono text-sm text-gray-800 hover:bg-black hover:bg-opacity-5 select-none">
                {path}
              </summary>
              <pre className="px-4 py-3 bg-gray-900 text-gray-100 text-xs overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

export function DiffViewer({ diff, loading, error }: DiffViewerProps) {
  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-gray-500 animate-pulse">
        Calculando diferenças...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        <strong>Erro:</strong> {error}
      </div>
    );
  }

  if (!diff) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-gray-500 border border-gray-200">
        Selecione duas versões para comparar.
      </div>
    );
  }

  const totals = SECTIONS.map((s) => count(diff[s.key]));
  const hasAnyDiff = totals.some((t) => t > 0);

  if (!hasAnyDiff) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
        ✅ Nenhuma diferença encontrada entre as versões selecionadas.
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Resumo rápido */}
      <div className="flex gap-3 mb-4">
        {SECTIONS.map((s, i) =>
          totals[i] > 0 ? (
            <span
              key={s.key}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${s.bgClass} ${s.colorClass}`}
            >
              {totals[i]} {s.label.toLowerCase()}
            </span>
          ) : null,
        )}
      </div>

      {SECTIONS.map((s) => {
        const data = diff[s.key];
        if (!data || Object.keys(data).length === 0) return null;
        return (
          <CollapsibleSection
            key={s.key}
            label={s.label}
            data={data as Record<string, unknown>}
            colorClass={s.colorClass}
            bgClass={s.bgClass}
          />
        );
      })}
    </div>
  );
}
