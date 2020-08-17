using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOPublicationRepository : BaseRepository
    {
        public NAOPublicationRepository(IPrincipal user) : base(user) { }

        public NAOPublicationRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOPublicationRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOPublication> NAOPublications
        {
            get
            {
                return (from x in db.NAOPublications
                        select x);
            }
        }

        public NAOPublication Find(int keyValue)
        {
            return NAOPublications.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOPublicationInfoView_Result GetPublicationInfo(int id)
        {
            NAOPublicationInfoView_Result ret = new NAOPublicationInfoView_Result();
            var p = db.NAOPublications.FirstOrDefault(x => x.ID == id);
            if(p != null)
            {
                string directorates = "";
                foreach (var d in p.NAOPublicationDirectorates)
                {
                    directorates += d.Directorate.Title + ", ";
                }
                directorates = directorates.Trim();
                if (directorates.Length > 0)
                {
                    directorates = directorates.Substring(0, directorates.Length - 1);
                }


                ret.ID = p.ID;
                ret.Title = p.Title;
                ret.PublicationSummary = p.PublicationSummary != null ? p.PublicationSummary : "";
                ret.NAOType = p.NAOType.Title;
                ret.Directorate = directorates;
                ret.Year = p.Year;
                ret.Lead = "";
                ret.Stats = "";
                ret.ContactDetails = p.ContactDetails != null ? p.ContactDetails : "";
                ret.Links = p.PublicationLink;

            }

            return ret;
        }

        public NAOPublication Add(NAOPublication naoPublication)
        {
            return db.NAOPublications.Add(naoPublication);
        }

        public NAOPublication Remove(NAOPublication naoPublication)
        {
            return db.NAOPublications.Remove(naoPublication);
        }

        public List<NAOPublicationView_Result> GetPublications(int naoPeriodId, int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive)
        {
            List<NAOPublicationView_Result> retList = new List<NAOPublicationView_Result>();

            var qry = from p in db.NAOPublications
                      where p.IsArchive == isArchive
                      //where p.NAORecommendations.Any(x => x.NAOUpdates.Any (y => y.NAOPeriodId == naoPeriodId))
                      select new
                      {
                          p.ID,
                          p.Title,
                          p.NAOPublicationDirectorates,
                          //p.Directorate.DirectorateGroupID,                         
                          //DGArea = p.Directorate.DirectorateGroup.Title,
                          Type = p.NAOType.Title,
                          p.Year,
                          p.NAORecommendations
                          


                      };

            if(dgAreaId > 0)
            {

                //qry = qry.Where(x => x.DirectorateGroupID == dgAreaId);

                
                var dirs = db.Directorates.Where(x => x.DirectorateGroupID == dgAreaId).ToList();
                int totalDirs = dirs.Count();

                int[] arrDirs = new int[totalDirs];
                int indexD = 0;
                foreach (var d in dirs)
                {
                    arrDirs[indexD] = d.ID;
                    indexD++;
                }

                qry = qry.Where(x => x.NAOPublicationDirectorates.Any(d => arrDirs.Contains(d.DirectorateId.Value)));

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

            foreach (var iteP in list)
            {
                string title = iteP.Title;
                string completionStatus = "Not Updated"; //default value
                string users = "";
                string dgAreas = "";

                int completedPercentage = 0;
                int totalRecs = iteP.NAORecommendations.Count();
                //int updatedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdateStatusTypeId == 2);
                //int updatedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdateStatusTypeId == 2 && x.NAOUpdates.Any(u => u.NAOPeriodId == naoPeriodId));
                int updatedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == naoPeriodId && u.NAOUpdateStatusTypeId == 2));


                //int totalImplementedRecs = iteP.NAORecommendations.Count(x => x.NAORecStatusTypeId == 3);
                int totalImplementedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == naoPeriodId && u.NAORecStatusTypeId == 3));





                if (totalRecs > 0)
                {
                    if(totalRecs == updatedRecs)
                    {
                        completionStatus = "Updated";
                    }
                    else if(updatedRecs > 0)
                    {
                        completionStatus = "Partly Updated";
                    }
                }

                try
                {
                    var completedPercentageD = (decimal)((decimal)(decimal)totalImplementedRecs / (decimal)totalRecs) * 100;
                    completedPercentage = (int)Math.Round(completedPercentageD);
                }
                catch { }


                HashSet<User> uniqueUsers = new HashSet<User>();

                foreach (var rec in iteP.NAORecommendations)
                {
                    foreach (var ass in rec.NAOAssignments)
                    {
                        uniqueUsers.Add(ass.User);
                    }
                }

                int totalUniqueOwners = uniqueUsers.Count;
                foreach (var uniqueOwner in uniqueUsers)
                {
                    users += uniqueOwner.Title + ",";
                }

                users = users.Trim();
                if (users.Length > 0)
                {
                    users = users.Substring(0, users.Length - 1);
                }





                HashSet<DirectorateGroup> uniqueDgAreas = new HashSet<DirectorateGroup>();
                foreach (var d in iteP.NAOPublicationDirectorates)
                {
                    var dgArea = d.Directorate.DirectorateGroup;
                    uniqueDgAreas.Add(dgArea);
                }

                foreach (var uniqueDgArea in uniqueDgAreas)
                {
                    dgAreas += uniqueDgArea.Title + ", ";
                }


                dgAreas = dgAreas.Trim();
                if (dgAreas.Length > 0)
                {
                    dgAreas = dgAreas.Substring(0, dgAreas.Length - 1);
                }

                NAOPublicationView_Result item = new NAOPublicationView_Result
                {
                    ID = iteP.ID,
                    Title = title,
                    DGArea = dgAreas,
                    Type = iteP.Type,
                    Year = iteP.Year,
                    CompletePercent = $"{completedPercentage}%",
                    AssignedTo = users,
                    UpdateStatus = completionStatus

                };

                retList.Add(item);

            }


            return retList;
        }

        public string GetOverallPublicationsUpdateStatus(int dgAreaId, int naoPeriodId, bool isArchived)
        {
            string overAllStatus = "Not Started"; //default value
            List<string> lstCompletionStatus = new List<string>();

            var qry = from p in db.NAOPublications
                      where p.IsArchive == isArchived
                      select p;

            if (dgAreaId > 0)
            {

                var dirs = db.Directorates.Where(x => x.DirectorateGroupID == dgAreaId).ToList();
                int totalDirs = dirs.Count();

                int[] arrDirs = new int[totalDirs];
                int indexD = 0;
                foreach (var d in dirs)
                {
                    arrDirs[indexD] = d.ID;
                    indexD++;
                }

                qry = qry.Where(x => x.NAOPublicationDirectorates.Any(d => arrDirs.Contains(d.DirectorateId.Value)));

            }


            var publications = qry.ToList();
            foreach(var pub in publications)
            {
                string completionStatus = "Not Started"; //default value
                var totalRecs = pub.NAORecommendations.Count();
                if(totalRecs > 0)
                {
                    //var updatedRecs = pub.NAORecommendations.Count(x => x.NAOUpdateStatusTypeId == 2);
                    var updatedRecs = pub.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == naoPeriodId && u.NAOUpdateStatusTypeId == 2));

                    if (totalRecs == updatedRecs)
                    {
                        completionStatus = "Updated";
                    }
                    else if (updatedRecs > 0)
                    {
                        completionStatus = "Partly Updated";
                    }

                }

                lstCompletionStatus.Add(completionStatus);
            }


            if(lstCompletionStatus.Count > 0)
            {
                int totalCount = lstCompletionStatus.Count();
                int totalUpdated = lstCompletionStatus.Count(x => x == "Updated");
                int totalStarted = lstCompletionStatus.Count(x => x == "Partly Updated");

                if (totalCount == totalUpdated)
                {
                    overAllStatus = "Updated";
                }
                else if(totalStarted > 0 || totalUpdated > 0)
                {
                    overAllStatus = "Partly Updated";
                }
            }


            return overAllStatus;
        }
    }
}