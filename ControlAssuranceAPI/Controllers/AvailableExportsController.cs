using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AvailableExportsController : ControllerBase
{
    private readonly IAvailableExportRepository _availableExportRepository;
    public AvailableExportsController(IAvailableExportRepository availableExportRepository)
    {
        _availableExportRepository = availableExportRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<AvailableExport> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_availableExportRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<AvailableExport> Get()
    {
        return _availableExportRepository.GetAll();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var user = _availableExportRepository.GetById(key);
        if (user is null)
        {
            return BadRequest();
        }

        _availableExportRepository.Delete(user.First());

        return NoContent();
    }


}

