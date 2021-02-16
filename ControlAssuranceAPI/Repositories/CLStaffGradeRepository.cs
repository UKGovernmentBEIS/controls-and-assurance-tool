using ControlAssuranceAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Repositories
{
    public class CLStaffGradeRepository : BaseRepository
    {
        public CLStaffGradeRepository(IPrincipal user) : base(user) { }

        public CLStaffGradeRepository(IPrincipal user, IControlAssuranceContext context) : base(user, context) { }

        public CLStaffGradeRepository(IControlAssuranceContext context) : base(context) { }

        public IQueryable<CLStaffGrade> CLStaffGrades
        {
            get
            {

                return (from x in db.CLStaffGrades
                        select x);
            }
        }

        public CLStaffGrade Find(int keyValue)
        {
            return CLStaffGrades.Where(x => x.ID == keyValue).FirstOrDefault();
        }
    }
}