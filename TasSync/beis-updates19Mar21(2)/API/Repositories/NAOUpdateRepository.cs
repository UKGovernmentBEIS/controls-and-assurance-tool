using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOUpdateRepository : BaseRepository
    {
        public NAOUpdateRepository(IPrincipal user) : base(user) { }

        public NAOUpdateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOUpdateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOUpdate> NAOUpdates
        {
            get
            {
                return (from x in db.NAOUpdates
                        select x);
            }
        }

        public NAOUpdate Find(int keyValue)
        {
            return NAOUpdates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        //public void GetHistoricUpdates(int naoRecommendationId, , int naoPeriodId)
        //{
        //    db.NAOUpdates.Where(x => x.NAORecommendationId == naoRecommendationId && x.NAOPeriodId < naoPeriodId);
        //}

        public void UpdateTargetDateAndRecStatus(int naoRecommendationId, int naoPeriodId, string targetDate, int naoRecStatusTypeId)
        {
            var update = this.FindCreate(naoRecommendationId, naoPeriodId);
            int existingRecStatus = update.NAORecStatusTypeId != null ? update.NAORecStatusTypeId.Value : 0;
            if(existingRecStatus != 3 && naoRecStatusTypeId == 3) //3 is implemented
            {
                update.ImplementationDate = DateTime.Now;
            }
            update.TargetDate = targetDate;
            update.NAORecStatusTypeId = naoRecStatusTypeId;

            db.SaveChanges();
        }

        public string GetLastPeriodActionsTaken(int naoRecommendationId, int naoPeriodId)
        {
            string lastPeriodActions = "";
            var period = db.NAOPeriods.FirstOrDefault(x => x.ID == naoPeriodId);
            if(period.LastPeriodId != null)
            {
                var naoUpdate = db.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == period.LastPeriodId && x.NAORecommendationId == naoRecommendationId);
                if(naoUpdate != null)
                {
                    lastPeriodActions = naoUpdate.ActionsTaken;
                }
            }


            return lastPeriodActions;
        }

        public NAOUpdate FindCreate(int naoRecommendationId, int naoPeriodId)
        {
            var naoUpdateDb = db.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == naoPeriodId && x.NAORecommendationId == naoRecommendationId);
            NAOUpdate ret;
            if (naoUpdateDb != null)
            {
                ret = naoUpdateDb;
            }
            else
            {
                NAOUpdate newR = new NAOUpdate();
                newR.NAOPeriodId = naoPeriodId;
                newR.NAORecommendationId = naoRecommendationId;
                newR.NAOUpdateStatusTypeId = 1;
                newR.NAORecStatusTypeId = 1;
                newR.LastSavedInfo = "Not Started";
                newR.ActionsTaken = "";
                newR.TargetDate = "";
                newR.UpdateChangeLog = "";
                newR.ProvideUpdate = "1";
                newR.ApprovedByPosition = "Blank";

                ret = db.NAOUpdates.Add(newR);
                db.SaveChanges();
            }

            return ret;
        }


        public NAOUpdate Add(NAOUpdate naoUpdate)
        {
            NAOUpdate ret;
            var naoUpdateDb = db.NAOUpdates.FirstOrDefault(x => x.NAOPeriodId == naoUpdate.NAOPeriodId && x.NAORecommendationId == naoUpdate.NAORecommendationId);
            if(naoUpdateDb != null)
            {
                int existingRecStatus = naoUpdateDb.NAORecStatusTypeId != null ? naoUpdateDb.NAORecStatusTypeId.Value : 0;
                if (existingRecStatus != 3 && naoUpdate.NAORecStatusTypeId == 3) //3 is implemented
                {
                    naoUpdateDb.ImplementationDate = DateTime.Now;
                }

                //Further Links checks - 
                //format: '<' is used as separator between a line items and '>' used as separator for next line
                //microsoft<https://www.microsoft.com/en-gb<False>
                //List<int> TagIds = tags.Split(',').Select(int.Parse).ToList();
                //listStrLineElements = line.Split(',').ToList();

                string publicationLink = naoUpdateDb.NAORecommendation.NAOPublication.PublicationLink;
                if (publicationLink == null)
                {
                    publicationLink = "";
                }

                string furtherLinks = naoUpdate.FurtherLinks.Trim();
                string newFurtherLinks = "";
                if(string.IsNullOrEmpty(furtherLinks) == false)
                {
                    var list1 = naoUpdate.FurtherLinks.Split('>').ToList();
                    foreach(var ite1 in list1)
                    {
                        if (string.IsNullOrEmpty(ite1))
                        {
                            continue;
                        }
                        var arr2 = ite1.Split('<').ToArray();
                        bool addToPublication = false;
                        bool.TryParse(arr2[2], out addToPublication);
                        if(addToPublication == true)
                        {
                            //add link to the publication, dont include in the string newFurtherLinks
                            publicationLink += $"{arr2[0]}<{arr2[1]}>";
                            
                        }
                        else
                        {
                            newFurtherLinks += $"{arr2[0]}<{arr2[1]}>";
                        }
                        

                    }
                }

                naoUpdateDb.NAORecommendation.NAOPublication.PublicationLink = publicationLink;
                naoUpdateDb.FurtherLinks = newFurtherLinks;


                naoUpdateDb.ProvideUpdate = naoUpdate.ProvideUpdate;
                naoUpdateDb.Title = naoUpdate.Title;
                naoUpdateDb.TargetDate = naoUpdate.TargetDate;
                naoUpdateDb.ActionsTaken = naoUpdate.ActionsTaken;
                naoUpdateDb.NAOComments = naoUpdate.NAOComments;                
                naoUpdateDb.NAORecStatusTypeId = naoUpdate.NAORecStatusTypeId;
                naoUpdateDb.NAOUpdateStatusTypeId = 2; //hardcode value on every save 2 means "Saved"

                naoUpdateDb.ApprovedById = naoUpdate.ApprovedById;
                naoUpdateDb.ApprovedByPosition = naoUpdate.ApprovedByPosition;

                //naoUpdateDb.NAORecommendation.TargetDate = naoUpdate.TargetDate;
                //naoUpdateDb.NAORecommendation.NAORecStatusTypeId = naoUpdate.NAORecStatusTypeId;
                naoUpdateDb.NAORecommendation.NAOUpdateStatusTypeId = 2; //hardcode value on every save 2 means "Updated"

                string user = ApiUser.Title;
                string date = DateTime.Now.ToString("ddMMMyyyy HH:mm");
                string newChangeLog = naoUpdateDb.UpdateChangeLog + $"{date} Updated by {user},";

                naoUpdateDb.UpdateChangeLog = newChangeLog;

                naoUpdateDb.LastSavedInfo = $"Last Saved by {user} on {date}";

                ret = naoUpdateDb;
            }
            else
            {
                //this condition will not be called cause we are using FindCreate method on page load
                ret = db.NAOUpdates.Add(naoUpdate);
            }

            db.SaveChanges();

            return ret;
        }


    }
}