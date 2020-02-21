using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoFormRepository : BaseRepository
    {
        public GoFormRepository(IPrincipal user) : base(user) { }

        public GoFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoForm> GoForms
        {
            get
            {
                return (from x in db.GoForms
                        select x);
            }
        }

        public GoForm Find(int keyValue)
        {
            return GoForms.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public GoForm Add(GoForm goForm)
        {
            GoForm retGoForm;
            var goFormDb = db.GoForms.FirstOrDefault(x => x.PeriodId == goForm.PeriodId && x.DirectorateGroupId == goForm.DirectorateGroupId);
            if(goFormDb != null)
            {
                if(goForm.Title != "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    goFormDb.Title = goForm.Title;
                    goFormDb.SummaryRagRating = goForm.SummaryRagRating;
                    goFormDb.SummaryEvidenceStatement = goForm.SummaryEvidenceStatement;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryMarkReadyForApproval = goForm.SummaryMarkReadyForApproval;

                    //following are TODO
                    //goFormDb.SpecificAreasCompletionStatus = goForm.SpecificAreasCompletionStatus;
                    //goFormDb.DGSignOffStatus = goForm.DGSignOffStatus;
                    //goFormDb.DGSignOffUserId = goForm.DGSignOffUserId;
                    //goFormDb.DGSignOffDate = goForm.DGSignOffDate;
                }


                retGoForm = goFormDb;

            }
            else
            {
                if(goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    goForm.Title = null;
                }
                retGoForm = db.GoForms.Add(goForm);
            }

            db.SaveChanges();

            return retGoForm;

        }
    }
}