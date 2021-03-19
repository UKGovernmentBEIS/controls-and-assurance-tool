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

        public CLStaffGrade Add(CLStaffGrade cLStaffGrade)
        {
            int newID = 1;
            var lastRecord = db.CLStaffGrades.OrderByDescending(x => x.ID).FirstOrDefault();
            if (lastRecord != null)
            {
                newID = lastRecord.ID + 1;
            }
            cLStaffGrade.ID = newID;

            return db.CLStaffGrades.Add(cLStaffGrade);
        }

        public CLStaffGrade Remove(CLStaffGrade cLStaffGrade)
        {
            return db.CLStaffGrades.Remove(cLStaffGrade);
        }
    }
}