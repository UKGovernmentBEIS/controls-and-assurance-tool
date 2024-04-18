using CAT.Models;

namespace CAT.Repo.Interface;

public interface ICLVacancyTypeRepository
{
    public IQueryable<CLVacancyType> GetById(int id);
    public CLVacancyType? Find(int key);
    public IQueryable<CLVacancyType> GetAll();
}
