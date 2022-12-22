export interface IRepositoryResult {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: unknown;
  upsertedCount: number;
  matchedCount: number;
}
