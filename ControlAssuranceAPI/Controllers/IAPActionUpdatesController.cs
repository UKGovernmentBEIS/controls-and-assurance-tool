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
public class IAPActionUpdatesController : ControllerBase
{
    private readonly IIAPActionUpdateRepository _iAPActionUpdateRepository;
    public IAPActionUpdatesController(IIAPActionUpdateRepository iAPActionUpdateRepository)
    {
        _iAPActionUpdateRepository = iAPActionUpdateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPActionUpdate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPActionUpdateRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPActionUpdate> Get()
    {
        return _iAPActionUpdateRepository.GetAll();
    }

    // GET: /odata/IAPActionUpdates?iapUpdateId=1&dataForUpdatesList=
    [ODataRoute("IAPActionUpdates?iapUpdateId={iapUpdateId}&dataForUpdatesList={dataForUpdatesList}")]
    public List<IAPActionUpdateView_Result> Get(int iapUpdateId, string dataForUpdatesList)
    {
        return _iAPActionUpdateRepository.GetActionUpdates(iapUpdateId);
    }

    [HttpPost]
    public IActionResult Post([FromBody] IAPActionUpdate iAPActionUpdate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _iAPActionUpdateRepository.Create(iAPActionUpdate);

        return Created("IAPActionUpdates", iAPActionUpdate);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] IAPActionUpdate iAPActionUpdate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != iAPActionUpdate.ID)
        {
            return BadRequest();
        }

        _iAPActionUpdateRepository.Update(iAPActionUpdate);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var iAPActionUpdate = _iAPActionUpdateRepository.GetById(key);
        if (iAPActionUpdate is null)
        {
            return BadRequest();
        }

        _iAPActionUpdateRepository.Delete(iAPActionUpdate.First());

        return NoContent();
    }


}

