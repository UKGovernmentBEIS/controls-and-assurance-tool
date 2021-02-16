using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLWorkerRepository : BaseRepository
    {
        public CLWorkerRepository(IPrincipal user) : base(user) { }

        public CLWorkerRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLWorkerRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLWorker> CLWorkers
        {
            get
            {

                return (from x in db.CLWorkers
                        select x);
            }
        }

        public CLWorker Find(int keyValue)
        {
            return CLWorkers.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}