import { IEntity } from "./Entity";
import { IGoForm } from "./GoForm";
import { IGoDefElement } from "./GoDefElement";

export interface IGoElement extends IEntity {

    GoFormId?: number;
    GoDefElementId?: number;
    EvidenceStatement?: string;
    Rating?: string;
    CompletionStatus?: string;
    MarkReadyForApproval?:boolean;
    GoForm?: IGoForm;
    GoDefElement?: IGoDefElement;

}

export class GoElement implements IGoElement{ 
    public ID: number = 0;
    public Title: string = null;
    public GoFormId:number = 0;
    public GoDefElementId:number = 0;
    public EvidenceStatement?: string = null;
    public Rating?: string = null;
    public CompletionStatus?: string = null;
    public MarkReadyForApproval?:boolean = null;
    public GoForm?: IGoForm = null;
    public GoDefElement?: IGoDefElement = null;

    constructor(goFormId: number, goDefElementId: number) {
        this.GoFormId = goFormId;
        this.GoDefElementId = goDefElementId;
    }
}

