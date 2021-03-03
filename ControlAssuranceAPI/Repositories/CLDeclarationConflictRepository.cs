using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLDeclarationConflictRepository : BaseRepository
    {
        public CLDeclarationConflictRepository(IPrincipal user) : base(user) { }

        public CLDeclarationConflictRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLDeclarationConflictRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLDeclarationConflict> CLDeclarationConflicts
        {
            get
            {

                return (from x in db.CLDeclarationConflicts
                        select x);
            }
        }

        public CLDeclarationConflict Find(int keyValue)
        {
            return CLDeclarationConflicts.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}