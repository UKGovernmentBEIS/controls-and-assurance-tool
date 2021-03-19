using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPDefFormRepository : BaseRepository
    {
        public IAPDefFormRepository(IPrincipal user) : base(user) { }

        public IAPDefFormRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPDefFormRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPDefForm> IAPDefForms
        {
            get
            {
                return (from x in db.IAPDefForms
                        select x);
            }
        }

        public IAPDefForm Find(int keyValue)
        {
            return IAPDefForms.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public IAPDefForm Add(IAPDefForm iapDefForm)
        {
            int newID = 1;
            var lastRecord = db.IAPDefForms.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            iapDefForm.ID = newID;
            return db.IAPDefForms.Add(iapDefForm);
        }

        public IAPDefForm Remove(IAPDefForm iapDefForm)
        {
            return db.IAPDefForms.Remove(iapDefForm);
        }
    }
}