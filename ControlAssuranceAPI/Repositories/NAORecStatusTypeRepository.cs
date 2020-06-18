using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAORecStatusTypeRepository : BaseRepository
    {
        public NAORecStatusTypeRepository(IPrincipal user) : base(user) { }

        public NAORecStatusTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAORecStatusTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAORecStatusType> NAORecStatusTypes
        {
            get
            {
                return (from x in db.NAORecStatusTypes
                        select x);
            }
        }

        public NAORecStatusType Find(int keyValue)
        {
            return NAORecStatusTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}