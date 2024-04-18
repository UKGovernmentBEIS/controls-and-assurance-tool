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
public class IAPActionsController : ControllerBase
{
    private readonly IIAPActionRepository _iAPActionRepository;
    public IAPActionsController(IIAPActionRepository iAPActionRepository)
    {
        _iAPActionRepository = iAPActionRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPAction> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPActionRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPAction> Get()
    {
        return _iAPActionRepository.GetAll();
    }

    //GET: odata/IAPActions?actionId=1&countUpdatesForAction=&extraP=
    [ODataRoute("IAPActions?actionId={actionId}&countUpdatesForAction={countUpdatesForAction}&extraP={extraP}")]
    [EnableQuery]
    public string Get(int actionId, string countUpdatesForAction, string extraP)
    {
        int totalUpdates = _iAPActionRepository.CountUpdatesForAction(actionId);
        return totalUpdates.ToString();
    }

    // GET: /odata/IAPActions?userIds=1,2&isArchive=false
    [ODataRoute("IAPActions?userIds={userIds}&isArchive={isArchive}")]
    public List<IAPActionView_Result> Get(string userIds, bool isArchive)
    {
        return _iAPActionRepository.GetActions(userIds, isArchive);
    }

    // GET: /odata/IAPActions?parentActionId=1&getGroups
    [ODataRoute("IAPActions?parentActionId={parentActionId}&getGroups={getGroups}")]
    public List<IAPActionView_Result> Get(int parentActionId, string getGroups)
    {
        return _iAPActionRepository.GetActionGroups(parentActionId);
    }



    [HttpPost]
    public IActionResult Post([FromBody] IAPAction iAPAction)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _iAPActionRepository.Create(iAPAction);

        return Created("IAPActions", iAPAction);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] IAPAction iAPAction)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != iAPAction.ID)
        {
            return BadRequest();
        }

        _iAPActionRepository.Update(iAPAction);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var iAPAction = _iAPActionRepository.GetById(key);
        if (iAPAction is null)
        {
            return BadRequest();
        }

        _iAPActionRepository.Delete(iAPAction.First());

        return NoContent();
    }


}

