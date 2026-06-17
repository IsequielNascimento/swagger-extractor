import React from 'react';
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
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex flex-col">
        <label className="text-sm font-semibold mb-1 text-gray-700">Vers?o Anterior</label>
        <select
          value={oldId || ''}
          onChange={(e) => onOldIdChange(e.target.value)}
          className="border p-2 rounded-md bg-white text-black min-w-[250px]"
        >
          <option value="" disabled>Selecione uma data</option>
          {snapshots.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.createdAt).toLocaleString()} - {s.apiName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold mb-1 text-gray-700">Vers?o Nova</label>
        <select
          value={newId || ''}
          onChange={(e) => onNewIdChange(e.target.value)}
          className="border p-2 rounded-md bg-white text-black min-w-[250px]"
        >
          <option value="" disabled>Selecione uma data</option>
          {snapshots.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.createdAt).toLocaleString()} - {s.apiName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
