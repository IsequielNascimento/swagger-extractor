import { useState, useEffect } from 'react';

export type SnapshotSummary = {
  id: string;
  apiName: string;
  createdAt: string;
};

export function useSnapshotsList() {
  const [snapshots, setSnapshots] = useState<SnapshotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/snapshots')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar snapshots');
        return res.json() as Promise<SnapshotSummary[]>;
      })
      .then((data) => {
        setSnapshots(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { snapshots, loading, error };
}
