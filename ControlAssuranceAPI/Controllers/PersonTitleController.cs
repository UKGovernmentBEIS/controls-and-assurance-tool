using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;



namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class PersonTitlesController : ControllerBase
{
    private readonly IPersonTitleRepository _personTitleRepository;
    public PersonTitlesController(IPersonTitleRepository personTitleRepository)
    {
        _personTitleRepository = personTitleRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<PersonTitle> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_personTitleRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<PersonTitle> Get()
    {
        return _personTitleRepository.GetAll();
    }

    // GET: odata/PersonTitles(1)/CLWorkers
    [EnableQuery]
    public IQueryable<CLWorker> GetCLWorkers([FromODataUri] int key)
    {
        return _personTitleRepository.GetCLWorkers(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] PersonTitle personTitle)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _personTitleRepository.Create(personTitle);

        return Created("PersonTitles", personTitle);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] PersonTitle personTitle)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != personTitle.ID)
        {
            return BadRequest();
        }

        _personTitleRepository.Update(personTitle);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var personTitle = _personTitleRepository.GetById(key);
        if (personTitle is null)
        {
            return BadRequest();
        }

        _personTitleRepository.Delete(personTitle.First());

        return NoContent();
    }


}

