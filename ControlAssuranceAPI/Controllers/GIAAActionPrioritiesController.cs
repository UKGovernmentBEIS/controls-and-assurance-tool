using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GIAAActionPrioritiesController : ControllerBase
{
    private readonly IGIAAActionPriorityRepository _gIAAActionPriorityRepository;
    public GIAAActionPrioritiesController(IGIAAActionPriorityRepository gIAAActionPriorityRepository )
    {
        _gIAAActionPriorityRepository = gIAAActionPriorityRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAActionPriority> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAActionPriorityRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAActionPriority> Get()
    {
        return _gIAAActionPriorityRepository.GetAll();
    }




}

