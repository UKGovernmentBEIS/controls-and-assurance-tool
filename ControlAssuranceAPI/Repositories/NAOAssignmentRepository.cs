using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOAssignmentRepository : BaseRepository
    {
        public NAOAssignmentRepository(IPrincipal user) : base(user) { }

        public NAOAssignmentRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOAssignmentRepository(IControlAssuranceContext context) : base(context) { }


        public IQueryable<NAOAssignment> NAOAssignments
        {
            get
            {
                return (from x in db.NAOAssignments
                        select x);
            }
        }

        public NAOAssignment Find(int keyValue)
        {
            return NAOAssignments.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOAssignment Add(NAOAssignment nAOAssignment)
        {
            return db.NAOAssignments.Add(nAOAssignment);
        }

        public NAOAssignment Remove(NAOAssignment nAOAssignment)
        {
            return db.NAOAssignments.Remove(nAOAssignment);
        }
    }
}