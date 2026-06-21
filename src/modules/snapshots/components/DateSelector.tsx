import React, { useMemo } from 'react';
import { SnapshotSummary } from '../hooks/useSnapshotsList';

interface DateSelectorProps {
  snapshots: SnapshotSummary[];
  oldId: string | null;
  newId: string | null;
  onOldIdChange: (id: string) => void;
  onNewIdChange: (id: string) => void;
}

export function DateSelector({
  snapshots,
  oldId,
  newId,
  onOldIdChange,
  onNewIdChange,
}: DateSelectorProps) {
  // Lista de APIs únicas, mantendo a ordem de aparição
  const apiNames = useMemo(
    () => Array.from(new Set(snapshots.map((s) => s.apiName))),
    [snapshots],
  );

  // API selecionada — derivada do snapshot atualmente escolhido como "anterior",
  // ou da primeira API disponível como padrão
  const selectedApi = useMemo(() => {
    if (oldId) return snapshots.find((s) => s.id === oldId)?.apiName ?? apiNames[0] ?? null;
    return apiNames[0] ?? null;
  }, [oldId, snapshots, apiNames]);

  const filteredSnapshots = useMemo(
    () => snapshots.filter((s) => s.apiName === selectedApi),
    [snapshots, selectedApi],
  );

  function handleApiChange(apiName: string) {
    // Limpa os IDs ao trocar de API para evitar comparações entre APIs
    onOldIdChange('');
    onNewIdChange('');
    // Força o selectedApi a atualizar selecionando o primeiro snapshot dessa API
    const first = snapshots.find((s) => s.apiName === apiName);
    if (first) onOldIdChange(first.id);
  }

  const sameIdWarning = oldId && newId && oldId === newId;

  return (
    <div className="mb-6 space-y-4">
      {/* Seletor de API */}
      {apiNames.length > 1 && (
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">API</label>
          <select
            value={selectedApi ?? ''}
            onChange={(e) => handleApiChange(e.target.value)}
            className="border p-2 rounded-md bg-white text-black min-w-[250px] max-w-xs"
          >
            {apiNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">Previous Version</label>
          <select
            value={oldId ?? ''}
            onChange={(e) => onOldIdChange(e.target.value)}
            className="border p-2 rounded-md bg-white text-black min-w-[250px]"
          >
            <option value="" disabled>
              Select a date
            </option>
            {filteredSnapshots.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === newId}>
                {new Date(s.createdAt).toLocaleString('pt-BR')} — {s.apiName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1 text-gray-700">New Version</label>
          <select
            value={newId ?? ''}
            onChange={(e) => onNewIdChange(e.target.value)}
            className="border p-2 rounded-md bg-white text-black min-w-[250px]"
          >
            <option value="" disabled>
              Select a date
            </option>
            {filteredSnapshots.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === oldId}>
                {new Date(s.createdAt).toLocaleString('pt-BR')} — {s.apiName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sameIdWarning && (
        <p className="text-sm text-amber-600">
          ⚠️ As duas versões selecionadas são idênticas. Selecione snapshots diferentes para comparar.
        </p>
      )}
    </div>
  );
}
