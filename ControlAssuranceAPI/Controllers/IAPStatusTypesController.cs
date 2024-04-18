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
public class IAPStatusTypesController : ControllerBase
{
    private readonly IIAPStatusTypeRepository _iAPStatusTypeRepository;
    public IAPStatusTypesController(IIAPStatusTypeRepository iAPStatusTypeRepository)
    {
        _iAPStatusTypeRepository = iAPStatusTypeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPStatusType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPStatusTypeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPStatusType> Get()
    {
        return _iAPStatusTypeRepository.GetAll();
    }



}

