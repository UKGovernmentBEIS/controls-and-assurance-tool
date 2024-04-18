using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class NAOAssignmentsController : ControllerBase
{
    private readonly INAOAssignmentRepository _nAOAssignmentRepository;
    public NAOAssignmentsController(INAOAssignmentRepository nAOAssignmentRepository)
    {
        _nAOAssignmentRepository = nAOAssignmentRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOAssignment> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOAssignmentRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOAssignment> Get()
    {
        return _nAOAssignmentRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAOAssignment nAOAssignment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOAssignmentRepository.Create(nAOAssignment);

        return Created("NAOAssignments", nAOAssignment);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOAssignment nAOAssignment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOAssignment.ID)
        {
            return BadRequest();
        }

        _nAOAssignmentRepository.Update(nAOAssignment);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOAssignment = _nAOAssignmentRepository.GetById(key);
        if (nAOAssignment is null)
        {
            return BadRequest();
        }

        _nAOAssignmentRepository.Delete(nAOAssignment.First());

        return NoContent();
    }


}

