using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoAssignmentRepository : BaseRepository
    {
        public GoAssignmentRepository(IPrincipal user) : base(user) { }

        public GoAssignmentRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoAssignmentRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoAssignment> GoAssignments
        {
            get
            {
                return (from x in db.GoAssignments
                        select x);
            }
        }

        public GoAssignment Find(int keyValue)
        {
            return GoAssignments.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GoAssignment Add(GoAssignment goAssignment)
        {
            return db.GoAssignments.Add(goAssignment);
        }

        public GoAssignment Remove(GoAssignment goAssignment)
        {
            return db.GoAssignments.Remove(goAssignment);
        }
    }
}