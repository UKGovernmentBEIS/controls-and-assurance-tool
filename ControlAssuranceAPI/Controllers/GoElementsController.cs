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
public class GoElementsController : ControllerBase
{
    private readonly IGoElementRepository _goElementRepository;
    public GoElementsController(IGoElementRepository goElementRepository)
    {
        _goElementRepository = goElementRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoElement> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goElementRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GoElement> Get()
    {
        return _goElementRepository.GetAll();
    }


    [HttpPost]
    public IActionResult Post([FromBody] GoElement goElement)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goElementRepository.Create(goElement);

        return Created("GoElements", goElement);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoElement goElement)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goElement.ID)
        {
            return BadRequest();
        }

        _goElementRepository.Update(goElement);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goElement = _goElementRepository.GetById(key);
        if (goElement is null)
        {
            return BadRequest();
        }

        _goElementRepository.Delete(goElement.First());

        return NoContent();
    }


}

