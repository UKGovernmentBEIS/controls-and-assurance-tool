using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoPeriodRepository : BaseRepository
    {
        public GoPeriodRepository(IPrincipal user) : base(user) { }

        public GoPeriodRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoPeriodRepository(IControlAssuranceContext context) : base(context) { }

        public class PeriodStatuses
        {
            public static string DesignPeriod = "Design Period";
            public static string CurrentPeriod = "Current Period";
            public static string ArchivedPeriod = "Archived Period";
        }

        public IQueryable<GoPeriod> GoPeriods
        {
            get
            {
                return (from x in db.GoPeriods
                        select x);
            }
        }

        public GoPeriod Find(int keyValue)
        {
            return GoPeriods.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public GoPeriod Add(GoPeriod period)
        {
            //make the status of new period to Design Period
            period.PeriodStatus = PeriodStatuses.DesignPeriod;

            //get the current period
            var currentPeriod = GoPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
            var newPeriod = db.GoPeriods.Add(period);
            db.SaveChanges();

            //if (currentPeriod != null)
            //{

            //    db.SaveChanges();
            //}




            return newPeriod;
        }

        public GoPeriod MakeCurrentPeriod(GoPeriod period)
        {
            //check if the requested period is design period, then only make that current
            if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
            {
                period.PeriodStatus = PeriodStatuses.CurrentPeriod;

                //find existing current period and make that as archived
                var existingCurrentPeriod = GoPeriods.FirstOrDefault(p => p.PeriodStatus == PeriodStatuses.CurrentPeriod);
                if (existingCurrentPeriod != null)
                {
                    existingCurrentPeriod.PeriodStatus = PeriodStatuses.ArchivedPeriod;

                    period.LastPeriodId = existingCurrentPeriod.ID;
                }


                db.SaveChanges();
            }


            return period;
        }

        public GoPeriod Remove(GoPeriod period)
        {
            if (period.PeriodStatus == PeriodStatuses.DesignPeriod)
            {
                //only a design period can be removed, remove all the children
                var requestedPeriodForms = db.GoForms.Where(x => x.PeriodId == period.ID);
                foreach (var requestedPeriodForm in requestedPeriodForms)
                {
                    foreach(var element in requestedPeriodForm.GoElements)
                    {
                        db.GoAssignments.RemoveRange(db.GoAssignments.Where(x => x.GoElementId == element.ID));
                        db.GoElementActions.RemoveRange(db.GoElementActions.Where(x => x.GoElementId == element.ID));
                        db.GoElementEvidences.RemoveRange(db.GoElementEvidences.Where(x => x.GoElementId == element.ID));
                        db.GoElementFeedbacks.RemoveRange(db.GoElementFeedbacks.Where(x => x.GoElementId == element.ID));
                    }
                    db.GoElements.RemoveRange(db.GoElements.Where(x => x.GoFormId == requestedPeriodForm.ID));

                }

                db.GoForms.RemoveRange(db.GoForms.Where(x => x.PeriodId == period.ID));

                return db.GoPeriods.Remove(period);
            }

            return period;
        }
    }
}