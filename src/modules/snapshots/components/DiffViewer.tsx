import React from 'react';

interface DiffViewerProps {
  diff: any;
  loading: boolean;
  error: string | null;
}

export function DiffViewer({ diff, loading, error }: DiffViewerProps) {
  if (loading) return <div className="p-4 bg-gray-50 rounded-md text-gray-500">Carregando diferen?as...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-500 rounded-md">Erro: {error}</div>;
  if (!diff) return <div className="p-4 bg-gray-50 rounded-md text-gray-500">Selecione duas vers?es para comparar.</div>;

  const renderSection = (title: string, data: any, colorClass: string) => {
    if (!data || Object.keys(data).length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className={'text-lg font-bold mb-2 ' + colorClass}>{title}</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="mt-4">
      {renderSection('Adi??es', diff.added, 'text-green-600')}
      {renderSection('Remo??es', diff.deleted, 'text-red-600')}
      {renderSection('Altera??es', diff.updated, 'text-yellow-600')}

      {Object.keys(diff.added || {}).length === 0 &&
       Object.keys(diff.deleted || {}).length === 0 &&
       Object.keys(diff.updated || {}).length === 0 && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          Nenhuma diferen?a encontrada entre as vers?es!
        </div>
      )}
    </div>
  );
}
