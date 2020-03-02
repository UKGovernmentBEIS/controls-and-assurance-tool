using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoElementRepository : BaseRepository
    {
        public GoElementRepository(IPrincipal user) : base(user) { }

        public GoElementRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoElementRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoElement> GoElements
        {
            get
            {
                return (from x in db.GoElements
                        select x);
            }
        }

        public GoElement Find(int keyValue)
        {
            return GoElements.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GoElement Add(GoElement goElement)
        {
            return db.GoElements.Add(goElement);
        }

        public void StatusChecksForSection2(int goFormId)
        {
            //update form status
            var goForm = db.GoForms.FirstOrDefault(x => x.ID == goFormId);
            if(goForm != null)
            {
                int totalGoDefElements = db.GoDefElements.Count();

                var goElements = db.GoElements.Where(x => x.GoFormId == goFormId);
                int totalGoElements = goElements.Count();

                string goFormSection2Status = goForm.SpecificAreasCompletionStatus;
                if (totalGoDefElements == totalGoElements)
                {
                    int totalCompleted = goElements.Count(x => x.CompletionStatus == "Completed");
                    if (totalCompleted == totalGoDefElements)
                    {
                        goFormSection2Status = "Completed";
                    }


                }
                else
                {
                    int totalCompletedOrProgress = goElements.Count(x => x.CompletionStatus == "Completed" || x.CompletionStatus == "In Progress");
                    if (totalCompletedOrProgress > 0)
                    {
                        goFormSection2Status = "InProgress";
                    }

                }



                goForm.SpecificAreasCompletionStatus = goFormSection2Status;
                db.SaveChanges();
            }

        }
    }
}