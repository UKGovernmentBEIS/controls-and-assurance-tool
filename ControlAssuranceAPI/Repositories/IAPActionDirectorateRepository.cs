using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPActionDirectorateRepository : BaseRepository
    {
        public IAPActionDirectorateRepository(IPrincipal user) : base(user) { }

        public IAPActionDirectorateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPActionDirectorateRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPActionDirectorate> IAPActionDirectorates
        {
            get
            {
                return (from x in db.IAPActionDirectorates
                        select x);
            }
        }

        public IAPActionDirectorate Find(int keyValue)
        {
            return IAPActionDirectorates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public IAPActionDirectorate Add(IAPActionDirectorate iAPActionDirectorate)
        {
            return db.IAPActionDirectorates.Add(iAPActionDirectorate);
        }

        public IAPActionDirectorate Remove(IAPActionDirectorate iAPActionDirectorate)
        {
            return db.IAPActionDirectorates.Remove(iAPActionDirectorate);
        }
    }
}