using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoDefFormRepository : BaseRepository
    {
        public GoDefFormRepository(IPrincipal user) : base(user) { }

        public GoDefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoDefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoDefForm> GoDefForms
        {
            get
            {
                return (from d in db.GoDefForms
                        select d);
            }
        }


        public GoDefForm Find(int keyValue)
        {
            return GoDefForms.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public GoDefForm Add(GoDefForm goDefForm)
        {
            int newID = 1;
            var lastRecord = db.GoDefForms.OrderByDescending(x => x.ID).FirstOrDefault();
            if(lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            goDefForm.ID = newID;
            return db.GoDefForms.Add(goDefForm);
        }

        public GoDefForm Remove(GoDefForm goDefForm)
        {
            return db.GoDefForms.Remove(goDefForm);
        }

    }
}