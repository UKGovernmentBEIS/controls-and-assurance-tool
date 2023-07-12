using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class PlatformRepository : BaseRepository
    {
        public PlatformRepository(IPrincipal user) : base(user) { }

        public PlatformRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public PlatformRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<Platform> Platforms
        {
            get
            {
                return (from x in db.Platforms
                        select x);
            }
        }

        public Platform Find(int keyValue)
        {
            return Platforms.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}