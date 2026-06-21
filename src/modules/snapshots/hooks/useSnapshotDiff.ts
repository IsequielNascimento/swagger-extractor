import { useState, useEffect } from 'react';
import { SnapshotDiffResult } from '../useCases/CompareSnapshotsUseCase';

export function useSnapshotDiff(oldId: string | null, newId: string | null) {
  const [diff, setDiff] = useState<SnapshotDiffResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Limpa imediatamente para não exibir resultado anterior enquanto o novo carrega
    setDiff(null);
    setError(null);

    if (!oldId || !newId || oldId === newId) {
      return;
    }

    setLoading(true);

    const params = new URLSearchParams({ oldId, newId });

    fetch(`/api/snapshots/diff?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao buscar o diff');
        return res.json();
      })
      .then((data) => {
        setDiff(data.diff as SnapshotDiffResult);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [oldId, newId]);

  return { diff, loading, error };
}
