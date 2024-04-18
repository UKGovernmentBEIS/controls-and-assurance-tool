using CAT.Libs;
using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace CAT.Repo
{
    public class CLWorkerRepository : BaseRepository, ICLWorkerRepository
    {
        private readonly ControlAssuranceContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUtils _utils;
        public CLWorkerRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor, IUtils utils)
                : base(context, httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _utils = utils;
        }

        public IQueryable<CLWorker> GetById(int id)
        {
            return _context.CLWorkers
                .AsQueryable()
                .Where(c => c.ID == id);
        }
        public CLWorker? Find(int key)
        {
            return _context.CLWorkers.FirstOrDefault(x => x.ID == key);
        }
        public IQueryable<CLWorker> GetAll()
        {
            return _context.CLWorkers.AsQueryable();
        }

        public void Update(CLWorker inputWorker)
        {
            var clWorker = _context.CLWorkers.FirstOrDefault(x => x.ID == inputWorker.ID);
            if (clWorker == null) return;

            //check for approval

            if (inputWorker.Title == null)
                inputWorker.Title = "";


            if (inputWorker.Title.StartsWith("SaveEngaged"))
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

                if (inputWorker.Title == "SaveEngaged_MoveToChecksDone")
                {
                    clWorker.EngagedChecksDone = true;
                }

                _context.SaveChanges();
                return;

                //no need to go further in this if condition.

            }
            else if (inputWorker.Title.StartsWith("SaveLeaving"))
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
                clWorker.Stage = CaseStages.Leaving.Name;

                if (inputWorker.Title == "SaveLeaving_MoveToArchive")
                {
                    clWorker.Stage = CaseStages.Left.Name;
                    clWorker.Archived = true;
                    //Date leaving details confirmed by hiring manager.
                    clWorker.LeMoveToArchiveDate = DateTime.Now;
                }

                _context.SaveChanges();
                return;
            }
            else if (inputWorker.Title == "SubmitToEngaged")
            {
                clWorker.Stage = CaseStages.Engaged.Name;
                //Date when On-boarding details are submitted
                clWorker.OnbSubmitDate = DateTime.Now;
                //copy few values for later usage for the leaving stage
                clWorker.LeEndDate = inputWorker.OnbEndDate;
                clWorker.LeContractorPhone = inputWorker.OnbContractorPhone;
                clWorker.LeContractorEmail = inputWorker.OnbContractorEmail;
                clWorker.LeContractorHomeAddress = inputWorker.OnbContractorHomeAddress;
                clWorker.LeContractorPostCode = inputWorker.OnbContractorPostCode;

                clWorker.EngPONumber = inputWorker.PurchaseOrderNum;

                if (clWorker?.CLCase?.CaseType == "Extension")
                {
                    //move the case extended from to archive - make stage to Extended
                    var parentWorker = _context.CLWorkers.First(x => x.ID == clWorker.ExtendedFromWorkerId);
                    parentWorker.Stage = CaseStages.Extended.Name;
                    parentWorker.Archived = true;
                    _context.SaveChanges();
                }
            }

            else
            {
                //modify/save request from Onboarding stage from Draft button
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
            _context.SaveChanges();
        }

        public void Archive(int clWorkerId)
        {
            var clWorker = _context.CLWorkers.FirstOrDefault(x => x.ID == clWorkerId);
            if (clWorker != null)
            {
                clWorker.Archived = true;
                _context.SaveChanges();
            }
        }

        public string CreateSDSPdf(int clWorkerId, string spSiteUrl)
        {
            var currentUser = base.ApiUser.Title;
            var initialReturnStatus = "Working... Please Wait";
            this.ChangePdfStatus(PdfType.SDSPdf, clWorkerId, initialReturnStatus, null, currentUser);
            Task.Run(() =>
            {
                var context = _utils.GetNewDbContext();
                CLWorkerRepository cLWorkerRepository = new CLWorkerRepository(context, _httpContextAccessor, _utils);
                try
                {
                    var worker = cLWorkerRepository.Find(clWorkerId);
                    if (worker != null)
                    {
                        string tempFolder = @"c:\local\temp\";
                        string guid = System.Guid.NewGuid().ToString();
                        string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                        System.IO.Directory.CreateDirectory(tempLocation);

                        UserRepository userRepository = new UserRepository(context, _httpContextAccessor);

                        GoDefFormRepository goDFR = new GoDefFormRepository(context);
                        string spAccessDetails = goDFR.Find(1)?.Access ?? "";

                        string outputPdfName = $"CL_SDS_{clWorkerId}.pdf";

                        Libs.PdfLib pdfLib = new Libs.PdfLib();
                        pdfLib.CreateCLSDSPdf(worker, userRepository, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                        Thread.Sleep(500);
                        //delete temp folder which we created earlier
                        System.IO.Directory.Delete(tempLocation, true);

                        cLWorkerRepository.ChangePdfStatus(PdfType.SDSPdf, clWorkerId, "Cr", outputPdfName, currentUser);
                    }

                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    cLWorkerRepository.ChangePdfStatus(PdfType.SDSPdf, clWorkerId, msg, null, currentUser);

                }
            });


            return initialReturnStatus;
        }

        public string CreateCasePdf(int clWorkerId, string spSiteUrl)
        {
            var currentUser = base.ApiUser.Title;
            var initialReturnStatus = "Working... Please Wait";
            this.ChangePdfStatus(PdfType.CasePdf, clWorkerId, initialReturnStatus, null, currentUser);
            Task.Run(() =>
            {
                var context = _utils.GetNewDbContext();
                CLWorkerRepository cLWorkerRepository = new CLWorkerRepository(context, _httpContextAccessor, _utils);
                try
                {
                    var worker = cLWorkerRepository.Find(clWorkerId);

                    if (worker != null)
                    {
                        string tempFolder = @"c:\local\temp\";
                        string guid = System.Guid.NewGuid().ToString();
                        string tempLocation = System.IO.Path.Combine(tempFolder, guid);
                        System.IO.Directory.CreateDirectory(tempLocation);

                        CLCaseEvidenceRepository cLCaseEvidenceRepository = new CLCaseEvidenceRepository(context, _httpContextAccessor);
                        UserRepository userRepository = new UserRepository(context, _httpContextAccessor);

                        string spAccessDetails = "";

                        string outputPdfName = $"CL_Case_{clWorkerId}.pdf";

                        Libs.PdfLib pdfLib = new Libs.PdfLib();
                        pdfLib.CreateCLCasePdf(worker, cLCaseEvidenceRepository, userRepository, tempLocation, outputPdfName, spSiteUrl, spAccessDetails);

                        Thread.Sleep(500);
                        //delete temp folder which we created earlier
                        System.IO.Directory.Delete(tempLocation, true);

                        cLWorkerRepository.ChangePdfStatus(PdfType.CasePdf, clWorkerId, "Cr", outputPdfName, currentUser);
                    }

                }
                catch (Exception ex)
                {
                    //should add log
                    string msg = "Err: " + ex.Message;
                    cLWorkerRepository.ChangePdfStatus(PdfType.CasePdf, clWorkerId, msg, null, currentUser);

                }


            });


            return initialReturnStatus;
        }

        private void ChangePdfStatus(PdfType pdfType, int clWorkerId, string pdfStatus, string? outputPdfName, string? currentUser)
        {
            var worker = _context.CLWorkers.First(x => x.ID == clWorkerId);

            if (pdfType == PdfType.SDSPdf)
            {
                worker.SDSPdfStatus = pdfStatus;
                if (pdfStatus == "Cr")
                {
                    worker.SDSPdfName = outputPdfName;
                }
                worker.SDSPdfDate = DateTime.Now;
                worker.SDSPdfLastActionUser = currentUser;
            }
            else if (pdfType == PdfType.CasePdf)
            {
                worker.CasePdfStatus = pdfStatus;
                if (pdfStatus == "Cr")
                {
                    worker.CasePdfName = outputPdfName;
                }
                worker.CasePdfDate = DateTime.Now;
                worker.CasePdfLastActionUser = currentUser;
            }

            _context.SaveChanges();
        }
    }
}
