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
public class IAPActionDirectoratesController : ControllerBase
{
    private readonly IIAPActionDirectorateRepository _iAPActionDirectorateRepository;
    public IAPActionDirectoratesController(IIAPActionDirectorateRepository iAPActionDirectorateRepository)
    {
        _iAPActionDirectorateRepository = iAPActionDirectorateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<IAPActionDirectorate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_iAPActionDirectorateRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<IAPActionDirectorate> Get()
    {
        return _iAPActionDirectorateRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] IAPActionDirectorate iAPActionDirectorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _iAPActionDirectorateRepository.Create(iAPActionDirectorate);

        return Created("IAPActionDirectorates", iAPActionDirectorate);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] IAPActionDirectorate iAPActionDirectorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != iAPActionDirectorate.ID)
        {
            return BadRequest();
        }

        _iAPActionDirectorateRepository.Update(iAPActionDirectorate);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var iAPActionDirectorate = _iAPActionDirectorateRepository.GetById(key);
        if (iAPActionDirectorate is null)
        {
            return BadRequest();
        }

        _iAPActionDirectorateRepository.Delete(iAPActionDirectorate.First());

        return NoContent();
    }


}

