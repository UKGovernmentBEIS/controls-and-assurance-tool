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

        // GET: odata/CLStaffGrades(1)/CLWorkers
        [EnableQuery]
        public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
        {
            return db.CLStaffGradeRepository.CLStaffGrades.Where(d => d.ID == key).SelectMany(d => d.CLWorkers);
        }

        // POST: odata/CLStaffGrades
        public IHttpActionResult Post(CLStaffGrade cLStaffGrade)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.CLStaffGradeRepository.Add(cLStaffGrade);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(cLStaffGrade);
        }

        // PATCH: odata/CLStaffGrades(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<CLStaffGrade> patch)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            CLStaffGrade cLStaffGrade = db.CLStaffGradeRepository.Find(key);
            if (cLStaffGrade == null)
            {
                return NotFound();
            }

            patch.Patch(cLStaffGrade);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CLStaffGradeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(cLStaffGrade);
        }

        // DELETE: odata/CLStaffGrades(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            CLStaffGrade cLStaffGrade = db.CLStaffGradeRepository.Find(key);
            if (cLStaffGrade == null)
            {
                return NotFound();
            }

            var x = db.CLStaffGradeRepository.Remove(cLStaffGrade);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool CLStaffGradeExists(int key)
        {
            return db.CLStaffGradeRepository.CLStaffGrades.Count(x => x.ID == key) > 0;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
