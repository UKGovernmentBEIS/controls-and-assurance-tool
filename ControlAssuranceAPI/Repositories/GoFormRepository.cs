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
            var goFormDb = db.GoForms.FirstOrDefault(x => x.PeriodId == goForm.PeriodId && x.DirectorateGroupId == goForm.DirectorateGroupId);
            if(goFormDb != null)
            {
                
                if(goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    //just read and return- no update required
                    return goFormDb;
                }
                else {
                    
                    //update existing goForm
                    goFormDb.Title = goForm.Title;
                    goFormDb.SummaryRagRating = goForm.SummaryRagRating;
                    goFormDb.SummaryEvidenceStatement = goForm.SummaryEvidenceStatement;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryCompletionStatus = goForm.SummaryCompletionStatus;
                    goFormDb.SummaryMarkReadyForApproval = goForm.SummaryMarkReadyForApproval;

                    //sign-off check
                    goFormDb = this.SignOffCheck(goFormDb);

                    //retGoForm = goFormDb;
                    db.SaveChanges();
                    return goFormDb;
                }

            }
            else
            {
                //add new goForm record
                if(goForm.Title == "_ADD_ONLY_IF_DOESNT_EXIST_")
                {
                    goForm.Title = null;
                }
                var newGoForm = db.GoForms.Add(goForm);
                db.SaveChanges();
                return newGoForm;
            }


        }

        public GoForm SignOffCheck(GoForm goForm)
        {
            //sign-off check
            if (goForm.SpecificAreasCompletionStatus == "Completed" && goForm.SummaryCompletionStatus == "Completed" && goForm.DGSignOffStatus != "Completed")
            {
                //make DGSignOffStatus to "WaitingSignOff"
                goForm.DGSignOffStatus = "WaitingSignOff";
            }
            else if (goForm.SpecificAreasCompletionStatus == "InProgress" || goForm.SummaryCompletionStatus == "InProgress")
            {
                goForm.DGSignOffStatus = null;
            }

            return goForm;
        }

        public bool SignOffForm(int key)
        {
            var goForm = db.GoForms.FirstOrDefault(x => x.ID == key);
            if(goForm != null)
            {
                int userId = ApiUser.ID;
                goForm.DGSignOffStatus = "Completed";
                goForm.DGSignOffUserId = userId;
                goForm.DGSignOffDate = DateTime.Now;

                db.SaveChanges();
                return true;
            }

            return false;
            
        }
    }
}