using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOPublicationDirectorateRepository : BaseRepository
    {
        public NAOPublicationDirectorateRepository(IPrincipal user) : base(user) { }

        public NAOPublicationDirectorateRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOPublicationDirectorateRepository(IControlAssuranceContext context) : base(context) { }


        public IQueryable<NAOPublicationDirectorate> NAOPublicationDirectorates
        {
            get
            {
                return (from x in db.NAOPublicationDirectorates
                        select x);
            }
        }

        public NAOPublicationDirectorate Find(int keyValue)
        {
            return NAOPublicationDirectorates.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOPublicationDirectorate Add(NAOPublicationDirectorate nAOPublicationDirectorate)
        {
            return db.NAOPublicationDirectorates.Add(nAOPublicationDirectorate);
        }

        public NAOPublicationDirectorate Remove(NAOPublicationDirectorate nAOPublicationDirectorate)
        {
            return db.NAOPublicationDirectorates.Remove(nAOPublicationDirectorate);
        }
    }
}