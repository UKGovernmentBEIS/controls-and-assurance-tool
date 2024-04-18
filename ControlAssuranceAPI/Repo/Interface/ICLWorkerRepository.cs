using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface ICLWorkerRepository
    {
        public IQueryable<CLWorker> GetAll();
        public IQueryable<CLWorker> GetById(int id);
        public CLWorker? Find(int key);
        public void Update(CLWorker inputWorker);
        public string CreateSDSPdf(int clWorkerId, string spSiteUrl);
        public string CreateCasePdf(int clWorkerId, string spSiteUrl);
        public void Archive(int clWorkerId);


    }
}
