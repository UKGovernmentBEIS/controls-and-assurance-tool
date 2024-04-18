using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAOUpdateFeedbackTypeRepository
{
    public IQueryable<NAOUpdateFeedbackType> GetById(int id);
    public NAOUpdateFeedbackType? Find(int key);
    public IQueryable<NAOUpdateFeedbackType> GetAll();
    public void Create(NAOUpdateFeedbackType nAOUpdateFeedbackType);
    public void Update(NAOUpdateFeedbackType nAOUpdateFeedbackType);
    public void Delete(NAOUpdateFeedbackType nAOUpdateFeedbackType);
}
