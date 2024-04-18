using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TeamMembersController : ControllerBase
{
    private readonly ITeamMemberRepository _teamMemberRepository;
    public TeamMembersController(ITeamMemberRepository teamMemberRepository)
    {
        _teamMemberRepository = teamMemberRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<TeamMember> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_teamMemberRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<TeamMember> Get()
    {
        return _teamMemberRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] TeamMember teamMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _teamMemberRepository.Create(teamMember);

        return Created("TeamMembers", teamMember);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] TeamMember teamMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != teamMember.ID)
        {
            return BadRequest();
        }

        _teamMemberRepository.Update(teamMember);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var teamMember = _teamMemberRepository.GetById(key);
        if (teamMember is null)
        {
            return BadRequest();
        }

        _teamMemberRepository.Delete(teamMember.First());

        return NoContent();
    }


}

