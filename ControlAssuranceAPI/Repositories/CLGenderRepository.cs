using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLGenderRepository : BaseRepository
    {
        public CLGenderRepository(IPrincipal user) : base(user) { }

        public CLGenderRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLGenderRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLGender> CLGenders
        {
            get
            {

                return (from x in db.CLGenders
                        select x);
            }
        }

        public CLGender Find(int keyValue)
        {
            return CLGenders.Where(x => x.ID == keyValue).FirstOrDefault();
        }


        public CLGender Add(CLGender cLGender)
        {
            int newID = 1;
            var lastRecord = db.CLGenders.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLGender.ID = newID;

            return db.CLGenders.Add(cLGender);
        }

        public CLGender Remove(CLGender cLGender)
        {
            return db.CLGenders.Remove(cLGender);
        }
    }
}