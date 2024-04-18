using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DirectorateGroupMembersController : ControllerBase
{
    private readonly IDirectorateGroupMemberRepository _directorateGroupMemberRepository;
    public DirectorateGroupMembersController(IDirectorateGroupMemberRepository directorateGroupMemberRepository)
    {
        _directorateGroupMemberRepository = directorateGroupMemberRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<DirectorateGroupMember> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_directorateGroupMemberRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<DirectorateGroupMember> Get()
    {
        return _directorateGroupMemberRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] DirectorateGroupMember directorateGroupMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _directorateGroupMemberRepository.Create(directorateGroupMember);

        return Created("DirectorateGroupMembers", directorateGroupMember);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] DirectorateGroupMember directorateGroupMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != directorateGroupMember.ID)
        {
            return BadRequest();
        }

        _directorateGroupMemberRepository.Update(directorateGroupMember);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var directorateGroupMember = _directorateGroupMemberRepository.GetById(key);
        if (directorateGroupMember is null)
        {
            return BadRequest();
        }

        _directorateGroupMemberRepository.Delete(directorateGroupMember.First());

        return NoContent();
    }


}

