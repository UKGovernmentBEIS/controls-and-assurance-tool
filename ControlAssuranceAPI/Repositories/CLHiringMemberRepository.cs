using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLHiringMemberRepository : BaseRepository
    {
        public CLHiringMemberRepository(IPrincipal user) : base(user) { }

        public CLHiringMemberRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLHiringMemberRepository(IControlAssuranceContext context) : base(context) { }


        public IQueryable<CLHiringMember> CLHiringMembers
        {
            get
            {
                return (from x in db.CLHiringMembers
                        select x);
            }
        }

        public CLHiringMember Find(int keyValue)
        {
            return CLHiringMembers.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLHiringMember Add(CLHiringMember cLHiringMember)
        {
            cLHiringMember.DateAssigned = DateTime.Today;
            return db.CLHiringMembers.Add(cLHiringMember);
        }

        public CLHiringMember Remove(CLHiringMember cLHiringMember)
        {
            return db.CLHiringMembers.Remove(cLHiringMember);
        }
    }
}