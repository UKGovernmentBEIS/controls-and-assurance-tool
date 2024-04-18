using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IAvailableExportRepository
    {
        public IQueryable<AvailableExport> GetById(int id);
        public IQueryable<AvailableExport> GetAll();
        public void ChangeStatus(int key, string status, string outputFileName);
        public void Delete(AvailableExport availableExport);
    }
}
