using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAAssuranceRepository : BaseRepository
    {
        public GIAAAssuranceRepository(IPrincipal user) : base(user) { }

        public GIAAAssuranceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAAssuranceRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAAssurance> GIAAAssurances
        {
            get
            {
                return (from x in db.GIAAAssurances
                        select x);
            }
        }

        public GIAAAssurance Find(int keyValue)
        {
            return GIAAAssurances.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}