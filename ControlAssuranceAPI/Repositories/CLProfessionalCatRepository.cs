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

        public CLProfessionalCat Add(CLProfessionalCat cLProfessionalCat)
        {
            int newID = 1;
            var lastRecord = db.CLProfessionalCats.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLProfessionalCat.ID = newID;

            return db.CLProfessionalCats.Add(cLProfessionalCat);
        }

        public CLProfessionalCat Remove(CLProfessionalCat cLProfessionalCat)
        {
            return db.CLProfessionalCats.Remove(cLProfessionalCat);
        }
    }
}