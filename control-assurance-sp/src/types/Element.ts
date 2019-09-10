import { IEntity } from "./Entity";

export interface IElement extends IEntity {
    FormId?: number;
    DefElementId?: number;
    Status?: string;
    CompletedOn?: Date;
    AssignedTo?: number;
    GeneralNote?: string;
    ResponseA1?: string;
    ResponseA2?: string;
    ResponseA3?: string;
    ResponseA4?: string;
    ResponseA5?: string;
    ResponseA6?: string;
    ResponseA7?: string;
    ResponseA8?: string;
    ResponseA9?: string;
    ResponseA10?: string;
    ResponseAOther?: string;
    ResponseAOtherText?: string;
    ResponseAEffect?: string;
    ResponseAEffectText?: string;
    
    ResponseB1?: string;
    ResponseB1Text?: string;
    ResponseB1Effect?: string;

    ResponseB2?: string;
    ResponseB2Text?: string;
    ResponseB2Effect?: string;

    ResponseB3?: string;
    ResponseB3Text?: string;
    ResponseB3Effect?: string;

    ResponseB4?: string;
    ResponseB4Text?: string;
    ResponseB4Effect?: string;
    NotApplicable?: boolean;


}

export class Element implements IElement {
    public FormId?: number = null;
    public DefElementId?: number = null;
    public Status?: string = null;
    public CompletedOn?: Date = null;
    public AssignedTo?: number = null;
    public GeneralNote?: string = null;
    public ResponseA1?: string = null;
    public ResponseA2?: string = null;
    public ResponseA3?: string = null;
    public ResponseA4?: string = null;
    public ResponseA5?: string = null;
    public ResponseA6?: string = null;
    public ResponseA7?: string = null;
    public ResponseA8?: string = null;
    public ResponseA9?: string = null;
    public ResponseA10?: string = null;
    
    public ResponseAOther?: string = null;
    public ResponseAOtherText?: string = null;
    public ResponseAEffect?: string = null;
    public ResponseAEffectText?: string = null;

    public ResponseB1?: string = null;
    public ResponseB1Text?: string = null;
    public ResponseB1Effect?: string = null;

    public ResponseB2?: string = null;
    public ResponseB2Text?: string = null;
    public ResponseB2Effect?: string = null;

    public ResponseB3?: string = null;
    public ResponseB3Text?: string = null;
    public ResponseB3Effect?: string = null;

    public ResponseB4?: string = null;
    public ResponseB4Text?: string = null;
    public ResponseB4Effect?: string = null;

    public ID: number = null;
    public Title: string = null;


    constructor(formId: number, defElementId: number) {
        this.FormId = formId;
        this.DefElementId = defElementId;
    }


}

export enum ElementStatus {
    InProgress = "InProgress",
    Completed = "Completed",
    NotApplicable = "NotApplicable",
    
}