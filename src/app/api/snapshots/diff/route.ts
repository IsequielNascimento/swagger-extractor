import { NextResponse } from 'next/server';
import { prisma } from '@/core/database/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const oldId = searchParams.get('oldId');
  const newId = searchParams.get('newId');

  if (!oldId || !newId) {
    return NextResponse.json({ error: 'Missing oldId or newId' }, { status: 400 });
  }

  try {
    const diff = await prisma.snapshotDiff.findFirst({
      where: {
        snapshotOldId: oldId,
        snapshotNewId: newId,
      },
    });

    if (diff) {
      return NextResponse.json({ diff: diff.diffJson });
    }

    const oldSnapshot = await prisma.snapshot.findUnique({ where: { id: oldId } });
    const newSnapshot = await prisma.snapshot.findUnique({ where: { id: newId } });

    if (!oldSnapshot || !newSnapshot) {
      return NextResponse.json({ error: 'Snapshots not found' }, { status: 404 });
    }

    const { CompareSnapshotsUseCase } = await import('@/modules/snapshots/useCases/CompareSnapshotsUseCase');
    const comparer = new CompareSnapshotsUseCase();
    const diffObj = comparer.execute(oldSnapshot.swaggerJson, newSnapshot.swaggerJson);

    return NextResponse.json({ diff: diffObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
