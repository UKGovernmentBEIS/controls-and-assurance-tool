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
public class NAOPublicationDirectoratesController : ControllerBase
{
    private readonly INAOPublicationDirectorateRepository _nAOPublicationDirectorateRepository;
    public NAOPublicationDirectoratesController(INAOPublicationDirectorateRepository nAOPublicationDirectorateRepository)
    {
        _nAOPublicationDirectorateRepository = nAOPublicationDirectorateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOPublicationDirectorate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_nAOPublicationDirectorateRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOPublicationDirectorate> Get()
    {
        return _nAOPublicationDirectorateRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] NAOPublicationDirectorate nAOPublicationDirectorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _nAOPublicationDirectorateRepository.Create(nAOPublicationDirectorate);

        return Created("NAOPublicationDirectorates", nAOPublicationDirectorate);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] NAOPublicationDirectorate nAOPublicationDirectorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != nAOPublicationDirectorate.ID)
        {
            return BadRequest();
        }

        _nAOPublicationDirectorateRepository.Update(nAOPublicationDirectorate);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var nAOPublicationDirectorate = _nAOPublicationDirectorateRepository.GetById(key);
        if (nAOPublicationDirectorate is null)
        {
            return BadRequest();
        }

        _nAOPublicationDirectorateRepository.Delete(nAOPublicationDirectorate.First());

        return NoContent();
    }


}

