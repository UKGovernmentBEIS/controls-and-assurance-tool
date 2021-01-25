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
            var publication = db.NAOPublications.Add(naoPublication);
            db.SaveChanges();
            //now add NAOPeriod
            NAOPeriod nAOPeriod = new NAOPeriod();
            nAOPeriod.NAOPublicationId = publication.ID;
            nAOPeriod.Title = publication.CurrentPeriodTitle;
            nAOPeriod.PeriodStartDate = publication.CurrentPeriodStartDate;
            nAOPeriod.PeriodEndDate = publication.CurrentPeriodEndDate;
            nAOPeriod.PeriodStatus = NAOPeriodRepository.PeriodStatuses.CurrentPeriod;
            db.NAOPeriods.Add(nAOPeriod);
            db.SaveChanges();

            publication.CurrentPeriodId = nAOPeriod.ID;
            db.SaveChanges();

            this.EmailsOnNewPeriod(publication);

            return publication;
        }

        public NAOPublication Update(NAOPublication inputPublication)
        {
            var publication = db.NAOPublications.FirstOrDefault(x => x.ID == inputPublication.ID);

            if(inputPublication.Title == "__NEW_PERIOD_REQUEST__")
            {
                publication.CurrentPeriodTitle = inputPublication.CurrentPeriodTitle;
                publication.CurrentPeriodStartDate = inputPublication.CurrentPeriodStartDate;
                publication.CurrentPeriodEndDate = inputPublication.CurrentPeriodEndDate;

                int currentPeriodId = publication.CurrentPeriodId.Value;
                //make current period to archived
                var currentPeriod = db.NAOPeriods.FirstOrDefault(x => x.ID == currentPeriodId);

                currentPeriod.PeriodStatus = NAOPeriodRepository.PeriodStatuses.ArchivedPeriod;

                //now add NAOPeriod
                NAOPeriod newPeriod = new NAOPeriod();
                newPeriod.NAOPublicationId = publication.ID;
                newPeriod.Title = inputPublication.CurrentPeriodTitle;
                newPeriod.PeriodStartDate = inputPublication.CurrentPeriodStartDate;
                newPeriod.PeriodEndDate = inputPublication.CurrentPeriodEndDate;
                newPeriod.PeriodStatus = NAOPeriodRepository.PeriodStatuses.CurrentPeriod;
                newPeriod.LastPeriodId = currentPeriodId;
                db.NAOPeriods.Add(newPeriod);
                db.SaveChanges();

                publication.CurrentPeriodId = newPeriod.ID;
                db.SaveChanges();

                //copy all the updates from current period to the new period
                foreach (var currentPeriodUpdate in currentPeriod.NAOUpdates.ToList())
                {
                    if(currentPeriodUpdate.ProvideUpdate == "0")
                    {
                        //update not provided so copy from last period update
                        if(currentPeriod.LastPeriodId != null)
                        {
                            var lastPeriodUpdate = db.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == currentPeriod.LastPeriodId && x.NAORecommendationId == currentPeriodUpdate.NAORecommendationId);
                            if(lastPeriodUpdate != null)
                            {
                                if(lastPeriodUpdate.ActionsTaken.StartsWith("Last update as follows was for period"))
                                {
                                    currentPeriodUpdate.ActionsTaken = lastPeriodUpdate.ActionsTaken;
                                }
                                else
                                {
                                    currentPeriodUpdate.ActionsTaken = $"Last update as follows was for period {lastPeriodUpdate.NAOPeriod.Title}{Environment.NewLine}{Environment.NewLine}{lastPeriodUpdate.ActionsTaken}";
                                }
                                
                            }
                            else
                            {
                                currentPeriodUpdate.ActionsTaken = "No prior period defined.";
                            }
                        }
                        else
                        {
                            currentPeriodUpdate.ActionsTaken = "No prior period defined.";
                        }

                        db.SaveChanges();
                    }

                    NAOUpdate newUpdate = new NAOUpdate();
                    newUpdate.TargetDate = currentPeriodUpdate.TargetDate; //need from previous period
                    newUpdate.ActionsTaken = "";
                    newUpdate.FurtherLinks = "";
                    newUpdate.NAORecommendationId = currentPeriodUpdate.NAORecommendationId; //need from previous period
                    newUpdate.NAOPeriodId = newPeriod.ID; //need this for new period
                    newUpdate.NAORecStatusTypeId = currentPeriodUpdate.NAORecStatusTypeId; //need from previous period
                    newUpdate.NAOUpdateStatusTypeId = 1; //default value
                    newUpdate.UpdateChangeLog = "";
                    newUpdate.LastSavedInfo = "Not Started"; //default value
                    newUpdate.ProvideUpdate = "1";
                    newUpdate.ApprovedByPosition = "Blank";

                    db.NAOUpdates.Add(newUpdate);
                }
                db.SaveChanges();

                this.EmailsOnNewPeriod(publication);
            }
            else
            {
                //normal publication edit/update
                publication.Title = inputPublication.Title;
                publication.NAOTypeId = inputPublication.NAOTypeId;
                publication.Year = inputPublication.Year;
                publication.PublicationLink = inputPublication.PublicationLink;
                publication.ContactDetails = inputPublication.ContactDetails;
                publication.PublicationSummary = inputPublication.PublicationSummary;
                publication.IsArchive = inputPublication.IsArchive;
                publication.CurrentPeriodTitle = inputPublication.CurrentPeriodTitle;
                publication.CurrentPeriodStartDate = inputPublication.CurrentPeriodStartDate;
                publication.CurrentPeriodEndDate = inputPublication.CurrentPeriodEndDate;

                //now update period dates
                var publicationCurrentPeriod = publication.NAOPeriods.FirstOrDefault(x => x.ID == publication.CurrentPeriodId);
                publicationCurrentPeriod.Title = inputPublication.CurrentPeriodTitle;
                publicationCurrentPeriod.PeriodStartDate = inputPublication.CurrentPeriodStartDate;
                publicationCurrentPeriod.PeriodEndDate = inputPublication.CurrentPeriodEndDate;

                db.SaveChanges();
            }



            return publication;
        }

        public NAOPublication Remove(NAOPublication naoPublication)
        {
            return db.NAOPublications.Remove(naoPublication);
        }

        public List<NAOPublicationView_Result> GetPublications(int dgAreaId, bool incompleteOnly, bool justMine, bool isArchive, bool includeSummary=false)
        {
            var loggedInUser = ApiUser;
            int loggedInUserID = loggedInUser.ID;

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
                          p.PublicationLink,
                          Type = p.NAOType.Title,
                          p.NAOTypeId,
                          p.Year,
                          p.PublicationSummary,
                          p.NAORecommendations,
                          p.NAOPeriods,
                          p.CurrentPeriodId,
                          p.CurrentPeriodStartDate,
                          p.CurrentPeriodEndDate
                          


                      };

            bool naoStaff = false;
            bool pacStaff = false;
            if (base.NAO_SuperUserOrStaff(loggedInUserID, out naoStaff, out pacStaff))
            {
                //full permission, no filter on reports
                if(naoStaff == true && pacStaff == true)
                {
                    //do nothing, full permission to access both type of reports, but usually a user will not have both permissions
                }
                else if(naoStaff == true)
                {
                    qry = qry.Where(p => p.NAOTypeId == 1);//1 for nao report
                }
                else if(pacStaff == true)
                {
                    qry = qry.Where(p => p.NAOTypeId == 2); //2 for pac report
                }


            }
            else
            {
                //DG, DG Member, Dir, Dir Mem, Assignees
                qry = qry.Where(p =>
                    p.NAORecommendations.Any(r => r.NAOAssignments.Any(ass => ass.UserId == loggedInUserID)) ||
                    p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorUserID == loggedInUserID) ||
                    p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorateGroup.DirectorGeneralUserID == loggedInUserID) ||
                    p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorateMembers.Any(dm => dm.UserID == loggedInUserID)) ||
                    p.NAOPublicationDirectorates.Any(pd => pd.Directorate.DirectorateGroup.DirectorateGroupMembers.Any(dgm => dgm.UserID == loggedInUserID))
                );
            }

            if (dgAreaId > 0)
            {

                //qry = qry.Where(x => x.DirectorateGroupID == dgAreaId);

                //there can be multiple directorates per publication
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

                qry = qry.Where(p =>
                    p.NAORecommendations.Any(r => r.NAOAssignments.Any(ass => ass.UserId == loggedInUserID))
                );
            }

            int qryCount = qry.Count();

            var list = qry.ToList();

            foreach (var iteP in list)
            {
                string title = iteP.Title;
                string completionStatus = "Not Updated"; //default value
                string users = "";
                string dgAreas = "";

                var currentPeriod = iteP.NAOPeriods.FirstOrDefault(x => x.PeriodStatus == NAOPeriodRepository.PeriodStatuses.CurrentPeriod);

                int completedPercentage = 0;
                int totalRecs = iteP.NAORecommendations.Count();
                int updatedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == currentPeriod.ID && u.NAOUpdateStatusTypeId == 2));

                int totalImplementedRecs = iteP.NAORecommendations.Count(x => x.NAOUpdates.Any(u => u.NAOPeriodId == currentPeriod.ID && u.NAORecStatusTypeId == 3));





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

                if(incompleteOnly == true && completionStatus == "Updated")
                {
                    continue;
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
                    Links = iteP.PublicationLink,
                    CompletePercent = $"{completedPercentage}%",
                    AssignedTo = users,
                    UpdateStatus = completionStatus,
                    Summary = (includeSummary == true) ? iteP.PublicationSummary != null ? iteP.PublicationSummary : "" : "",
                    CurrentPeriodId = iteP.CurrentPeriodId.Value,
                    PeriodStart = iteP.CurrentPeriodStartDate.Value.ToString("dd/MM/yyyy"),
                    PeriodEnd = iteP.CurrentPeriodEndDate.Value.ToString("dd/MM/yyyy")

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


        //NP-NewPeriod
        public void EmailsOnNewPeriod(NAOPublication nAOPublication)
        {
            //send email to Each DG, DG Delegate, Director, Director Delegate, Assignee

            //NP-NewPeriod: Custom fields are:
            //Name, PublicationTitle, PeriodTitle, PeriodStartDate, PeriodEndDate

            string publicationTitle = nAOPublication.Title;
            string periodTitle = nAOPublication.CurrentPeriodTitle;
            string periodStartDate = nAOPublication.CurrentPeriodStartDate.Value.ToString("dd/MM/yyyy");
            string periodEndDate = nAOPublication.CurrentPeriodEndDate.Value.ToString("dd/MM/yyyy");
           
            HashSet<DirectorateGroup> uniqueDirectorateGroups = new HashSet<DirectorateGroup>();
            HashSet<User> uniqueAssignees = new HashSet<User>();
            foreach (var rec in nAOPublication.NAORecommendations)
            {
                foreach (var ass in rec.NAOAssignments)
                {
                    uniqueAssignees.Add(ass.User);
                }
            }


            foreach (var dir in nAOPublication.NAOPublicationDirectorates)
            {
                uniqueDirectorateGroups.Add(dir.Directorate.DirectorateGroup);

                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "NP-NewPeriod",
                    PersonName = dir.Directorate.User.Title,
                    EmailTo = dir.Directorate.User.Username,
                    EmailToUserId = dir.Directorate.User.ID,
                    emailCC = "",
                    Custom1 = dir.Directorate.User.Title,
                    Custom2 = publicationTitle,
                    Custom3 = periodTitle,
                    Custom4 = periodStartDate,
                    Custom5 = periodEndDate,


                };
                db.EmailQueues.Add(emailQueue);

                foreach(var directorateMember in dir.Directorate.DirectorateMembers)
                {
                    EmailQueue emailQueue_DM = new EmailQueue
                    {
                        Title = "NP-NewPeriod",
                        PersonName = directorateMember.User.Title,
                        EmailTo = directorateMember.User.Username,
                        EmailToUserId = directorateMember.User.ID,
                        emailCC = "",
                        Custom1 = directorateMember.User.Title,
                        Custom2 = publicationTitle,
                        Custom3 = periodTitle,
                        Custom4 = periodStartDate,
                        Custom5 = periodEndDate,


                    };
                    db.EmailQueues.Add(emailQueue_DM);
                }

            }


            foreach(var directorateGroup in uniqueDirectorateGroups)
            {
                string dgName = directorateGroup.User.Title;
                string dgEmail = directorateGroup.User.Username;

                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "NP-NewPeriod",
                    PersonName = dgName,
                    EmailTo = dgEmail,
                    EmailToUserId = directorateGroup.User.ID,
                    emailCC = "",
                    Custom1 = dgName,
                    Custom2 = publicationTitle,
                    Custom3 = periodTitle,
                    Custom4 = periodStartDate,
                    Custom5 = periodEndDate,


                };
                db.EmailQueues.Add(emailQueue);

                //DG Delegates
                foreach(var directorateGroupMember in directorateGroup.DirectorateGroupMembers)
                {
                    EmailQueue emailQueue_DGM = new EmailQueue
                    {
                        Title = "NP-NewPeriod",
                        PersonName = directorateGroupMember.User.Title,
                        EmailTo = directorateGroupMember.User.Username,
                        EmailToUserId = directorateGroupMember.User.ID,
                        emailCC = "",
                        Custom1 = directorateGroupMember.User.Title,
                        Custom2 = publicationTitle,
                        Custom3 = periodTitle,
                        Custom4 = periodStartDate,
                        Custom5 = periodEndDate,
                    };
                    db.EmailQueues.Add(emailQueue_DGM);
                }

            }


            foreach(var assignee in uniqueAssignees)
            {
                EmailQueue emailQueue = new EmailQueue
                {
                    Title = "NP-NewPeriod",
                    PersonName = assignee.Title,
                    EmailTo = assignee.Username,
                    EmailToUserId = assignee.ID,
                    emailCC = "",
                    Custom1 = assignee.Title,
                    Custom2 = publicationTitle,
                    Custom3 = periodTitle,
                    Custom4 = periodStartDate,
                    Custom5 = periodEndDate,


                };
                db.EmailQueues.Add(emailQueue);
            }


            //at the end save changes
            db.SaveChanges();

        }
    }
}