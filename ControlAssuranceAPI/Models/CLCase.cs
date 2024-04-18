using System;
using System.Collections.Generic;

namespace CAT.Models;

public partial class CLCase
{
    public int ID { get; set; }

    public string? Title { get; set; }
    
    public string? DeptTransferringTo { get; set; }
    
    public string? CaseType { get; set; }

    public int? CreatedById { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? ApplHMUserId { get; set; }

    public string? ReqCostCentre { get; set; }

    public int? ReqDirectorateId { get; set; }

    public string? ReqVacancyTitle { get; set; }

    public int? ReqGradeId { get; set; }

    public string? ReqWorkPurpose { get; set; }

    public int? ReqProfessionalCatId { get; set; }

    public DateTime? ReqEstStartDate { get; set; }

    public DateTime? ReqEstEndDate { get; set; }

    public int? ReqWorkLocationId { get; set; }

    public int? ReqNumPositions { get; set; }

    public int? ComFrameworkId { get; set; }

    public string? ComJustification { get; set; }

    public string? ComPSRAccountId { get; set; }

    public string? JustAltOptions { get; set; }

    public string? JustSuccessionPlanning { get; set; }

    public decimal? FinMaxRate { get; set; }

    public decimal? FinEstCost { get; set; }

    public int? FinIR35ScopeId { get; set; }

    public int? FinIR35AssessmentId { get; set; }

    public string? OtherComments { get; set; }

    public int? BHUserId { get; set; }

    public int? FBPUserId { get; set; }

    public int? HRBPUserId { get; set; }

    public string? BHApprovalDecision { get; set; }

    public string? BHApprovalComments { get; set; }

    public string? FBPApprovalDecision { get; set; }

    public string? FBPApprovalComments { get; set; }

    public string? HRBPApprovalDecision { get; set; }

    public string? HRBPApprovalComments { get; set; }

    public string? CaseChangeLog { get; set; }

    public bool? CaseCreated { get; set; }

    public int? CaseRef { get; set; }

    public int? BHDecisionById { get; set; }

    public int? FBPDecisionById { get; set; }

    public int? HRBPDecisionById { get; set; }

    public DateTime? BHDecisionDate { get; set; }

    public DateTime? FBPDecisionDate { get; set; }

    public DateTime? HRBPDecisionDate { get; set; }

    public string? FinApproachAgreeingRate { get; set; }

    public string? FinSummaryIR35Just { get; set; }

    public string? CLApprovalDecision { get; set; }

    public int? CLDecisionById { get; set; }

    public DateTime? CLDecisionDate { get; set; }
    public int? CBPUserId { get; set; }
    public string? CBPApprovalDecision { get; set; }
    public int? CBPDecisionById { get; set; }
    public System.DateTime? CBPDecisionDate { get; set; }
    public decimal? FinBillableRate { get; set; }
    public int? FinTotalDays { get; set; }
    public string? FinCalcType { get; set; }
    public decimal? FinCostPerWorker { get; set; }

    public virtual ICollection<CLHiringMember> CLHiringMembers { get; } = new List<CLHiringMember>();

    public virtual ICollection<CLWorker> CLWorkers { get; } = new List<CLWorker>();

    public virtual CLComFramework? ComFramework { get; set; }

    public virtual CLIR35Scope? CLIR35Scope { get; set; }

    public virtual Directorate? Directorate { get; set; }

    public virtual CLStaffGrade? CLStaffGrade { get; set; }

    public virtual CLProfessionalCat? CLProfessionalCat { get; set; }

    public virtual CLWorkLocation? CLWorkLocation { get; set; }
}

public static class ApprovalDecisions
{
    public readonly static string Approve = "Approve";
    public readonly static string Reject = "Reject";
    public readonly static string RequireDetails = "RequireDetails";
}

public static class CaseStages
{
    public readonly static CaseStage Draft = new CaseStage { Name = "Draft", Number = 1 };
    public readonly static CaseStage Approval = new CaseStage { Name = "Approval", Number = 2 };
    public readonly static CaseStage Onboarding = new CaseStage { Name = "Onboarding", Number = 3 };
    public readonly static CaseStage Engaged = new CaseStage { Name = "Engaged", Number = 4 };
    public readonly static CaseStage Leaving = new CaseStage { Name = "Leaving", Number = 5 };
    public readonly static CaseStage Left = new CaseStage { Name = "Left", Number = 6 };
    public readonly static CaseStage Extended = new CaseStage { Name = "Extended", Number = 7 };

