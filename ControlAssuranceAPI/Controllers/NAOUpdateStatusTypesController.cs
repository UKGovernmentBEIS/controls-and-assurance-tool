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
public class NAOUpdateStatusTypesController : ControllerBase
{
    private readonly INAOUpdateStatusTypeRepository _userRepository;
    public NAOUpdateStatusTypesController(INAOUpdateStatusTypeRepository userRepository)
    {
        _userRepository = userRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOUpdateStatusType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_userRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOUpdateStatusType> Get()
    {
        return _userRepository.GetAll();
    }


}

