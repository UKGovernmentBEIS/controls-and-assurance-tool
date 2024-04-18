using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class IAPAssignmentsController : ControllerBase
{
    private readonly IIAPAssignmentRepository _iAPAssignmentRepository;
    public IAPAssignmentsController(IIAPAssignmentRepository iAPAssignmentRepository)
    {
        _iAPAssignmentRepository = iAPAssignmentRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPAssignment> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPAssignmentRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPAssignment> Get()
    {
        return _iAPAssignmentRepository.GetAll();
    }

    // GET: /odata/IAPAssignments?parentIAPActionId=1&getAllAssignmentsForParentAction=
    [ODataRoute("IAPAssignments?parentIAPActionId={parentIAPActionId}&getAllAssignmentsForParentAction={getAllAssignmentsForParentAction}")]
    public List<IAPAssignment> Get(int parentIAPActionId, string getAllAssignmentsForParentAction)
    {
        return _iAPAssignmentRepository.GetAllAssignmentsForParentAction(parentIAPActionId);
    }


    [HttpPost]
    public IActionResult Post([FromBody] IAPAssignment iAPAssignment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _iAPAssignmentRepository.Create(iAPAssignment);

        return Created("IAPAssignments", iAPAssignment);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] IAPAssignment iAPAssignment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != iAPAssignment.ID)
        {
            return BadRequest();
        }

        _iAPAssignmentRepository.Update(iAPAssignment);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var iAPAssignment = _iAPAssignmentRepository.GetById(key);
        if (iAPAssignment is null)
        {
            return BadRequest();
        }

        _iAPAssignmentRepository.Delete(iAPAssignment.First());

        return NoContent();
    }


}

