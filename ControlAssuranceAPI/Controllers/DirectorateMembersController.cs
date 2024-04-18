using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class DirectorateMembersController : ControllerBase
{
    private readonly IDirectorateMemberRepository _directorateMemberRepository;
    public DirectorateMembersController(IDirectorateMemberRepository directorateMemberRepository)
    {
        _directorateMemberRepository = directorateMemberRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<DirectorateMember> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_directorateMemberRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<DirectorateMember> Get()
    {
        return _directorateMemberRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] DirectorateMember directorateMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _directorateMemberRepository.Create(directorateMember);

        return Created("DirectorateMembers", directorateMember);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] DirectorateMember directorateMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != directorateMember.ID)
        {
            return BadRequest();
        }

        _directorateMemberRepository.Update(directorateMember);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var directorateMember = _directorateMemberRepository.GetById(key);
        if (directorateMember is null)
        {
            return BadRequest();
        }

        _directorateMemberRepository.Delete(directorateMember.First());

        return NoContent();
    }


}

