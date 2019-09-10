import { IDefForm } from "./DefForm";


export interface IDefElementGroup {
    ID: number;
    Title: string;
    Sequence: number;
    DefFormId: number;
    DefForm?: IDefForm;
}