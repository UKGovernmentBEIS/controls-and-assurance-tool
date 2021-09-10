import { IEntity } from "./Entity";
export interface ICLDefForm extends IEntity {
    Details?: string;
    EngagedStageFormText?: string;
    OnboardingStageFormText?: string;
    LeavingStageFormText?: string;
    WorkProposalHelpText?: string;
    ResourcingJustificationHelpText?: string;
    ApproachAgreeingRateHelpText?: string;
    SummaryIR35JustificationHelpText?: string;

}