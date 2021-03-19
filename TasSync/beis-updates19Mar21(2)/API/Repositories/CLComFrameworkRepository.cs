using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLComFrameworkRepository : BaseRepository
    {
        public CLComFrameworkRepository(IPrincipal user) : base(user) { }

        public CLComFrameworkRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLComFrameworkRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLComFramework> CLComFrameworks
        {
            get
            {

                return (from x in db.CLComFrameworks
                        select x);
            }
        }

        public CLComFramework Find(int keyValue)
        {
            return CLComFrameworks.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLComFramework Add(CLComFramework cLComFramework)
        {
            int newID = 1;
            var lastRecord = db.CLComFrameworks.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLComFramework.ID = newID;

            return db.CLComFrameworks.Add(cLComFramework);
        }

        public CLComFramework Remove(CLComFramework cLComFramework)
        {
            return db.CLComFrameworks.Remove(cLComFramework);
        }
    }
}