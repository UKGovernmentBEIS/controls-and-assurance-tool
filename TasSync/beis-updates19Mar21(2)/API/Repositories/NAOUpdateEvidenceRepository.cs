using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class NAOUpdateEvidenceRepository : BaseRepository
    {
        public NAOUpdateEvidenceRepository(IPrincipal user) : base(user) { }

        public NAOUpdateEvidenceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public NAOUpdateEvidenceRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<NAOUpdateEvidence> NAOUpdateEvidences
        {
            get
            {
                return (from x in db.NAOUpdateEvidences
                        select x);
            }
        }

        public NAOUpdateEvidence Find(int keyValue)
        {
            return NAOUpdateEvidences.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public NAOUpdateEvidence Add(NAOUpdateEvidence naoUpdateEvidence)
        {
            naoUpdateEvidence.UploadedByUserId = ApiUser.ID;
            naoUpdateEvidence.DateUploaded = DateTime.Now;
            var x = db.NAOUpdateEvidences.Add(naoUpdateEvidence);
            return x;
        }

        public NAOUpdateEvidence Remove(NAOUpdateEvidence naoUpdateEvidence)
        {
            return db.NAOUpdateEvidences.Remove(naoUpdateEvidence);
        }
    }
}