using CAT.Models;

namespace CAT.Repo.Interface;

public interface INAODefFormRepository
{
    public IQueryable<NAODefForm> GetById(int id);
    public NAODefForm? Find(int key);
    public IQueryable<NAODefForm> GetAll();
    public void Create(NAODefForm naoDefForm);
    public void Update(NAODefForm naoDefForm);
    public void Delete(NAODefForm naoDefForm);
}
