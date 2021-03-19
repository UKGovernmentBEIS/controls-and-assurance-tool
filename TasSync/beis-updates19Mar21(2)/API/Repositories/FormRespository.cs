using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class FormRepository : BaseRepository
    {
        public FormRepository(IPrincipal user) : base(user) { }

        public FormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public FormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<Form> Forms
        {
            get
            {
                return (from d in db.Forms
                        select d);
            }
        }

        public Form Find(int keyValue)
        {
            return Forms.Where(kwa => kwa.ID == keyValue).FirstOrDefault();
        }

        public Form Add(Form form)
        {
            //var userId = ApiUser.ID; //may need to do this later
            var formDb = db.Forms.FirstOrDefault(f => f.TeamId == form.TeamId && f.PeriodId == form.PeriodId);
            if (formDb != null)
                return formDb;
            else
                return db.Forms.Add(form);

        }
    }
}