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
public class DefElementGroupsController : ControllerBase
{
    private readonly IDefElementGroupRepository _defElementGroupRepository;
    public DefElementGroupsController(IDefElementGroupRepository defElementGroupRepository)
    {
        _defElementGroupRepository = defElementGroupRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")]
    public SingleResult<DefElementGroup> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_defElementGroupRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<DefElementGroup> Get()
    {
        return _defElementGroupRepository.GetAll();
    }

    //GET: odata/DefElementGroups(1)/DefElements
    [EnableQuery]
    [HttpGet("{id}/DefElements")]
    public IQueryable<DefElement> GetDefElements([FromODataUri] int key)
    {
        return _defElementGroupRepository.GetDefElements(key);
    }




    [HttpPost]
    public IActionResult Post([FromBody] DefElementGroup defElementGroup)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _defElementGroupRepository.Create(defElementGroup);

        return Created("DefElementGroups", defElementGroup);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] DefElementGroup defElementGroup)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != defElementGroup.ID)
        {
            return BadRequest();
        }

        _defElementGroupRepository.Update(defElementGroup);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var user = _defElementGroupRepository.GetById(key);
        if (user is null)
        {
            return BadRequest();
        }

        _defElementGroupRepository.Delete(user.First());

        return NoContent();
    }


}

