import { detailedDiff } from 'deep-object-diff';

export class CompareSnapshotsUseCase {
  execute(oldSwaggerObj: any, newSwaggerObj: any): any {
    return detailedDiff(oldSwaggerObj, newSwaggerObj);
  }
}
