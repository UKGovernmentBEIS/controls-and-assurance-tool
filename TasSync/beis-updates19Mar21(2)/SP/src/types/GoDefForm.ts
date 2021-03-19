import { IEntity } from "./Entity";
export interface IGoDefForm extends IEntity {
    Details?: string;
    Section1Title?: string;
    Section2Title?: string;
    Section3Title?: string;
    SummaryShortInstructions?: string;
    SummaryFullInstructions?: string;
    SummaryFormRatingText?: string;
    DGSignOffText?: string;
}