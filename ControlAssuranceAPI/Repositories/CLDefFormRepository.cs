using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLDefFormRepository : BaseRepository
    {
        public CLDefFormRepository(IPrincipal user) : base(user) { }

        public CLDefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLDefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLDefForm> CLDefForms
        {
            get
            {
                return (from x in db.CLDefForms
                        select x);
            }
        }

        public CLDefForm Find(int keyValue)
        {
            return CLDefForms.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLDefForm Add(CLDefForm cLDefForm)
        {
            int newID = 1;
            var lastRecord = db.CLDefForms.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLDefForm.ID = newID;
            return db.CLDefForms.Add(cLDefForm);
        }

        public CLDefForm Remove(CLDefForm cLDefForm)
        {
            return db.CLDefForms.Remove(cLDefForm);
        }
    }
}