using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class CLVacancyTypeRepository : ICLVacancyTypeRepository
{
    private readonly ControlAssuranceContext _context;
    public CLVacancyTypeRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<CLVacancyType> GetById(int id)
    {
        return _context.CLVacancyTypes
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public CLVacancyType? Find(int key)
    {
        return _context.CLVacancyTypes.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<CLVacancyType> GetAll()
    {
        return _context.CLVacancyTypes.AsQueryable();
    }




}
