using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class NAORecStatusTypesController : ControllerBase
{
    private readonly INAORecStatusTypeRepository _userRepository;
    public NAORecStatusTypesController(INAORecStatusTypeRepository userRepository)
    {
        _userRepository = userRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAORecStatusType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_userRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<NAORecStatusType> Get()
    {
        return _userRepository.GetAll();
    }


}

