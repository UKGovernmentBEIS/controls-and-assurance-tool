using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
//[Route("odata/users")]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    //GET: odata/Users?firstRequest=&checkDB=&checkCurrentUser
    [ODataRoute("Users?firstRequest={firstRequest}&checkDB={checkDb}&checkCurrentUser={checkCurrentUser}")]
    [EnableQuery]
    public string Get(string firstRequest, string checkDb, string checkCurrentUser)
    {
        return _userRepository.FirstRequest();
    }

    // GET: odata/Users?currentUser=
    [ODataRoute("Users?currentUser={currentUser}")]
    [EnableQuery]
    public IQueryable<User> Get(string currentUser)
    {
        return _userRepository.GetCurrentUser();
    }

    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<User> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_userRepository.GetById(key));
    }

    [EnableQuery]
    [HttpGet]
    public IQueryable<User> Get()
    {
        return _userRepository.GetAll();
    }

    //GET: odata/Users(1)/UserPermissions
    [EnableQuery]
    [HttpGet("{id}/UserPermissions")]
    public IQueryable<UserPermission> GetUserPermissions([FromODataUri] int key)
    {
        return _userRepository.GetUserPermissions(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _userRepository.Create(user);

        return Created("Users", user);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != user.ID)
        {
            return BadRequest();
        }

        _userRepository.Update(user);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var user = _userRepository.GetById(key);
        if (user is null)
        {
            return BadRequest();
        }

        _userRepository.Delete(user.First());

        return NoContent();
    }


}

