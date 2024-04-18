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
public class GoElementActionsController : ControllerBase
{
    private readonly IGoElementActionRepository _goElementActionRepository;
    public GoElementActionsController(IGoElementActionRepository goElementActionRepository)
    {
        _goElementActionRepository = goElementActionRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoElementAction> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goElementActionRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<GoElementAction> Get()
    {
        return _goElementActionRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoElementAction goElementAction)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goElementActionRepository.Create(goElementAction);

        return Created("GoElementActions", goElementAction);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoElementAction goElementAction)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goElementAction.ID)
        {
            return BadRequest();
        }

        _goElementActionRepository.Update(goElementAction);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goElementAction = _goElementActionRepository.GetById(key);
        if (goElementAction is null)
        {
            return BadRequest();
        }

        _goElementActionRepository.Delete(goElementAction.First());

        return NoContent();
    }


}

