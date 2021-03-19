using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPTypeRepository : BaseRepository
    {
        public IAPTypeRepository(IPrincipal user) : base(user) { }

        public IAPTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPType> IAPTypes
        {
            get
            {
                return (from x in db.IAPTypes
                        select x);
            }
        }

        public IAPType Find(int keyValue)
        {
            return IAPTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}