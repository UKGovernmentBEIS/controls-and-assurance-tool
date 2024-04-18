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
public class NAOTypesController : ControllerBase
{
    private readonly INAOTypeRepository _userRepository;
    public NAOTypesController(INAOTypeRepository userRepository)
    {
        _userRepository = userRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<NAOType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_userRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<NAOType> Get()
    {
        return _userRepository.GetAll();
    }



}

