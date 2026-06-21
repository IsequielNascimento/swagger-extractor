import { Snapshot, SnapshotDiff } from '@prisma/client';
import { prisma } from '@/core/database/prisma';
import { CompareSnapshotsUseCase } from './CompareSnapshotsUseCase';

export type SaveSnapshotResult =
  | { snapshot: Snapshot; diff: null; skipped: true }
  | { snapshot: Snapshot; diff: SnapshotDiff; skipped: false };

export class SaveSnapshotUseCase {
  async execute(apiName: string, swaggerJson: unknown): Promise<SaveSnapshotResult> {
    const lastSnapshot = await prisma.snapshot.findFirst({
      where: { apiName },
      orderBy: { createdAt: 'desc' },
    });

    // JSON.stringify não garante ordem de chaves — mas para comparação rápida
    // de "mesmo conteúdo recebido", funciona como heurística aceitável.
    // Para eliminar falsos negativos, use um hash deterministico no futuro.
    if (lastSnapshot && JSON.stringify(lastSnapshot.swaggerJson) === JSON.stringify(swaggerJson)) {
      return { snapshot: lastSnapshot, diff: null, skipped: true };
    }

    const newSnapshot = await prisma.snapshot.create({
      data: { apiName, swaggerJson },
    });

    if (!lastSnapshot) {
      // Primeiro snapshot: não há diff a calcular
      const placeholderDiff = await prisma.snapshotDiff.create({
        data: {
          snapshotOldId: newSnapshot.id,
          snapshotNewId: newSnapshot.id,
          diffJson: { added: {}, deleted: {}, updated: {} },
        },
      });
      return { snapshot: newSnapshot, diff: placeholderDiff, skipped: false };
    }

    const comparer = new CompareSnapshotsUseCase();
    const diffObj = comparer.execute(lastSnapshot.swaggerJson, newSnapshot.swaggerJson);

    const diffResult = await prisma.snapshotDiff.create({
      data: {
        snapshotOldId: lastSnapshot.id,
        snapshotNewId: newSnapshot.id,
        diffJson: diffObj,
      },
    });

    return { snapshot: newSnapshot, diff: diffResult, skipped: false };
  }
}
