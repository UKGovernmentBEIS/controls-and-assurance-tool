using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLCaseEvidenceRepository : BaseRepository
    {
        public CLCaseEvidenceRepository(IPrincipal user) : base(user) { }

        public CLCaseEvidenceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLCaseEvidenceRepository(IControlAssuranceContext context) : base(context) { }

        public class AttachmentTypes
        {
            public static string None = "None";
            public static string PDF = "PDF";
            public static string Link = "Link";

        }

        public IQueryable<CLCaseEvidence> CLCaseEvidences
        {
            get
            {
                return (from x in db.CLCaseEvidences
                        select x);
            }
        }

        public CLCaseEvidence Find(int keyValue)
        {
            return CLCaseEvidences.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLCaseEvidence Add(CLCaseEvidence cLCaseEvidence)
        {
            cLCaseEvidence.UploadedByUserId = ApiUser.ID;
            cLCaseEvidence.DateUploaded = DateTime.Now;
            if(cLCaseEvidence.AttachmentType == AttachmentTypes.PDF)
            {
                cLCaseEvidence.RecordCreated = false; //in this case RecordCreated is true in update
            }
            else
            {
                cLCaseEvidence.RecordCreated = true;
            }
            var x = db.CLCaseEvidences.Add(cLCaseEvidence);
            return x;
        }

        public CLCaseEvidence Update(CLCaseEvidence inputcLCaseEvidence)
        {
            var cLCaseEvidence_DB = db.CLCaseEvidences.FirstOrDefault(x => x.ID == inputcLCaseEvidence.ID);

            cLCaseEvidence_DB.RecordCreated = true;
            cLCaseEvidence_DB.Title = inputcLCaseEvidence.Title;
            cLCaseEvidence_DB.Details = inputcLCaseEvidence.Details;

            db.SaveChanges();

            return cLCaseEvidence_DB;
        }

        public CLCaseEvidence Remove(CLCaseEvidence cLCaseEvidence)
        {
            return db.CLCaseEvidences.Remove(cLCaseEvidence);
        }

        public List<CLCaseEvidenceView_Result> GetEvidences(int parentId)
        {
            //var loggedInUser = ApiUser;
            ////string loggedInUserTitle = loggedInUser.Title;
            //int loggedInUserID = loggedInUser.ID;
            //bool isSuperUserOrViewer = base.CL_SuperUserOrViewer(loggedInUserID, out bool superUser, out bool clSuperUser, out bool clViewer);


            List<CLCaseEvidenceView_Result> retList = new List<CLCaseEvidenceView_Result>();

            var qry = from w in db.CLCaseEvidences
                      where w.ParentId == parentId
                      && w.RecordCreated == true
                      && w.EvidenceType != "IR35"
                      && w.EvidenceType != "ContractorSecurityCheck"
                      select new
                      {
                          w.ID,
                          w.Title,
                          //w.IsLink,
                          w.Details,
                          w.DateUploaded,
                          User = w.User.Title,
                          w.AttachmentType,


                      };


            var list = qry.ToList();

            foreach (var ite in list)
            {

                CLCaseEvidenceView_Result item = new CLCaseEvidenceView_Result();
                item.ID = ite.ID;
                item.Title = ite.Title;
                item.Details = ite.Details;
                item.DateAdded = ite.DateUploaded?.ToString("dd/MM/yyyy HH:mm") ?? "";
                item.AddedBy = ite.User;
                item.AttachmentType = ite.AttachmentType;



                retList.Add(item);

            }



            return retList;
        }
    }
}