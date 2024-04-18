using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLHiringMembersController : ControllerBase
{
    private readonly ICLHiringMemberRepository _cLHiringMemberRepository;
    public CLHiringMembersController(ICLHiringMemberRepository cLHiringMemberRepository)
    {
        _cLHiringMemberRepository = cLHiringMemberRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLHiringMember> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLHiringMemberRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLHiringMember> Get()
    {
        return _cLHiringMemberRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLHiringMember cLHiringMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLHiringMemberRepository.Create(cLHiringMember);

        return Created("CLHiringMembers", cLHiringMember);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLHiringMember cLHiringMember)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLHiringMember.ID)
        {
            return BadRequest();
        }

        _cLHiringMemberRepository.Update(cLHiringMember);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLHiringMember = _cLHiringMemberRepository.GetById(key);
        if (cLHiringMember is null)
        {
            return BadRequest();
        }

        _cLHiringMemberRepository.Delete(cLHiringMember.First());

        return NoContent();
    }


}

