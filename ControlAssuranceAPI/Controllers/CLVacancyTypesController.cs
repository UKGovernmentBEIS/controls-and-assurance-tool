using CAT.Models;
using CAT.Repo.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.OData;

namespace CAT.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CLVacancyTypesController : ControllerBase
{
    private readonly ICLVacancyTypeRepository _cLVacancyTypeRepository;
    public CLVacancyTypesController(ICLVacancyTypeRepository cLVacancyTypeRepository)
    {
        _cLVacancyTypeRepository = cLVacancyTypeRepository;
    }


    [EnableQuery]
    [HttpGet("{id}")] 
    public SingleResult<CLVacancyType> Get([FromODataUri] int key)
    {
        return SingleResult.Create(_cLVacancyTypeRepository.GetById(key));
    }

    [EnableQuery]
    public IQueryable<CLVacancyType> Get()
    {
        return _cLVacancyTypeRepository.GetAll();
    }




}

