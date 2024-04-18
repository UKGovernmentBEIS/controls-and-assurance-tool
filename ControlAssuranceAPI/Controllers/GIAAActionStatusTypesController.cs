using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GIAAActionStatusTypesController : ControllerBase
{
    private readonly IGIAAActionStatusTypeRepository _gIAAActionStatusTypeRepository;
    public GIAAActionStatusTypesController(IGIAAActionStatusTypeRepository gIAAActionStatusTypeRepository)
    {
        _gIAAActionStatusTypeRepository = gIAAActionStatusTypeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAActionStatusType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAActionStatusTypeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAActionStatusType> Get()
    {
        return _gIAAActionStatusTypeRepository.GetAll();
    }




}

