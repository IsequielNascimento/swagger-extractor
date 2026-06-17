import { useState, useEffect } from 'react';

export function useSnapshotDiff(oldId: string | null, newId: string | null) {
  const [diff, setDiff] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!oldId || !newId) {
      setDiff(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch('/api/snapshots/diff?oldId=' + oldId + '&newId=' + newId)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch diff');
        return res.json();
      })
      .then((data) => {
        setDiff(data.diff);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [oldId, newId]);

  return { diff, loading, error };
}
