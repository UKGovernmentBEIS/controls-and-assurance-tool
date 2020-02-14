using ControlAssuranceAPI.Models;
using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ControlAssuranceAPI.Controllers
{
    public class GoMiscFilesController : BaseController
    {
        public GoMiscFilesController() : base() { }

        public GoMiscFilesController(IControlAssuranceContext context) : base(context) { }

        [EnableQuery]
        public IQueryable<GoMiscFile> Get()
        {
            return db.GoMiscFilesRepository.GoMiscFiles;
        }

        // GET: odata/GoMiscFiles(1)
        [EnableQuery]
        public SingleResult<GoMiscFile> Get([FromODataUri] int key)
        {
            return SingleResult.Create(db.GoMiscFilesRepository.GoMiscFiles.Where(x => x.ID == key));
        }

        // POST: odata/GoMiscFiles
        public IHttpActionResult Post(GoMiscFile goMiscFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var x = db.GoMiscFilesRepository.Add(goMiscFile);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return Created(x);
        }

        // PATCH: odata/GoMiscFiles(1)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GoMiscFile> patch)
        {
            //Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GoMiscFile goMiscFile = db.GoMiscFilesRepository.Find(key);
            if (goMiscFile == null)
            {
                return NotFound();
            }

            patch.TrySetPropertyValue("DateUploaded", DateTime.Now);

            patch.Patch(goMiscFile);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoMiscFileExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(goMiscFile);
        }

        // DELETE: odata/GoMiscFiles(1)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GoMiscFile goMiscFile = db.GoMiscFilesRepository.Find(key);
            if (goMiscFile == null)
            {
                return NotFound();
            }

            var x = db.GoMiscFilesRepository.Remove(goMiscFile);
            if (x == null) return Unauthorized();

            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


        private bool GoMiscFileExists(int key)
        {
            return db.GoMiscFilesRepository.GoMiscFiles.Count(e => e.ID == key) > 0;
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
