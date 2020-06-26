using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAUpdateStatusTypeRepository : BaseRepository
    {
        public GIAAUpdateStatusTypeRepository(IPrincipal user) : base(user) { }

        public GIAAUpdateStatusTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAUpdateStatusTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAUpdateStatusType> GIAAUpdateStatusTypes
        {
            get
            {
                return (from x in db.GIAAUpdateStatusTypes
                        select x);
            }
        }

        public GIAAUpdateStatusType Find(int keyValue)
        {
            return GIAAUpdateStatusTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}