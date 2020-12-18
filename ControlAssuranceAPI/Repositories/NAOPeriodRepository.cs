using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOPeriodRepository : BaseRepository
    {
        public NAOPeriodRepository(IPrincipal user) : base(user) { }

        public NAOPeriodRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOPeriodRepository(IControlAssuranceContext context) : base(context) { }

        public class PeriodStatuses
        {
            public static string DesignPeriod = "Design Period";
            public static string CurrentPeriod = "Current Period";
            public static string ArchivedPeriod = "Archived Period";
        }

        public IQueryable<NAOPeriod> NAOPeriods
        {
            get
            {
                return (from x in db.NAOPeriods
                        select x);
            }
        }

        public NAOPeriod Find(int keyValue)
        {
            return NAOPeriods.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public NAOPeriod Add(NAOPeriod period)
        {
            //make the status of new period to Design Period
            period.PeriodStatus = PeriodStatuses.DesignPeriod;

            //get the current period
            var currentPeriod = NAOPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
            var newPeriod = db.NAOPeriods.Add(period);
            db.SaveChanges();

            if (currentPeriod != null)
            {
                //copy all the updates from current period to the new period
                foreach(var currentPeriodUpdate in currentPeriod.NAOUpdates)
                {
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
            }




            return newPeriod;
        }

        public NAOPeriod MakeCurrentPeriod(NAOPeriod period)
        {
            //check if the requested period is design period, then only make that current
            if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
            {
                period.PeriodStatus = PeriodStatuses.CurrentPeriod;

                //find existing current period and make that as archived
                var existingCurrentPeriod = NAOPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
                if (existingCurrentPeriod != null)
                {
                    existingCurrentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;

                    period.LastPeriodId = existingCurrentPeriod.ID;
                }


                db.SaveChanges();
            }


            return period;
        }

        public NAOPeriod GetLastPeriod(int periodId)
        {
            var period = db.NAOPeriods.FirstOrDefault(x => x.ID == periodId);
            if(period != null)
            {
                if(period.LastPeriodId != null)
                {
                    var lastPeriod = db.NAOPeriods.FirstOrDefault(x => x.ID == period.LastPeriodId);
                    return lastPeriod;
                }
            }

            return null;
        }

        public NAOPeriod Remove(NAOPeriod period)
        {
            if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
            {
                //only a design period can be removed, remove all the children
                var requestedPeriodUpdates = db.NAOUpdates.Where(x => x.NAOPeriodId == period.ID);
                foreach (var requestedPeriodUpdate in requestedPeriodUpdates)
                {
                    db.NAOUpdateFeedbacks.RemoveRange(db.NAOUpdateFeedbacks.Where(x => x.NAOUpdateId == requestedPeriodUpdate.ID));
                    db.NAOUpdateEvidences.RemoveRange(db.NAOUpdateEvidences.Where(x => x.NAOUpdateId == requestedPeriodUpdate.ID));
                }

                db.NAOUpdates.RemoveRange(db.NAOUpdates.Where(x => x.NAOPeriodId == period.ID));
                db.NAOOutputs.RemoveRange(db.NAOOutputs.Where(x => x.NAOPeriodId == period.ID));
                return db.NAOPeriods.Remove(period);
            }

            return period;
        }
    }
}