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
public class GIAAUpdatesController : ControllerBase
{
    private readonly IGIAAUpdateRepository _gIAAUpdateRepository;
    public GIAAUpdatesController(IGIAAUpdateRepository gIAAUpdateRepository)
    {
        _gIAAUpdateRepository = gIAAUpdateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAUpdate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAUpdateRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAUpdate> Get()
    {
        return _gIAAUpdateRepository.GetAll();
    }



    // GET: /odata/GIAAUpdates?giaaRecommendationId=1&dataForUpdatesList=
    [ODataRoute("GIAAUpdates?giaaRecommendationId={giaaRecommendationId}&dataForUpdatesList={dataForUpdatesList}")]
    public List<GIAAUpdateView_Result> Get(int giaaRecommendationId, string dataForUpdatesList)
    {
        return _gIAAUpdateRepository.GetUpdates(giaaRecommendationId);
    }

    [HttpPost]
    public IActionResult Post([FromBody] GIAAUpdate gIAAUpdate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _gIAAUpdateRepository.Create(gIAAUpdate);

        return Created("GIAAUpdates", gIAAUpdate);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GIAAUpdate gIAAUpdate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != gIAAUpdate.ID)
        {
            return BadRequest();
        }

        _gIAAUpdateRepository.Update(gIAAUpdate);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var gIAAUpdate = _gIAAUpdateRepository.GetById(key);
        if (gIAAUpdate is null)
        {
            return BadRequest();
        }

        _gIAAUpdateRepository.Delete(gIAAUpdate.First());

        return NoContent();
    }


}

