using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UserHelpsController : ControllerBase
{
    private readonly IUserHelpRepository _userHelpRepository;
    public UserHelpsController(IUserHelpRepository userHelpRepository)
    {
        _userHelpRepository = userHelpRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<UserHelp> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_userHelpRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<UserHelp> Get()
    {
        return _userHelpRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] UserHelp userHelp)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _userHelpRepository.Create(userHelp);

        return Created("UserHelps", userHelp);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] UserHelp userHelp)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != userHelp.ID)
        {
            return BadRequest();
        }

        _userHelpRepository.Update(userHelp);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var userHelp = _userHelpRepository.GetById(key);
        if (userHelp is null)
        {
            return BadRequest();
        }

        _userHelpRepository.Delete(userHelp.First());

        return NoContent();
    }


}

