using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class GIAAAuditReportDirectoratesController : ControllerBase
{
    private readonly IGIAAAuditReportDirectorateRepository _gIAAAuditReportDirectorateRepository;
    public GIAAAuditReportDirectoratesController(IGIAAAuditReportDirectorateRepository gIAAAuditReportDirectorateRepository)
    {
        _gIAAAuditReportDirectorateRepository = gIAAAuditReportDirectorateRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<GIAAAuditReportDirectorate> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_gIAAAuditReportDirectorateRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<GIAAAuditReportDirectorate> Get()
    {
        return _gIAAAuditReportDirectorateRepository.GetAll();
    }

    [HttpPost]
    public IActionResult Post([FromBody] GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _gIAAAuditReportDirectorateRepository.Create(gIAAAuditReportDirectorate);

        return Created("GIAAAuditReportDirectorates", gIAAAuditReportDirectorate);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] GIAAAuditReportDirectorate gIAAAuditReportDirectorate)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != gIAAAuditReportDirectorate.ID)
        {
            return BadRequest();
        }

        _gIAAAuditReportDirectorateRepository.Update(gIAAAuditReportDirectorate);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var gIAAAuditReportDirectorate = _gIAAAuditReportDirectorateRepository.GetById(key);
        if (gIAAAuditReportDirectorate is null)
        {
            return BadRequest();
        }

        _gIAAAuditReportDirectorateRepository.Delete(gIAAAuditReportDirectorate.First());

        return NoContent();
    }


}

