import { prisma } from '@/core/database/prisma';
import { CompareSnapshotsUseCase } from './CompareSnapshotsUseCase';

export class SaveSnapshotUseCase {
  async execute(apiName: string, swaggerJson: any) {
    const lastSnapshot = await prisma.snapshot.findFirst({
      where: { apiName },
      orderBy: { createdAt: 'desc' },
    });

    if (lastSnapshot && JSON.stringify(lastSnapshot.swaggerJson) === JSON.stringify(swaggerJson)) {
       return { snapshot: lastSnapshot, diff: null };
    }

    const newSnapshot = await prisma.snapshot.create({
      data: {
        apiName,
        swaggerJson,
      },
    });

    let diffResult = null;
    if (lastSnapshot) {
      const comparer = new CompareSnapshotsUseCase();
      const diffObj = comparer.execute(lastSnapshot.swaggerJson, newSnapshot.swaggerJson);

      diffResult = await prisma.snapshotDiff.create({
        data: {
          snapshotOldId: lastSnapshot.id,
          snapshotNewId: newSnapshot.id,
          diffJson: diffObj,
        },
      });
    }

    return { snapshot: newSnapshot, diff: diffResult };
  }
}
