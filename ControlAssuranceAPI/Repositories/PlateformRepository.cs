using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class PlateformRepository : BaseRepository
    {
        public PlateformRepository(IPrincipal user) : base(user) { }

        public PlateformRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public PlateformRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<Plateform> Plateforms
        {
            get
            {
                return (from x in db.Plateforms
                        select x);
            }
        }

        public Plateform Find(int keyValue)
        {
            return Plateforms.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}