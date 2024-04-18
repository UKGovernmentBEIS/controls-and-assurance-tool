using CAT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;
using CAT.Repo.Interface;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLProfessionalCatsController : ControllerBase
{
    private readonly ICLProfessionalCatRepository _cLProfessionalCatRepository;
    public CLProfessionalCatsController(ICLProfessionalCatRepository cLProfessionalCatRepository)
    {
        _cLProfessionalCatRepository = cLProfessionalCatRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLProfessionalCat> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLProfessionalCatRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLProfessionalCat> Get()
    {
        return _cLProfessionalCatRepository.GetAll();
    }

    // GET: odata/CLProfessionalCats(1)/CLCases
    [EnableQuery]
    public IQueryable<CLCase> GetCLCases([FromODataUri] int key)
    {
        return _cLProfessionalCatRepository.GetCLCases(key);
    }

    [HttpPost]
    public IActionResult Post([FromBody] CLProfessionalCat cLProfessionalCat)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        _cLProfessionalCatRepository.Create(cLProfessionalCat);

        return Created("CLProfessionalCats", cLProfessionalCat);
    }

    [HttpPut]
    public IActionResult Put([FromODataUri] int key, [FromBody] CLProfessionalCat cLProfessionalCat)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (key != cLProfessionalCat.ID)
        {
            return BadRequest();
        }

        _cLProfessionalCatRepository.Update(cLProfessionalCat);

        return NoContent();
    }

    [HttpDelete]
    public IActionResult Delete([FromODataUri] int key)
    {
        var cLProfessionalCat = _cLProfessionalCatRepository.GetById(key);
        if (cLProfessionalCat is null)
        {
            return BadRequest();
        }

        _cLProfessionalCatRepository.Delete(cLProfessionalCat.First());

        return NoContent();
    }

}