    public static int GetStageNumber(string stageName)
    {
        if (stageName == CaseStages.Draft.Name)
            return CaseStages.Draft.Number;
        else if (stageName == CaseStages.Approval.Name)
            return CaseStages.Approval.Number;
        else if (stageName == CaseStages.Onboarding.Name)
            return CaseStages.Onboarding.Number;
        else if (stageName == CaseStages.Engaged.Name)
            return CaseStages.Engaged.Number;
        else if (stageName == CaseStages.Leaving.Name)
            return CaseStages.Leaving.Number;
        else if (stageName == CaseStages.Left.Name)
            return CaseStages.Left.Number;
        else if (stageName == CaseStages.Extended.Name)
            return CaseStages.Extended.Number;
        else
            return 0;
    }


    public class CaseStage
    {
        public string? Name { get; set; }
        public int Number { get; set; }
    }

    

}

public class ClCaseInfoView_Result
{
    public int ID { get; set; }
    public string? Title { get; set; }
    public string? Stage { get; set; }
    public string? CreatedBy { get; set; }
    public string? CreatedOn { get; set; }
    public string? CaseRef { get; set; }
    public string? ApplHMUser { get; set; }
    public string? ApplHMembers { get; set; }
    public string? ReqGrade { get; set; }
    public string? Directorate { get; set; }
    public string? ReqEstStartDate { get; set; }
    public string? ReqEstEndDate { get; set; }
    public string? ReqProfessionalCat { get; set; }
    public string? ReqWorkLocation { get; set; }
    public string? ComFramework { get; set; }
    public string? ComPSRAccount { get; set; }
    public string? FinIR35Scope { get; set; }
    public string? BHUser { get; set; }
    public string? FBPUser { get; set; }
    public string? HRBPUser { get; set; }
    public string? CBPUser { get; set; }
    public string? BHDecisionByAndDate { get; set; }
    public string? FBPDecisionByAndDate { get; set; }
    public string? HRBPDecisionByAndDate { get; set; }
    public string? CBPDecisionByAndDate { get; set; }
    public string? CLDecisionByAndDate { get; set; }
    public string? OnbContractorGender { get; set; }
    public string? OnbContractorTitle { get; set; }
    public string? OnbContractorDobStr { get; set; }
    public string? OnbStartDateStr { get; set; }
    public string? OnbEndDateStr { get; set; }
    public string? OnbSecurityClearance { get; set; }
    public string? WorkDays { get; set; }
    public string? OnbDecConflict { get; set; }
    public string? OnbLineManagerUser { get; set; }
    public string? OnbLineManagerGrade { get; set; }
    public string? OnbWorkOrderNumber { get; set; }
    public string? OnbRecruitersEmail { get; set; }
    public string? BPSSCheckedBy { get; set; }
    public string? BPSSCheckedOn { get; set; }
    public string? POCheckedBy { get; set; }
    public string? POCheckedOn { get; set; }
    public string? ITCheckedBy { get; set; }
    public string? ITCheckedOn { get; set; }
    public string? UKSBSCheckedBy { get; set; }
    public string? UKSBSCheckedOn { get; set; }
    public string? PassCheckedBy { get; set; }
    public string? PassCheckedOn { get; set; }
    public string? ContractCheckedBy { get; set; }
    public string? ContractCheckedOn { get; set; }
    public string? EngPONumber { get; set; }
    public string? EngPONote { get; set; }
    public string? SDSCheckedBy { get; set; }
    public string? SDSCheckedOn { get; set; }
    public string? SDSNotes { get; set; }
    public string? LeEndDateStr { get; set; }
    public string? LeContractorDetailsCheckedBy { get; set; }
    public string? LeContractorDetailsCheckedOn { get; set; }
    public string? LeITCheckedBy { get; set; }
    public string? LeITCheckedOn { get; set; }
    public string? LeUKSBSCheckedBy { get; set; }
    public string? LeUKSBSCheckedOn { get; set; }
    public string? LePassCheckedBy { get; set; }
    public string? LePassCheckedOn { get; set; }
    public string ExtensionHistory { get; set; } = "";
}

public class CLCaseView_Result
{
    public int ID { get; set; }
    public int CaseId { get; set; }
    public string? DeptTransferringTo { get; set; }
    public string? CaseRef { get; set; }
    public string? Title1 { get; set; }
    public string? Title2 { get; set; }
    public string? Stage { get; set; }
    public string? StageActions1 { get; set; }
    public string? StageActions2 { get; set; }
    public string? Worker { get; set; }
    public string? CreatedOn { get; set; }
    public string? CostCenter { get; set; }
    public string? HiringManager { get; set; }
    public int? HiringManagerId { get; set; }
    public string? EngagedChecksDone { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
}

public class CLCaseCounts_Result
{
    public int ID { get; set; } = 1;
    public int TotalBusinessCases { get; set; }
    public int TotalEngagedCases { get; set; }
    public int TotalArchivedCases { get; set; }
}