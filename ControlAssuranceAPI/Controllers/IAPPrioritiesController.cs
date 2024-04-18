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
public class IAPPrioritiesController : ControllerBase
{
    private readonly IIAPPriorityRepository _iAPPriorityRepository;
    public IAPPrioritiesController(IIAPPriorityRepository iAPPriorityRepository)
    {
        _iAPPriorityRepository = iAPPriorityRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPPriority> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPPriorityRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPPriority> Get()
    {
        return _iAPPriorityRepository.GetAll();
    }



}

