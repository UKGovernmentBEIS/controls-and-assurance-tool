import { EntityService } from './EntityService';

export abstract class EntityUpdateService<T> extends EntityService<T> {
    public abstract readLatestUpdateForPeriod(entityId: number, period: Date): Promise<T>;
    public abstract readLastSignedOffUpdateForPeriod(entityId: number, period: Date, previous?: boolean): Promise<T>;
}