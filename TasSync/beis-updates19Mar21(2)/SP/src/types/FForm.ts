import { IEntity } from "./Entity";

export interface IFForm extends IEntity{
    PeriodId: number;
    TeamId: number;
    DefFormId?: number;
    DDSignOffStatus?: boolean;
    DDSignOffUserId?: number;
    DDSignOffDate?: Date;
    DirSignOffStatus?: boolean;
    DirSignOffUserId?: number;
    DirSignOffDate?: Date;
    LastSignOffFor?: string;
    FirstSignedOff?: boolean;
  }
  
  export class FForm implements IFForm{
    public ID: number = null;
    public PeriodId: number = 0;
    public TeamId: number = 0;
    public DefFormId?: number = null;
    public Title: string = null;
    public DDSignOffStatus?: boolean = false;
    public DDSignOffUserId?: number = null;
    public DDSignOffDate?: Date = null;
    public DirSignOffStatus?: boolean = false;
    public DirSignOffUserId?: number = null;
    public DirSignOffDate?: Date = null;
    public LastSignOffFor?: string  = null;
    public FirstSignedOff?: boolean = false;
  }