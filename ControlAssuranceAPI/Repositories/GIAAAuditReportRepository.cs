using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAAuditReportRepository : BaseRepository
    {
        public GIAAAuditReportRepository(IPrincipal user) : base(user) { }

        public GIAAAuditReportRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAAuditReportRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAAuditReport> GIAAAuditReports
        {
            get
            {
                return (from x in db.GIAAAuditReports
                        select x);
            }
        }

        public GIAAAuditReport Find(int keyValue)
        {
            return GIAAAuditReports.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public List<GIAAAuditReportView_Result> GetAuditReports(int giaaPeriodId, int dgAreaId, bool incompleteOnly, bool justMine)
        {
            List<GIAAAuditReportView_Result> retList = new List<GIAAAuditReportView_Result>();

            var qry = from r in db.GIAAAuditReports
                          //where p.NAORecommendations.Any(x => x.NAOUpdates.Any (y => y.NAOPeriodId == naoPeriodId))
                      select new
                      {
                          r.ID,
                          r.Title,
                          r.NumberStr,
                          r.IssueDate,
                          r.AuditYear,
                          r.Directorate.DirectorateGroupID,
                          DGArea = r.Directorate.DirectorateGroup.Title,
                          Assurance = r.GIAAAssurance.Title,

                      };

            if (dgAreaId > 0)
            {
                qry = qry.Where(x => x.DirectorateGroupID == dgAreaId);
            }

            if (justMine == true)
            {
                int loggedInUserID = ApiUser.ID;
                //qry = qry.Where(gde =>
                //    gde.GoElements.Any(ge => ge.GoAssignments.Any(gass => gass.UserId == loggedInUserID))
                //);
            }

            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var iteR in list)
            {
                string title = iteR.Title;
                string completionStatus = "Not Started"; //default value
                string users = "";


                GIAAAuditReportView_Result item = new GIAAAuditReportView_Result
                {
                    ID = iteR.ID,
                    Title = title,
                    NumberStr = iteR.NumberStr,
                    DGArea = iteR.DGArea,
                    Assurance = iteR.Assurance,
                    Year = iteR.AuditYear,
                    IssueDateStr = (iteR.IssueDate != null) ? iteR.IssueDate.Value.ToString("dd/MM/yyyy") : "",
                    CompletePercent = "0%",
                    AssignedTo = users,
                    UpdateStatus = completionStatus

                };

                retList.Add(item);

            }


            return retList;
        }

        public GIAAAuditReport Add(GIAAAuditReport giaaAuditReport)
        {
            return db.GIAAAuditReports.Add(giaaAuditReport);
        }

        public GIAAAuditReport Remove(GIAAAuditReport giaaAuditReport)
        {
            return db.GIAAAuditReports.Remove(giaaAuditReport);
        }

        public GIAAAuditReportInfoView_Result GetAuditReportInfo(int id)
        {
            GIAAAuditReportInfoView_Result ret = new GIAAAuditReportInfoView_Result();
            var r = db.GIAAAuditReports.FirstOrDefault(x => x.ID == id);
            if (r != null)
            {
                ret.ID = r.ID;
                ret.NumberStr = r.NumberStr;
                ret.Directorate = r.Directorate.Title;
                ret.Year = r.AuditYear;
                ret.DG = r.Directorate.DirectorateGroup.User.Title;
                ret.IssueDate = r.IssueDate != null ? r.IssueDate.Value.ToString("dd/MM/yyyy") : "";
                ret.Director = r.Directorate.User.Title;
                ret.Stats = "";
                ret.Assurance = r.GIAAAssurance.Title;
                ret.Link = r.Link;

            }

            return ret;
        }
    }
}