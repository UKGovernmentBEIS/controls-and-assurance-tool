using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class IAPStatusTypeRepository : BaseRepository
    {
        public IAPStatusTypeRepository(IPrincipal user) : base(user) { }

        public IAPStatusTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public IAPStatusTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<IAPStatusType> IAPStatusTypes
        {
            get
            {

                return (from x in db.IAPStatusTypes
                        select x);
            }
        }

        public IAPStatusType Find(int keyValue)
        {
            return IAPStatusTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}