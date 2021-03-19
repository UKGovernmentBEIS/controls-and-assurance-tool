using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOUpdateStatusTypeRepository : BaseRepository
    {
        public NAOUpdateStatusTypeRepository(IPrincipal user) : base(user) { }

        public NAOUpdateStatusTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOUpdateStatusTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOUpdateStatusType> NAOUpdateStatusTypes
        {
            get
            {
                return (from x in db.NAOUpdateStatusTypes
                        select x);
            }
        }

        public NAOUpdateStatusType Find(int keyValue)
        {
            return NAOUpdateStatusTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}