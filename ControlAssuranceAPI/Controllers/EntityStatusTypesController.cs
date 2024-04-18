using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class EntityStatusTypesController : ControllerBase
{
    private readonly IEntityStatusTypeRepository _entityStatusTypeRepository;
    public EntityStatusTypesController(IEntityStatusTypeRepository entityStatusTypeRepository)
    {
        _entityStatusTypeRepository = entityStatusTypeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<EntityStatusType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_entityStatusTypeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<EntityStatusType> Get()
    {
        return _entityStatusTypeRepository.GetAll();
    }


}

