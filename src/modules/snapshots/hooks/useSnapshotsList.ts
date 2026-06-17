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
        if (!res.ok) throw new Error('Failed to fetch snapshots');
        return res.json();
      })
      .then((data) => {
        setSnapshots(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { snapshots, loading, error };
}
