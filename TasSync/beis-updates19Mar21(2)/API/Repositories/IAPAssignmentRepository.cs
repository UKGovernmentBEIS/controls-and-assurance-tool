using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPAssignmentRepository : BaseRepository
    {
        public IAPAssignmentRepository(IPrincipal user) : base(user) { }

        public IAPAssignmentRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPAssignmentRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPAssignment> IAPAssignments
        {
            get
            {
                return (from x in db.IAPAssignments
                        select x);
            }
        }

        public IAPAssignment Find(int keyValue)
        {
            return IAPAssignments.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public IAPAssignment Add(IAPAssignment iapAssignment)
        {
            iapAssignment.DateAssigned = DateTime.Today;
            return db.IAPAssignments.Add(iapAssignment);
        }

        public IAPAssignment Remove(IAPAssignment iapAssignment)
        {
            return db.IAPAssignments.Remove(iapAssignment);
        }

        public List<IAPAssignment> GetAllAssignmentsForParentAction(int parentIAPActionId)
        {
            //get all child actions for the input parent and use child actions ids as "in" statement

            var childActions = db.IAPActions.Where(x => x.ParentId == parentIAPActionId).ToList();

            string childActionIds = "";
            foreach(var ite in childActions)
            {
                childActionIds += $"{ite.ID},";
            }

            List<int> lstChildActionIds = new List<int>();
            if (childActionIds.Length > 0)
            {
                childActionIds = childActionIds.Substring(0, childActionIds.Length - 1);
                lstChildActionIds = childActionIds.Split(',').Select(int.Parse).ToList();
            }

            
            


            var qry = from a in db.IAPAssignments
                      //where a.IAPActionId == iapActionId
                      where lstChildActionIds.Contains(a.IAPActionId.Value)
                      orderby a.GroupNum, a.IAPActionId
                      select a;

            var retList = qry.ToList();

            return retList;

        }
    }
}