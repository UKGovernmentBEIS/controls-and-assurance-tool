using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GIAAAssurancesController : ControllerBase
{
    private readonly IGIAAAssuranceRepository _gIAAAssuranceRepository;
    public GIAAAssurancesController(IGIAAAssuranceRepository gIAAAssuranceRepository)
    {
        _gIAAAssuranceRepository = gIAAAssuranceRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAAssurance> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAAssuranceRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAAssurance> Get()
    {
        return _gIAAAssuranceRepository.GetAll();
    }




}

