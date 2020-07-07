using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GIAAUpdateEvidenceRepository : BaseRepository
    {
        public GIAAUpdateEvidenceRepository(IPrincipal user) : base(user) { }

        public GIAAUpdateEvidenceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GIAAUpdateEvidenceRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GIAAUpdateEvidence> GIAAUpdateEvidences
        {
            get
            {
                return (from x in db.GIAAUpdateEvidences
                        select x);
            }
        }

        public GIAAUpdateEvidence Find(int keyValue)
        {
            return GIAAUpdateEvidences.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GIAAUpdateEvidence Add(GIAAUpdateEvidence giaaUpdateEvidence)
        {
            giaaUpdateEvidence.UploadedByUserId = ApiUser.ID;
            giaaUpdateEvidence.DateUploaded = DateTime.Now;
            var x = db.GIAAUpdateEvidences.Add(giaaUpdateEvidence);
            return x;
        }

        public GIAAUpdateEvidence Remove(GIAAUpdateEvidence giaaUpdateEvidence)
        {
            return db.GIAAUpdateEvidences.Remove(giaaUpdateEvidence);
        }
    }
}