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
public class IAPTypesController : ControllerBase
{
    private readonly IIAPTypeRepository _iAPTypeRepository;
    public IAPTypesController(IIAPTypeRepository iAPTypeRepository)
    {
        _iAPTypeRepository = iAPTypeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPTypeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPType> Get()
    {
        return _iAPTypeRepository.GetAll();
    }



}

