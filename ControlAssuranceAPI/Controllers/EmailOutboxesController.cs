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
public class EmailOutboxesController : ControllerBase
{
    private readonly IEmailOutboxRepository _emailOutboxRepository;
    public EmailOutboxesController(IEmailOutboxRepository emailOutboxRepository)
    {
        _emailOutboxRepository = emailOutboxRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<EmailOutbox> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_emailOutboxRepository.GetById(key));
    }


    [EnableQuery]
    public IQueryable<EmailOutbox> Get()
    {
        return _emailOutboxRepository.GetAll();
    }

    //GET: odata/EmailOutboxes?itemIds=1,2
    [ODataRoute("EmailOutboxes?itemIds={itemIds}")]
    public string Get(string itemIds)
    {
        _emailOutboxRepository.DeleteItems(itemIds);
        return "deleted";
    }



}

