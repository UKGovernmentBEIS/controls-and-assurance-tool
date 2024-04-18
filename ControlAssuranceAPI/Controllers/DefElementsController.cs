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
public class DefElementsController : ControllerBase
{
    private readonly IDefElementRepository _defElementRepository;
    public DefElementsController(IDefElementRepository defElementRepository)
    {
        _defElementRepository = defElementRepository;
    }

    // GET: /odata/DefElements?periodId=20&formId=83
    [ODataRoute("DefElements?periodId={periodId}&formId={formId}")]
    public List<DefElementVew_Result> Get(int periodId, int formId)
    {
        return _defElementRepository.GetDefElements(periodId, formId);
    }

    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<DefElement> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_defElementRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<DefElement> Get()
    {
        return _defElementRepository.GetAll();
    }

    // GET: odata/DefElements(1)/Elements
    [EnableQuery]
    [HttpGet("{id}/Elements")]
    public IQueryable<Element> GetElements([FromODataUri] int key)
    {
        return _defElementRepository.GetElements(key);
    }


    [HttpPost]
    public IActionResult Post([FromBody] DefElement defElement)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _defElementRepository.Create(defElement);

        return Created("DefElements", defElement);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] DefElement defElement)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != defElement.ID)
        {
            return BadRequest();
        }

        _defElementRepository.Update(defElement);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var user = _defElementRepository.GetById(key);
        if (user is null)
        {
            return BadRequest();
        }

        _defElementRepository.Delete(user.First());

        return NoContent();
    }


}

