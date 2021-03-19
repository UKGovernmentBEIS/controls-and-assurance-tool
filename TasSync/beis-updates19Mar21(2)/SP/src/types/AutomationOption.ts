import { IEntity } from "./Entity";

export interface IAutomationOption extends IEntity {
    Description?: string;
    Module?: string;
    Active?: boolean;

}