using ControlAssuranceAPI.Models;
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
                }

                db.SaveChanges();
                return clWorker;
            }
            else if (inputWorker.Title == "SubmitToEngaged")
            {
                clWorker.Stage = CLCaseRepository.CaseStages.Engaged.Name;
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
            this.ChangeSDSPdfStatus(clWorkerId, initialReturnStatus, null);
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

                    cLWorkerRepository.ChangeSDSPdfStatus(clWorkerId, "Cr", outputPdfName);

                    //should add log
                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    cLWorkerRepository.ChangeSDSPdfStatus(clWorkerId, msg, null);

                }


            });


            return initialReturnStatus;
        }


        private void ChangeSDSPdfStatus(int clWorkerId, string pdfStatus, string outputPdfName)
        {
            var worker = db.CLWorkers.FirstOrDefault(x => x.ID == clWorkerId);

            worker.SDSPdfStatus = pdfStatus;
            if (pdfStatus == "Cr")
            {
                worker.SDSPdfName = outputPdfName;
            }
            worker.SDSPdfDate = DateTime.Now;
            worker.SDSPdfLastActionUser = base.ApiUser.Title;
            db.SaveChanges();
        }


    }
}