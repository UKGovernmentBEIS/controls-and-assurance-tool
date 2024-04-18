using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOUpdateFeedbackRepository
{
    public IQueryable<NAOUpdateFeedback> GetById(int id);
    public NAOUpdateFeedback? Find(int key);
    public IQueryable<NAOUpdateFeedback> GetAll();
    public void Create(NAOUpdateFeedback nAOUpdateFeedback);
    public void Update(NAOUpdateFeedback nAOUpdateFeedback);
    public void Delete(NAOUpdateFeedback nAOUpdateFeedback);
}