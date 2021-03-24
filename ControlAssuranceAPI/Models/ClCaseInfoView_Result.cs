﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class ClCaseInfoView_Result
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Stage { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string CaseRef { get; set; }

        public string ApplHMUser { get; set; }
        public string ApplHMembers { get; set; }
        public string ReqGrade { get; set; }
        public string Directorate { get; set; }
        public string ReqEstStartDate { get; set; }
        public string ReqEstEndDate { get; set; }
        public string ReqProfessionalCat { get; set; }
        public string ReqWorkLocation { get; set; }
        public string ComFramework { get; set; }
        public string ComPSRAccount { get; set; }
        public string FinIR35Scope { get; set; }
        public string BHUser { get; set; }
        public string FBPUser { get; set; }
        public string HRBPUser { get; set; }
        public string BHDecisionByAndDate { get; set; }
        public string FBPDecisionByAndDate { get; set; }
        public string HRBPDecisionByAndDate { get; set; }

        public string OnbContractorTitle { get; set; }
        public string OnbContractorDobStr { get; set; }
        public string OnbStartDateStr { get; set; }
        public string OnbEndDateStr { get; set; }
        public string OnbSecurityClearance { get; set; }
        public string WorkDays { get; set; }
        public string OnbDecConflict { get; set; }
        public string OnbLineManagerUser { get; set; }
        public string OnbLineManagerGrade { get; set; }
        public string OnbWorkOrderNumber { get; set; }
        public string OnbRecruitersEmail { get; set; }

        public string BPSSCheckedBy { get; set; }
        public string BPSSCheckedOn { get; set; }
        public string POCheckedBy { get; set; }
        public string POCheckedOn { get; set; }
        public string ITCheckedBy { get; set; }
        public string ITCheckedOn { get; set; }
        public string UKSBSCheckedBy { get; set; }
        public string UKSBSCheckedOn { get; set; }
        public string PassCheckedBy { get; set; }
        public string PassCheckedOn { get; set; }
        public string ContractCheckedBy { get; set; }
        public string ContractCheckedOn { get; set; }
        public string EngPONumber { get; set; }
        public string EngPONote { get; set; }

        public string LeEndDateStr { get; set; }
        public string LeContractorDetailsCheckedBy { get; set; }
        public string LeContractorDetailsCheckedOn { get; set; }
        public string LeITCheckedBy { get; set; }
        public string LeITCheckedOn { get; set; }
        public string LeUKSBSCheckedBy { get; set; }
        public string LeUKSBSCheckedOn { get; set; }
        public string LePassCheckedBy { get; set; }
        public string LePassCheckedOn { get; set; }

        public string ExtensionHistory { get; set; } = "";
    }
}