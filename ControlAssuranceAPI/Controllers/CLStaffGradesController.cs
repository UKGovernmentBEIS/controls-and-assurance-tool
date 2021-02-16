using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;

namespace ControlAssuranceAPI.Controllers
{
    public class CLStaffGradesController : BaseController
    {
        public CLStaffGradesController() : base() { }

        public CLStaffGradesController(IControlAssuranceContext context) : base(context) { }

        // GET: odata/CLStaffGrades
        [EnableQuery]
        public IQueryable<CLStaffGrade> Get()
        {
            return db.CLStaffGradeRepository.CLStaffGrades;
        }

        // GET: odata/CLStaffGrades(1)
        [EnableQuery]
        public SingleResult<CLStaffGrade> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.CLStaffGradeRepository.CLStaffGrades.Where(x => x.ID == key));
        }
    }
}
