using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAActionStatusTypeRepository : BaseRepository
    {
        public GIAAActionStatusTypeRepository(IPrincipal user) : base(user) { }

        public GIAAActionStatusTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAActionStatusTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAActionStatusType> GIAAActionStatusTypes
        {
            get
            {
                return (from x in db.GIAAActionStatusTypes
                        select x);
            }
        }

        public GIAAActionStatusType Find(int keyValue)
        {
            return GIAAActionStatusTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}