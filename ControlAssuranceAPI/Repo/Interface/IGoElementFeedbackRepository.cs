using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoElementFeedbackRepository
{
    public IQueryable<GoElementFeedback> GetById(int id);
    public GoElementFeedback? Find(int key);
    public IQueryable<GoElementFeedback> GetAll();
    public void Create(GoElementFeedback goElementFeedback);
    public void Update(GoElementFeedback goElementFeedback);
    public void Delete(GoElementFeedback goElementFeedback);
}
