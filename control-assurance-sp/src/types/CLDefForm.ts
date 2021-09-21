import { IEntity } from "./Entity";
export interface ICLDefForm extends IEntity {
    Details?: string;
    EngagedStageFormText?: string;
    OnboardingStageFormText?: string;
    LeavingStageFormText?: string;
    

    CaseDetailsHelpText?: string;
    
    DetailsOfApplicantEditHelpText?: string;
    DetailsOfApplicantViewHelpText?: string;

    RequirementEditHelpText?: string;
    RequirementViewHelpText?: string;

    CommercialEditHelpText?: string;
    CommercialViewHelpText?: string;

    ResourcingJustificationEditHelpText?: string;
    ResourcingJustificationViewHelpText?: string;

    FinanceEditHelpText?: string;
    FinanceViewHelpText?: string;

    OtherEditHelpText?: string;
    OtherViewHelpText?: string;

    ApproversEditHelpText?: string;
    ApproversViewHelpText?: string;

    BHApprovalDecisionEditHelpText?: string;
    BHApprovalDecisionViewHelpText?: string;

    FBPApprovalDecisionEditHelpText?: string;
    FBPApprovalDecisionViewHelpText?: string;

    HRBPApprovalDecisionEditHelpText?: string;
    HRBPApprovalDecisionViewHelpText?: string;

    ICApprovalDecisionEditHelpText?: string;
    ICApprovalDecisionViewHelpText?: string;

    OnboardingEditHelpText?: string;
    OnboardingViewHelpText?: string;

    EngagedEditHelpText?: string;
    EngagedViewHelpText?: string;

    LeavingEditHelpText?: string;
    LeavingViewHelpText?: string;
    CaseDiscussionHelpText?: string;


}