using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Xml;

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

        public List<GIAAAuditReportView_Result> GetAuditReports(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
        {
            var loggedInUser = ApiUser;
            int loggedInUserID = loggedInUser.ID;

            List<GIAAAuditReportView_Result> retList = new List<GIAAAuditReportView_Result>();

            var qry = from r in db.GIAAAuditReports
                      orderby r.ID
                      where r.IsArchive == isArchive
                          //where p.NAORecommendations.Any(x => x.NAOUpdates.Any (y => y.NAOPeriodId == naoPeriodId))
                      select new
                      {
                          r.ID,
                          r.Title,
                          r.NumberStr,
                          r.IssueDate,
                          r.AuditYear,
                          DirectorateGroupID = r.Directorate != null ? r.Directorate.DirectorateGroupID : 0,
                          
                          r.Directorate.DirectorUserID,
                          r.Directorate.DirectorateGroup.DirectorGeneralUserID,
                          r.Directorate.DirectorateMembers,
                          r.Directorate.DirectorateGroup.DirectorateGroupMembers,


                          DGArea = r.Directorate != null ? r.Directorate.DirectorateGroup.Title : "",
                          Directorate = r.Directorate != null ? r.Directorate.Title : "",

                          Assurance = r.GIAAAssurance != null ? r.GIAAAssurance.Title : "NoData",
                          r.GIAAAssuranceId,
                          r.GIAARecommendations

                      };

            if (base.GIAA_SuperUserOrGIAAStaff(loggedInUserID))
            {
                //full permission, no filter on reports
                if (justMine == true)
                {

                    qry = qry.Where(x =>
                        x.GIAARecommendations.Any(r => r.GIAAActionOwners.Any(o => o.UserId == loggedInUserID)) ||
                        x.DirectorGeneralUserID == loggedInUserID ||
                        x.DirectorUserID == loggedInUserID ||
                        x.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID) ||
                        x.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID)

                    );
                }
            }
            else
            {
                ////DG check
                //var dg = ApiUser.DirectorateGroups.FirstOrDefault();
                //if (dg != null)
                //{
                //    qry = qry.Where(x => x.DirectorGeneralUserID == loggedInUserID);
                //    goto AfterPermissions;
                //}

                ////DG Member check
                //var dgMember = ApiUser.DirectorateGroupMembers.FirstOrDefault();
                //if (dgMember != null)
                //{
                //    qry = qry.Where(x => x.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID));
                //    goto AfterPermissions;
                //}

                ////Director Check
                //var dir = ApiUser.Directorates.FirstOrDefault();
                //if (dir != null)
                //{
                //    qry = qry.Where(x => x.DirectorUserID == loggedInUserID);
                //    goto AfterPermissions;
                //}

                ////Director Member
                //var dirMember = ApiUser.DirectorateMembers.FirstOrDefault();
                //if (dirMember != null)
                //{
                //    qry = qry.Where(x => x.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID));
                //    goto AfterPermissions;
                //}


                //following qry works for all the cases if user doesn't have access to view all reports, thats why above code is commented
                //same as just mine filter
                //DG, DGMember, Dir, DirMember, ActionOwners
                qry = qry.Where(x => x.GIAARecommendations.Any(r => r.GIAAActionOwners.Any(o => o.UserId == loggedInUserID)) ||
                            x.DirectorGeneralUserID == loggedInUserID ||
                            x.DirectorUserID == loggedInUserID ||
                            x.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID) ||
                            x.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID)

                    );




                //by reaching here user have no permission - return 0 records
                //qry = qry.Where(x => false);

            }

            
        
        //label
        //AfterPermissions:


            if (dgAreaId > 0)
            {
                qry = qry.Where(x => x.DirectorateGroupID == dgAreaId);
            }


            if(incompleteOnly == true)
            {
                qry = qry.Where(x => x.GIAARecommendations.Any(r => r.UpdateStatus == "ReqUpdate"));
            }
            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var iteR in list)
            {
                string title = iteR.Title;
                string users = "";
                int numDisplayedOwners = 0;
                int completedPercentage = 0;




                int totalRecs = iteR.GIAARecommendations.Count;
                int totalImplementedRecs = iteR.GIAARecommendations.Count(x => x.GIAAActionStatusTypeId == 3 || x.GIAAActionStatusTypeId == 6);


                int reqUpdateRecs = iteR.GIAARecommendations.Count(r => r.UpdateStatus == "ReqUpdate");

                try
                {
                    var completedPercentageD = (decimal)((decimal)(decimal)totalImplementedRecs / (decimal)totalRecs) * 100;
                    completedPercentage = (int)Math.Round(completedPercentageD);
                }
                catch { }

                HashSet<User> uniqueOwners = new HashSet<User>();

                foreach(var rec in iteR.GIAARecommendations)
                {
                    if(string.IsNullOrEmpty(rec.DisplayedImportedActionOwners) == false)
                    {
                        numDisplayedOwners++;
                    }
                    foreach(var owner in rec.GIAAActionOwners)
                    {
                        var ownerName = owner.User.Title;
                        uniqueOwners.Add(owner.User);
                    }
                }

                if(numDisplayedOwners > 0)
                {
                    users = $"<<{numDisplayedOwners}>>,";
                }

                int totalUniqueOwners = uniqueOwners.Count;
                foreach(var uniqueOwner in uniqueOwners)
                {
                    users += uniqueOwner.Title + ",";
                }

                users = users.Trim();
                if (users.Length > 0)
                {
                    users = users.Substring(0, users.Length - 1);
                }

                string updateStatus = "";

                if(reqUpdateRecs > 0)
                {
                    updateStatus = "ReqUpdate";
                }


                GIAAAuditReportView_Result item = new GIAAAuditReportView_Result
                {
                    ID = iteR.ID,
                    Title = title,
                    NumberStr = iteR.NumberStr,
                    DGArea = iteR.DGArea,
                    Directorate = iteR.Directorate,
                    GIAAAssuranceId = iteR.GIAAAssuranceId != null ? iteR.GIAAAssuranceId.Value : 0,
                    Assurance = iteR.Assurance,
                    Year = iteR.AuditYear != null ? iteR.AuditYear : "",
                    IssueDateStr = (iteR.IssueDate != null) ? iteR.IssueDate.Value.ToString("dd/MM/yyyy") : "",
                    CompletePercent = $"{completedPercentage}%",
                    AssignedTo = users,
                    UpdateStatus = updateStatus

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
                int totalRec = r.GIAARecommendations.Count();
                int totalOpen = r.GIAARecommendations.Count(x => x.GIAAActionStatusTypeId == 1); //open
                int percentOpen = 0;
                try
                {
                    decimal a = (decimal)((decimal)totalOpen / (decimal)totalRec);
                    decimal b = Math.Round((a * 100));
                    percentOpen = (int)b;
                    //percentOpen = (int)(((decimal)(totalOpen / totalRec)) * (decimal)100);
                }
                catch(Exception ex) {
                    string m = ex.Message;
                }
                
                ret.ID = r.ID;
                ret.Title = r.Title;
                ret.NumberStr = r.NumberStr;
                ret.Directorate = r.Directorate != null ? r.Directorate.Title : "";
                ret.Year = r.AuditYear != null ? r.AuditYear : "";
                ret.DG = r.Directorate != null ? r.Directorate.DirectorateGroup.User.Title : "";
                ret.IssueDate = r.IssueDate != null ? r.IssueDate.Value.ToString("dd/MM/yyyy") : "";
                ret.Director = r.Directorate != null ? r.Directorate.User.Title : "";
                ret.Stats = $"{totalRec}/{totalOpen}/{percentOpen}%";
                ret.Assurance = r.GIAAAssurance != null ? r.GIAAAssurance.Title : "";
                ret.Link = r.Link != null ? r.Link : "";

            }

            return ret;
        }

        
    }
}