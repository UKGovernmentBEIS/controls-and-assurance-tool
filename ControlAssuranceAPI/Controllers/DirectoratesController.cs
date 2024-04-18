using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DirectoratesController : ControllerBase
{
    private readonly IDirectorateRepository _directorateRepository;
    public DirectoratesController(IDirectorateRepository directorateRepository)
    {
        _directorateRepository = directorateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Directorate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_directorateRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<Directorate> Get()
    {
        return _directorateRepository.GetAll();
    }

    //GET: odata/Directorates(1)/Teams
    [EnableQuery]
    [HttpGet("{id}/Teams")]
    public IQueryable<Team> GetTeams([FromODataUri] int key)
    {
        return _directorateRepository.GetTeams(key);
    }



    [HttpPost]
    public IActionResult Post([FromBody] Directorate directorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _directorateRepository.Create(directorate);

        return Created("Directorates", directorate);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] Directorate directorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != directorate.ID)
        {
            return BadRequest();
        }

        _directorateRepository.Update(directorate);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var directorate = _directorateRepository.GetById(key);
        if (directorate is null)
        {
            return BadRequest();
        }

        _directorateRepository.Delete(directorate.First());


        return NoContent();
    }


}

