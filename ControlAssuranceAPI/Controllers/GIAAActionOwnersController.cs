using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GIAAActionOwnersController : ControllerBase
{
    private readonly IGIAAActionOwnerRepository _gIAAActionOwnerRepository;
    public GIAAActionOwnersController(IGIAAActionOwnerRepository gIAAActionOwnerRepository)
    {
        _gIAAActionOwnerRepository = gIAAActionOwnerRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAActionOwner> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAActionOwnerRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAActionOwner> Get()
    {
        return _gIAAActionOwnerRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] GIAAActionOwner gIAAActionOwner)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _gIAAActionOwnerRepository.Create(gIAAActionOwner);

        return Created("GIAAActionOwners", gIAAActionOwner);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GIAAActionOwner gIAAActionOwner)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != gIAAActionOwner.ID)
        {
            return BadRequest();
        }

        _gIAAActionOwnerRepository.Update(gIAAActionOwner);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var gIAAActionOwner = _gIAAActionOwnerRepository.GetById(key);
        if (gIAAActionOwner is null)
        {
            return BadRequest();
        }

        _gIAAActionOwnerRepository.Delete(gIAAActionOwner.First());

        return NoContent();
    }


}

