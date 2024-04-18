using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GoAssignmentsController : ControllerBase
{
    private readonly IGoAssignmentRepository _goAssignmentRepository;
    public GoAssignmentsController(IGoAssignmentRepository goAssignmentRepository)
    {
        _goAssignmentRepository = goAssignmentRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoAssignment> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goAssignmentRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<GoAssignment> Get()
    {
        return _goAssignmentRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoAssignment goAssignment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goAssignmentRepository.Create(goAssignment);

        return Created("GoAssignments", goAssignment);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoAssignment goAssignment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goAssignment.ID)
        {
            return BadRequest();
        }

        _goAssignmentRepository.Update(goAssignment);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goAssignment = _goAssignmentRepository.GetById(key);
        if (goAssignment is null)
        {
            return BadRequest();
        }

        _goAssignmentRepository.Delete(goAssignment.First());

        return NoContent();
    }


}

