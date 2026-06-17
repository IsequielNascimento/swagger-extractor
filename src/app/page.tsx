'use client';

import React, { useState } from 'react';
import { useSnapshotsList } from '@/modules/snapshots/hooks/useSnapshotsList';
import { useSnapshotDiff } from '@/modules/snapshots/hooks/useSnapshotDiff';
import { DateSelector } from '@/modules/snapshots/components/DateSelector';
import { DiffViewer } from '@/modules/snapshots/components/DiffViewer';

export default function Home() {
  const { snapshots, loading: listLoading, error: listError } = useSnapshotsList();
  
  const [oldId, setOldId] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);

  const { diff, loading: diffLoading, error: diffError } = useSnapshotDiff(oldId, newId);

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-900">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-blue-900">Swagger Extractor</h1>
          <p className="text-gray-500 mt-2">API Contract Monitoring System</p>
        </header>

        {listLoading ? (
          <div className="text-gray-500">Carregando snapshots...</div>
        ) : listError ? (
          <div className="text-red-500">Erro ao carregar snapshots: {listError}</div>
        ) : (
          <>
            <DateSelector 
              snapshots={snapshots}
              oldId={oldId}
              newId={newId}
              onOldIdChange={setOldId}
              onNewIdChange={setNewId}
            />
            
            <DiffViewer 
              diff={diff} 
              loading={diffLoading} 
              error={diffError} 
            />
          </>
        )}
      </div>
    </main>
  );
}
