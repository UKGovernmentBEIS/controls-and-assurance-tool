using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAADefFormRepository : BaseRepository
    {
        public GIAADefFormRepository(IPrincipal user) : base(user) { }

        public GIAADefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAADefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAADefForm> GIAADefForms
        {
            get
            {
                return (from x in db.GIAADefForms
                        select x);
            }
        }

        public GIAADefForm Find(int keyValue)
        {
            return GIAADefForms.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAADefForm Add(GIAADefForm giaaDefForm)
        {
            int newID = 1;
            var lastRecord = db.GIAADefForms.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            giaaDefForm.ID = newID;
            return db.GIAADefForms.Add(giaaDefForm);
        }

        public GIAADefForm Remove(GIAADefForm giaaDefForm)
        {
            return db.GIAADefForms.Remove(giaaDefForm);
        }
    }
}