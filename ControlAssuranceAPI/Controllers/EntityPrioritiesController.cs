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
public class EntityPrioritiesController : ControllerBase
{
    private readonly IEntityPriorityRepository _entityPriorityRepository;
    public EntityPrioritiesController(IEntityPriorityRepository entityPriorityRepository)
    {
        _entityPriorityRepository = entityPriorityRepository;
    }

    [EnableQuery]
    public IQueryable<EntityPriority> Get()
    {
        return _entityPriorityRepository.GetAll();
    }




}

