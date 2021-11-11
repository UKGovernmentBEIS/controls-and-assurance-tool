﻿using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
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

        public void Archive(int clWorkerId)
        {
            var clWorker = db.CLWorkers.FirstOrDefault(x => x.ID == clWorkerId);
            if(clWorker != null)
            {
                clWorker.Archived = true;
                db.SaveChanges();
            }
        }

        public CLWorker Update(CLWorker inputWorker)
        {
            var clWorker = db.CLWorkers.FirstOrDefault(x => x.ID == inputWorker.ID);

            //var apiUser = ApiUser;
            //int apiUserId = apiUser.ID;
            //string user = apiUser.Title;
            //string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");

            //check for approval

            if (inputWorker.Title == null)
                inputWorker.Title = "";

            string newChangeLog = "";
            if(inputWorker.Title.StartsWith("SaveEngaged") == true)
            {
                clWorker.BPSSCheckedById = inputWorker.BPSSCheckedById;
                clWorker.BPSSCheckedOn = inputWorker.BPSSCheckedOn;
                clWorker.POCheckedById = inputWorker.POCheckedById;
                clWorker.POCheckedOn = inputWorker.POCheckedOn;
                clWorker.ITCheckedById = inputWorker.ITCheckedById;
                clWorker.ITCheckedOn = inputWorker.ITCheckedOn;
                clWorker.UKSBSCheckedById = inputWorker.UKSBSCheckedById;
                clWorker.UKSBSCheckedOn = inputWorker.UKSBSCheckedOn;
                clWorker.PassCheckedById = inputWorker.PassCheckedById;
                clWorker.PassCheckedOn = inputWorker.PassCheckedOn;
                clWorker.ContractCheckedById = inputWorker.ContractCheckedById;
                clWorker.ContractCheckedOn = inputWorker.ContractCheckedOn;
                clWorker.SDSCheckedById = inputWorker.SDSCheckedById;
                clWorker.SDSCheckedOn = inputWorker.SDSCheckedOn;
                clWorker.SDSNotes = inputWorker.SDSNotes;

                clWorker.ITSystemRef = inputWorker.ITSystemRef;
                clWorker.ITSystemNotes = inputWorker.ITSystemNotes;
                clWorker.UKSBSRef = inputWorker.UKSBSRef;
                clWorker.UKSBSNotes = inputWorker.UKSBSNotes;

                clWorker.EngPONumber = inputWorker.EngPONumber;
                clWorker.EngPONote = inputWorker.EngPONote;

                if(inputWorker.Title == "SaveEngaged_MoveToChecksDone")
                {
                    clWorker.EngagedChecksDone = true;
                }

                db.SaveChanges();
                return clWorker;

                //no need to go further in this if condition.

            }
            else if(inputWorker.Title.StartsWith("SaveLeaving") == true)
            {
                clWorker.LeEndDate = inputWorker.LeEndDate;
                clWorker.LeContractorPhone = inputWorker.LeContractorPhone;
                clWorker.LeContractorEmail = inputWorker.LeContractorEmail;
                clWorker.LeContractorHomeAddress = inputWorker.LeContractorHomeAddress;
                clWorker.LeContractorPostCode = inputWorker.LeContractorPostCode;

                clWorker.LeContractorDetailsCheckedById = inputWorker.LeContractorDetailsCheckedById;
                clWorker.LeContractorDetailsCheckedOn = inputWorker.LeContractorDetailsCheckedOn;
                clWorker.LeITCheckedById = inputWorker.LeITCheckedById;
                clWorker.LeITCheckedOn = inputWorker.LeITCheckedOn;
                clWorker.LeUKSBSCheckedById = inputWorker.LeUKSBSCheckedById;
                clWorker.LeUKSBSCheckedOn = inputWorker.LeUKSBSCheckedOn;
                clWorker.LePassCheckedById = inputWorker.LePassCheckedById;
                clWorker.LePassCheckedOn = inputWorker.LePassCheckedOn;
                clWorker.Stage = CLCaseRepository.CaseStages.Leaving.Name;

                if (inputWorker.Title == "SaveLeaving_MoveToArchive")
                {
                    clWorker.Stage = CLCaseRepository.CaseStages.Left.Name;
                    clWorker.Archived = true;
                    //Date leaving details confirmed by hiring manager.
                    clWorker.LeMoveToArchiveDate = DateTime.Now;
                }

                db.SaveChanges();
                return clWorker;
            }
            else if (inputWorker.Title == "SubmitToEngaged")
            {
                clWorker.Stage = CLCaseRepository.CaseStages.Engaged.Name;
                //Date when On-boarding details are submitted
                clWorker.OnbSubmitDate = DateTime.Now;
                //copy few values for later usage for the leaving stage
                clWorker.LeEndDate = inputWorker.OnbEndDate;
                clWorker.LeContractorPhone = inputWorker.OnbContractorPhone;
                clWorker.LeContractorEmail = inputWorker.OnbContractorEmail;
                clWorker.LeContractorHomeAddress = inputWorker.OnbContractorHomeAddress;
                clWorker.LeContractorPostCode = inputWorker.OnbContractorPostCode;

                clWorker.EngPONumber = inputWorker.PurchaseOrderNum;

                if(clWorker.CLCase.CaseType == "Extension")
                {
                    //move the case extended from to archive - make stage to Extended
                    var parentWorker = db.CLWorkers.FirstOrDefault(x => x.ID == clWorker.ExtendedFromWorkerId);
                    parentWorker.Stage = CLCaseRepository.CaseStages.Extended.Name;
                    parentWorker.Archived = true;
                    db.SaveChanges();
                }



                //newChangeLog = $"{cLcase.CaseChangeLog}{date} Case submitted for Approval by {user},";
                //var worker = cLcase.CLWorkers.FirstOrDefault();

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

            clWorker.OnbContractorGenderId = inputWorker.OnbContractorGenderId;
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

            clWorker.OnbWorkOrderNumber = inputWorker.OnbWorkOrderNumber;
            clWorker.OnbRecruitersEmail = inputWorker.OnbRecruitersEmail;

            db.SaveChanges();
            return clWorker;
        }

        public string CreateSDSPdf(int clWorkerId, string spSiteUrl)
        {
            string initialReturnStatus = "Working... Please Wait";
            this.ChangePdfStatus(PdfType.SDSPdf, clWorkerId, initialReturnStatus, null);
            Task.Run(() =>
            {
                CLWorkerRepository cLWorkerRepository = new CLWorkerRepository(base.user);
                try
                {
                    string tempFolder = @"c:\local\temp\";
                    string guid = System.Guid.NewGuid().ToString();
                    string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                    System.IO.Directory.CreateDirectory(tempLocation);

                    
                    var worker = cLWorkerRepository.Find(clWorkerId);

                    UserRepository userRepository = new UserRepository(base.user);

                    GoDefFormRepository goDFR = new GoDefFormRepository(base.user);
                    string spAccessDetails = goDFR.GoDefForms.FirstOrDefault(x => x.ID == 1).Access;

                    string outputPdfName = $"CL_SDS_{clWorkerId}.pdf";


                    Libs.PdfLib pdfLib = new Libs.PdfLib();
                    pdfLib.CreateCLSDSPdf(worker, userRepository, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                    Thread.Sleep(500);
                    //delete temp folder which we created earlier
                    System.IO.Directory.Delete(tempLocation, true);

                    cLWorkerRepository.ChangePdfStatus(PdfType.SDSPdf, clWorkerId, "Cr", outputPdfName);


                    //should add log
                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    cLWorkerRepository.ChangePdfStatus(PdfType.SDSPdf, clWorkerId, msg, null);

                }


            });


            return initialReturnStatus;
        }


        public string CreateCasePdf(int clWorkerId, string spSiteUrl)
        {
            string initialReturnStatus = "Working... Please Wait";
            this.ChangePdfStatus(PdfType.CasePdf, clWorkerId, initialReturnStatus, null);
            Task.Run(() =>
            {
                CLWorkerRepository cLWorkerRepository = new CLWorkerRepository(base.user);
                try
                {
                    string tempFolder = @"c:\local\temp\";
                    string guid = System.Guid.NewGuid().ToString();
                    string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                    System.IO.Directory.CreateDirectory(tempLocation);


                    var worker = cLWorkerRepository.Find(clWorkerId);

                    CLCaseEvidenceRepository cLCaseEvidenceRepository = new CLCaseEvidenceRepository(base.user);
                    UserRepository userRepository = new UserRepository(base.user);

                    GoDefFormRepository goDFR = new GoDefFormRepository(base.user);
                    string spAccessDetails = goDFR.GoDefForms.FirstOrDefault(x => x.ID == 1).Access;

                    string outputPdfName = $"CL_Case_{clWorkerId}.pdf";


                    Libs.PdfLib pdfLib = new Libs.PdfLib();
                    pdfLib.CreateCLCasePdf(worker, cLCaseEvidenceRepository, userRepository, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                    Thread.Sleep(500);
                    //delete temp folder which we created earlier
                    System.IO.Directory.Delete(tempLocation, true);

                    cLWorkerRepository.ChangePdfStatus(PdfType.CasePdf, clWorkerId, "Cr", outputPdfName);


                    //should add log
                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    cLWorkerRepository.ChangePdfStatus(PdfType.CasePdf, clWorkerId, msg, null);

                }


            });


            return initialReturnStatus;
        }

        private void ChangePdfStatus(PdfType pdfType, int clWorkerId, string pdfStatus, string outputPdfName)
        {
            var worker = db.CLWorkers.FirstOrDefault(x => x.ID == clWorkerId);

            if(pdfType == PdfType.SDSPdf)
            {
                worker.SDSPdfStatus = pdfStatus;
                if (pdfStatus == "Cr")
                {
                    worker.SDSPdfName = outputPdfName;
                }
                worker.SDSPdfDate = DateTime.Now;
                worker.SDSPdfLastActionUser = base.ApiUser.Title;
            }
            else if (pdfType == PdfType.CasePdf)
            {
                worker.CasePdfStatus = pdfStatus;
                if (pdfStatus == "Cr")
                {
                    worker.CasePdfName = outputPdfName;
                }
                worker.CasePdfDate = DateTime.Now;
                worker.CasePdfLastActionUser = base.ApiUser.Title;
            }

            db.SaveChanges();
        }

        public enum PdfType { SDSPdf, CasePdf }
    }
}