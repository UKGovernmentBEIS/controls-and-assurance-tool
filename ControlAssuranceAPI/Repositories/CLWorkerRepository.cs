﻿using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLWorkerRepository : BaseRepository
    {
        public CLWorkerRepository(IPrincipal user) : base(user) { }

        public CLWorkerRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLWorkerRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLWorker> CLWorkers
        {
            get
            {

                return (from x in db.CLWorkers
                        select x);
            }
        }

        public CLWorker Find(int keyValue)
        {
            return CLWorkers.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLWorker Update(CLWorker inputWorker)
        {
            var clWorker = db.CLWorkers.FirstOrDefault(x => x.ID == inputWorker.ID);

            //var apiUser = ApiUser;
            //int apiUserId = apiUser.ID;
            //string user = apiUser.Title;
            //string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");

            //check for approval
            string newChangeLog = "";
            if (inputWorker.Title == "SubmitToEngaged")
            {
                //newChangeLog = $"{cLcase.CaseChangeLog}{date} Case submitted for Approval by {user},";
                //var worker = cLcase.CLWorkers.FirstOrDefault();
                clWorker.Stage = CLCaseRepository.CaseStages.Engaged.Name;
                //cLcase.CaseChangeLog = newChangeLog;
            }
            
            else
            {
                //modify/save request from Onboarding stage from Draft button
                //if (newCase == false)
                //{
                //    newChangeLog = $"{cLcase.CaseChangeLog}{date} Case Modified by {user},";
                //    cLcase.CaseChangeLog = newChangeLog;
                //}

            }

            clWorker.OnbContractorGender = inputWorker.OnbContractorGender;
            clWorker.OnbContractorTitleId = inputWorker.OnbContractorTitleId;
            clWorker.OnbContractorFirstname = inputWorker.OnbContractorFirstname;
            clWorker.OnbContractorSurname = inputWorker.OnbContractorSurname;
            clWorker.OnbContractorDob = inputWorker.OnbContractorDob;
            clWorker.OnbContractorNINum = inputWorker.OnbContractorNINum;
            clWorker.OnbContractorPhone = inputWorker.OnbContractorPhone;
            clWorker.OnbContractorEmail = inputWorker.OnbContractorEmail;
            clWorker.OnbContractorHomeAddress = inputWorker.OnbContractorHomeAddress;
            clWorker.OnbContractorPostCode = inputWorker.OnbContractorPostCode;

            clWorker.OnbStartDate = inputWorker.OnbStartDate;
            clWorker.OnbEndDate = inputWorker.OnbEndDate;
            clWorker.OnbDayRate = inputWorker.OnbDayRate;
            clWorker.PurchaseOrderNum = inputWorker.PurchaseOrderNum;
            clWorker.OnbSecurityClearanceId = inputWorker.OnbSecurityClearanceId;
            clWorker.OnbDecConflictId = inputWorker.OnbDecConflictId;

            clWorker.OnbWorkingDayMon = inputWorker.OnbWorkingDayMon;
            clWorker.OnbWorkingDayTue = inputWorker.OnbWorkingDayTue;
            clWorker.OnbWorkingDayWed = inputWorker.OnbWorkingDayWed;
            clWorker.OnbWorkingDayThu = inputWorker.OnbWorkingDayThu;
            clWorker.OnbWorkingDayFri = inputWorker.OnbWorkingDayFri;
            clWorker.OnbWorkingDaySat = inputWorker.OnbWorkingDaySat;
            clWorker.OnbWorkingDaySun = inputWorker.OnbWorkingDaySun;

            clWorker.OnbLineManagerUserId = inputWorker.OnbLineManagerUserId;
            clWorker.OnbLineManagerGradeId = inputWorker.OnbLineManagerGradeId;
            clWorker.OnbLineManagerEmployeeNum = inputWorker.OnbLineManagerEmployeeNum;
            clWorker.OnbLineManagerPhone = inputWorker.OnbLineManagerPhone;

            db.SaveChanges();
            return clWorker;
        }
    }
}