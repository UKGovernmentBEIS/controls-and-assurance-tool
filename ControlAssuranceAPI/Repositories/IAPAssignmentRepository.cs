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
            return db.IAPAssignments.Add(iapAssignment);
        }

        public IAPAssignment Remove(IAPAssignment iapAssignment)
        {
            return db.IAPAssignments.Remove(iapAssignment);
        }
    }
}