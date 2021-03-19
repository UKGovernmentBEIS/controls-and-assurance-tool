using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoElementEvidenceRepository : BaseRepository
    {
        public GoElementEvidenceRepository(IPrincipal user) : base(user) { }

        public GoElementEvidenceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoElementEvidenceRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoElementEvidence> GoElementEvidences
        {
            get
            {
                return (from x in db.GoElementEvidences
                        select x);
            }
        }

        public GoElementEvidence Find(int keyValue)
        {
            return GoElementEvidences.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public GoElementEvidence Add(GoElementEvidence goElementEvidence)
        {
            goElementEvidence.UploadedByUserId = ApiUser.ID;
            goElementEvidence.DateUploaded = DateTime.Now;
            var x = db.GoElementEvidences.Add(goElementEvidence);
            return x;
        }

        public GoElementEvidence Remove(GoElementEvidence goElementEvidence)
        {
            return db.GoElementEvidences.Remove(goElementEvidence);
        }
    }
}