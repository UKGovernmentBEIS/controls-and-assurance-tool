using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLCaseEvidenceRepository : BaseRepository
    {
        public CLCaseEvidenceRepository(IPrincipal user) : base(user) { }

        public CLCaseEvidenceRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLCaseEvidenceRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLCaseEvidence> CLCaseEvidences
        {
            get
            {
                return (from x in db.CLCaseEvidences
                        select x);
            }
        }

        public CLCaseEvidence Find(int keyValue)
        {
            return CLCaseEvidences.Where(x => x.ID == keyValue).FirstOrDefault();
        }

        public CLCaseEvidence Add(CLCaseEvidence cLCaseEvidence)
        {
            cLCaseEvidence.UploadedByUserId = ApiUser.ID;
            cLCaseEvidence.DateUploaded = DateTime.Now;
            var x = db.CLCaseEvidences.Add(cLCaseEvidence);
            return x;
        }

        public CLCaseEvidence Remove(CLCaseEvidence cLCaseEvidence)
        {
            return db.CLCaseEvidences.Remove(cLCaseEvidence);
        }
    }
}