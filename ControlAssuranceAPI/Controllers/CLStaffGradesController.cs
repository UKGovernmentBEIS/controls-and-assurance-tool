using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLStaffGradesController : ControllerBase
{
    private readonly ICLStaffGradeRepository _cLStaffGradeRepository;
    public CLStaffGradesController(ICLStaffGradeRepository cLStaffGradeRepository)
    {
        _cLStaffGradeRepository = cLStaffGradeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLStaffGrade> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLStaffGradeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLStaffGrade> Get()
    {
        return _cLStaffGradeRepository.GetAll();
    }

    // GET: odata/CLStaffGrades(1)/CLWorkers
    [EnableQuery]
    public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
    {
        return _cLStaffGradeRepository.GetCLWorkers(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLStaffGrade cLStaffGrade)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLStaffGradeRepository.Create(cLStaffGrade);

        return Created("CLStaffGrades", cLStaffGrade);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLStaffGrade cLStaffGrade)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLStaffGrade.ID)
        {
            return BadRequest();
        }

        _cLStaffGradeRepository.Update(cLStaffGrade);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLStaffGrade = _cLStaffGradeRepository.GetById(key);
        if (cLStaffGrade is null)
        {
            return BadRequest();
        }

        _cLStaffGradeRepository.Delete(cLStaffGrade.First());

        return NoContent();
    }


}

