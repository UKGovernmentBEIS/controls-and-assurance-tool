using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class PlatformsController : ControllerBase
{
    private readonly IPlatformRepository _platformRepository;
    public PlatformsController(IPlatformRepository platformRepository)
    {
        _platformRepository = platformRepository;
    }

    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<Platform> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_platformRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<Platform> Get()
    {
        return _platformRepository.GetAll();
    }
}

