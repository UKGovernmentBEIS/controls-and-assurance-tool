using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class GoMiscFilesRepository : BaseRepository
    {
        public GoMiscFilesRepository(IPrincipal user) : base(user) { }

        public GoMiscFilesRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public GoMiscFilesRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<GoMiscFile> GoMiscFiles
        {
            get
            {
                return (from x in db.GoMiscFiles
                        select x);
            }
        }

        public GoMiscFile Find(int keyValue)
        {
            return GoMiscFiles.Where(f => f.ID == keyValue).FirstOrDefault();
        }

        public GoMiscFile Add(GoMiscFile goMiscFile)
        {
            goMiscFile.UploadedByUserId = ApiUser.ID;
            var x =  db.GoMiscFiles.Add(goMiscFile);
            return x;
        }

        public GoMiscFile Remove(GoMiscFile goMiscFile)
        {
            return db.GoMiscFiles.Remove(goMiscFile);
        }
    }
}