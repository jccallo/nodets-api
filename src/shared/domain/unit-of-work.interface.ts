export interface UnitOfWork {
   transaction<T>(work: (trx: any) => Promise<T>): Promise<T>
}
