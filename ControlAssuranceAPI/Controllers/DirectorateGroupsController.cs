using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
//[Route("odata/users")]
[Route("api/[controller]")]
[ApiController]
public class DirectorateGroupsController : ControllerBase
{
    private readonly IDirectorateGroupRepository _directorateGroupRepository;
    public DirectorateGroupsController(IDirectorateGroupRepository directorateGroupRepository)
    {
        _directorateGroupRepository = directorateGroupRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<DirectorateGroup> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_directorateGroupRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<DirectorateGroup> Get()
    {
        return _directorateGroupRepository.GetAll();
    }

    //GET: odata/DirectorateGroups(1)/Directorates
    [EnableQuery]
    [HttpGet("{id}")]
    public IQueryable<Directorate> GetDirectorates([FromODataUri] int key)
    {
        return _directorateGroupRepository.GetDirectorates(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] DirectorateGroup directorateGroup)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _directorateGroupRepository.Create(directorateGroup);

        return Created("DirectorateGroups", directorateGroup);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] DirectorateGroup directorateGroup)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != directorateGroup.ID)
        {
            return BadRequest();
        }

        _directorateGroupRepository.Update(directorateGroup);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var directorateGroup = _directorateGroupRepository.GetById(key);
        if (directorateGroup is null)
        {
            return BadRequest();
        }

        _directorateGroupRepository.Delete(directorateGroup.First());

        return NoContent();
    }


}

