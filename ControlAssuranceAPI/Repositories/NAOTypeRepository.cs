using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOTypeRepository : BaseRepository
    {
        public NAOTypeRepository(IPrincipal user) : base(user) { }

        public NAOTypeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOTypeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOType> NAOTypes
        {
            get
            {
                return (from x in db.NAOTypes
                        select x);
            }
        }

        public NAOType Find(int keyValue)
        {
            return NAOTypes.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}