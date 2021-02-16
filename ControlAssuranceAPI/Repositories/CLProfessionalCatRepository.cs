using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLProfessionalCatRepository : BaseRepository
    {
        public CLProfessionalCatRepository(IPrincipal user) : base(user) { }

        public CLProfessionalCatRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLProfessionalCatRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLProfessionalCat> CLProfessionalCats
        {
            get
            {

                return (from x in db.CLProfessionalCats
                        select x);
            }
        }

        public CLProfessionalCat Find(int keyValue)
        {
            return CLProfessionalCats.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}