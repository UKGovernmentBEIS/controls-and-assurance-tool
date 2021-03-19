using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAODefFormRepository : BaseRepository
    {
        public NAODefFormRepository(IPrincipal user) : base(user) { }

        public NAODefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAODefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAODefForm> NAODefForms
        {
            get
            {
                return (from d in db.NAODefForms
                        select d);
            }
        }


        public NAODefForm Find(int keyValue)
        {
            return NAODefForms.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public NAODefForm Add(NAODefForm naoDefForm)
        {
            int newID = 1;
            var lastRecord = db.NAODefForms.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            naoDefForm.ID = newID;
            return db.NAODefForms.Add(naoDefForm);
        }

        public NAODefForm Remove(NAODefForm naoDefForm)
        {
            return db.NAODefForms.Remove(naoDefForm);
        }
    }
}