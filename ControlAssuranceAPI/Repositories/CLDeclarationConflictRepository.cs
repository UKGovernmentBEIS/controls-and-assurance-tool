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


        public CLDeclarationConflict Add(CLDeclarationConflict cLDeclarationConflict)
        {
            int newID = 1;
            var lastRecord = db.CLDeclarationConflicts.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLDeclarationConflict.ID = newID;

            return db.CLDeclarationConflicts.Add(cLDeclarationConflict);
        }

        public CLDeclarationConflict Remove(CLDeclarationConflict cLDeclarationConflict)
        {
            return db.CLDeclarationConflicts.Remove(cLDeclarationConflict);
        }
    }
}