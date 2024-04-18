using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TeamsController : ControllerBase
{
    private readonly ITeamRepository _teamRepository;
    public TeamsController(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Team> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_teamRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<Team> Get()
    {
        return _teamRepository.GetAll();
    }

    //GET: odata/Teams(1)/Forms
    [EnableQuery]
    [HttpGet("{id}/Forms")]
    public IQueryable<Form> GetForms([FromODataUri] int key)
    {
        return _teamRepository.GetForms(key);
    }



    [HttpPost]
    public IActionResult Post([FromBody] Team team)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _teamRepository.Create(team);

        return Created("Teams", team);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] Team team)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != team.ID)
        {
            return BadRequest();
        }

        _teamRepository.Update(team);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var team = _teamRepository.GetById(key);
        if (team is null)
        {
            return BadRequest();
        }

        _teamRepository.Delete(team.First());


        return NoContent();
    }


}

