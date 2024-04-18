using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;
using Microsoft.AspNet.OData.Routing;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UserPermissionsController : ControllerBase
{
    private readonly IUserPermissionRepository _userPermissionRepository;
    public UserPermissionsController(IUserPermissionRepository userPermissionRepository)
    {
        _userPermissionRepository = userPermissionRepository;
    }

    // GET: /odata/UserPermissions?key=1&currentUser=&checkEditDelPermission=true
    [ODataRoute("UserPermissions?key={key}&currentUser={currentUser}&checkEditDelPermission={checkEditDelPermission}")]
    public bool Get(int key, string currentUser, bool checkEditDelPermission)
    {
        return _userPermissionRepository.CheckEditDelPermission(key);
    }

    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<UserPermission> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_userPermissionRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<UserPermission> Get()
    {
        return _userPermissionRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] UserPermission userPermission)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _userPermissionRepository.Create(userPermission);

        return Created("UserPermissions", userPermission);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] UserPermission userPermission)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != userPermission.ID)
        {
            return BadRequest();
        }

        _userPermissionRepository.Update(userPermission);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var userPermission = _userPermissionRepository.GetById(key);
        if (userPermission is null)
        {
            return BadRequest();
        }

        _userPermissionRepository.Delete(userPermission.First());

        return NoContent();
    }


}

