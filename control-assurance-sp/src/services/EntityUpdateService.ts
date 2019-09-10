import { EntityService } from './EntityService';

export abstract class EntityUpdateService<T> extends EntityService<T> {
    public abstract readLatestUpdateForPeriod(entityId: number, period: Date): Promise<T>;
    // // Example method to be implemented in inheriting class
    // return this.readAll(`?$top=1&$filter=ParentEntityID eq ${entityId} and UpdatePeriod eq ${period.toISOString()}&$orderby=UpdateDate desc`).then((eu: T[]) => {
    //     if (eu.length > 0)
    //         return eu[0];
    // });

    public abstract readLastSignedOffUpdateForPeriod(entityId: number, period: Date, previous?: boolean): Promise<T>;
    // // Example method to be implemented in inheriting class
    // let signOffPeriod = period;
    // if (previous) signOffPeriod = new Date(Date.UTC(period.getFullYear(), period.getMonth(), 0, 0, 0, 0));
    // return this.readAll(`?$top=1&$filter=EntityID eq ${entityId} and UpdatePeriod eq ${signOffPeriod.toISOString()} and SignOffID ne null&$orderby=SignOffID desc`).then((eu: T[]) => {
    //     if (eu.length > 0)
    //         return eu[0];
    // });
}