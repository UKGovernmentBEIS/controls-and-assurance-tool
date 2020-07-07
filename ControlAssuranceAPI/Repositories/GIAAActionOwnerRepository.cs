using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAActionOwnerRepository : BaseRepository
    {
        public GIAAActionOwnerRepository(IPrincipal user) : base(user) { }

        public GIAAActionOwnerRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAActionOwnerRepository(IControlAssuranceContext context) : base(context) { }


        public IQueryable<GIAAActionOwner> GIAAActionOwners
        {
            get
            {
                return (from x in db.GIAAActionOwners
                        select x);
            }
        }

        public GIAAActionOwner Find(int keyValue)
        {
            return GIAAActionOwners.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAAActionOwner Add(GIAAActionOwner giaaActionOwner)
        {
            return db.GIAAActionOwners.Add(giaaActionOwner);
        }

        public GIAAActionOwner Remove(GIAAActionOwner giaaActionOwner)
        {
            return db.GIAAActionOwners.Remove(giaaActionOwner);
        }
    }
}