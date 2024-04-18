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
public class GoDefElementsController : ControllerBase
{
    private readonly IGoDefElementRepository _goDefElementRepository;
    public GoDefElementsController(IGoDefElementRepository goDefElementRepository)
    {
        _goDefElementRepository = goDefElementRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GoDefElement> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_goDefElementRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<GoDefElement> Get()
    {
        return _goDefElementRepository.GetAll();
    }

    // GET: /odata/GoDefElements?goFormId=1&incompleteOnly=true&justMine=false
    [ODataRoute("GoDefElements?goFormId={goFormId}&incompleteOnly={incompleteOnly}&justMine={justMine}")]
    public List<SpecificAreaView_Result> Get(int goFormId, bool incompleteOnly, bool justMine)
    {
        return _goDefElementRepository.GetEvidenceSpecificAreas(goFormId, incompleteOnly, justMine);
    }

    [HttpPost]
    public IActionResult Post([FromBody] GoDefElement goDefElement)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _goDefElementRepository.Create(goDefElement);

        return Created("GoDefElements", goDefElement);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GoDefElement goDefElement)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != goDefElement.ID)
        {
            return BadRequest();
        }

        _goDefElementRepository.Update(goDefElement);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var goDefElement = _goDefElementRepository.GetById(key);
        if (goDefElement is null)
        {
            return BadRequest();
        }

        _goDefElementRepository.Delete(goDefElement.First());

        return NoContent();
    }


}

