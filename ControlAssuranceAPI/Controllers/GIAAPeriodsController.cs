using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GIAAPeriodsController : ControllerBase
{
    private readonly IGIAAPeriodRepository _gIAAPeriodRepository;
    public GIAAPeriodsController(IGIAAPeriodRepository gIAAPeriodRepository)
    {
        _gIAAPeriodRepository = gIAAPeriodRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAPeriod> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAPeriodRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAPeriod> Get()
    {
        return _gIAAPeriodRepository.GetAll();
    }




}

