using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
//[Route("odata/PermissionTypes")]
[Route("api/[controller]")]
[ApiController]
public class PermissionTypesController : ControllerBase
{
    private readonly IPermissionTypeRepository _permissionTypeRepository;
    public PermissionTypesController(IPermissionTypeRepository permissionTypeRepository)
    {
        _permissionTypeRepository = permissionTypeRepository;
    }

    [EnableQuery]
    [HttpGet("{id}")]
    public SingleResult<PermissionType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_permissionTypeRepository.GetById(key));
    }



    [EnableQuery]
    public IQueryable<PermissionType> Get()
    {
        return _permissionTypeRepository.GetAll();
    }

    // GET: odata/PermissionTypes?currentUser=
    [ODataRoute("PermissionTypes?currentUser={currentUser}")]
    [EnableQuery]
    public IQueryable<PermissionType> Get(string currentUser)
    {
        return _permissionTypeRepository.PermissionTypesForUser;
    }

}

