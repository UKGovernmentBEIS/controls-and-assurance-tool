import { IEntity, Entity } from "./Entity";
import { IUser } from "./User";

export interface IProgressUpdate extends IEntity {
    UpdatePeriod?: Date;
    UpdateDate: Date;
    UpdateUserID: number;
    RagOptionID: number;
    Comment: string;
    ToBeClosed: boolean;
    User?: IUser;
}

export interface IProgressUpdateWithDeliveryDates extends IProgressUpdate {
    ForecastDate: Date;
    ActualDate: Date;
}

export class ProgressUpdate extends Entity implements IProgressUpdate {
    public UpdatePeriod = null;
    public UpdateDate = null;
    public UpdateUserID = null;
    public RagOptionID = null;
    public Comment = null;
    public ToBeClosed = null;

    constructor(period?: Date) {
        super();
        if (period) {
            this.UpdatePeriod = period;
        } else {
            const now = new Date();
            const y = now.getFullYear();
            const m = now.getMonth();
            this.UpdatePeriod = new Date(Date.UTC(y, m + 1, 0, 0, 0, 0));
        }
    }
}

export class ProgressUpdateWithDeliveryDates extends ProgressUpdate implements IProgressUpdateWithDeliveryDates {
    public ForecastDate = null;
    public ActualDate = null;
}
