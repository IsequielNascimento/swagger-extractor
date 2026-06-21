import { NextResponse } from 'next/server';
import { prisma } from '@/core/database/prisma';
import { CompareSnapshotsUseCase, SnapshotDiffResult } from '@/modules/snapshots/useCases/CompareSnapshotsUseCase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const oldId = searchParams.get('oldId');
  const newId = searchParams.get('newId');

  if (!oldId || !newId) {
    return NextResponse.json({ error: 'Missing oldId or newId' }, { status: 400 });
  }

  if (oldId === newId) {
    return NextResponse.json(
      { diff: { added: {}, deleted: {}, updated: {} } satisfies SnapshotDiffResult },
    );
  }

  try {
    // Tenta buscar um diff pré-computado (qualquer direção)
    const cached = await prisma.snapshotDiff.findFirst({
      where: {
        OR: [
          { snapshotOldId: oldId, snapshotNewId: newId },
          { snapshotOldId: newId, snapshotNewId: oldId },
        ],
      },
    });

    if (cached) {
      return NextResponse.json({ diff: cached.diffJson });
    }

    // Nenhum diff pré-computado — calcula e persiste para evitar recalcular
    const [oldSnapshot, newSnapshot] = await Promise.all([
      prisma.snapshot.findUnique({ where: { id: oldId } }),
      prisma.snapshot.findUnique({ where: { id: newId } }),
    ]);

    if (!oldSnapshot || !newSnapshot) {
      return NextResponse.json({ error: 'Snapshots not found' }, { status: 404 });
    }

    const comparer = new CompareSnapshotsUseCase();
    const diffObj = comparer.execute(oldSnapshot.swaggerJson, newSnapshot.swaggerJson);

    // Persiste para futuras requisições do mesmo par
    await prisma.snapshotDiff.create({
      data: {
        snapshotOldId: oldId,
        snapshotNewId: newId,
        diffJson: diffObj,
      },
    });

    return NextResponse.json({ diff: diffObj });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
