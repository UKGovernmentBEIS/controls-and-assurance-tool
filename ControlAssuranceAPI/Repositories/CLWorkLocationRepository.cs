using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLWorkLocationRepository : BaseRepository
    {
        public CLWorkLocationRepository(IPrincipal user) : base(user) { }

        public CLWorkLocationRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLWorkLocationRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLWorkLocation> CLWorkLocations
        {
            get
            {

                return (from x in db.CLWorkLocations
                        select x);
            }
        }

        public CLWorkLocation Find(int keyValue)
        {
            return CLWorkLocations.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLWorkLocation Add(CLWorkLocation cLWorkLocation)
        {
            int newID = 1;
            var lastRecord = db.CLWorkLocations.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLWorkLocation.ID = newID;

            return db.CLWorkLocations.Add(cLWorkLocation);
        }

        public CLWorkLocation Remove(CLWorkLocation cLWorkLocation)
        {
            return db.CLWorkLocations.Remove(cLWorkLocation);
        }
    }
}