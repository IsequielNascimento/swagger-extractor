import { detailedDiff } from 'deep-object-diff';

export type SnapshotDiffResult = {
  added: Record<string, unknown>;
  deleted: Record<string, unknown>;
  updated: Record<string, unknown>;
};

export class CompareSnapshotsUseCase {
  execute(oldSwaggerObj: unknown, newSwaggerObj: unknown): SnapshotDiffResult {
    return detailedDiff(oldSwaggerObj as object, newSwaggerObj as object) as SnapshotDiffResult;
  }
}
