using CAT.Models;

namespace CAT.Repo.Interface;

public interface IGoDefElementRepository
{
    public IQueryable<GoDefElement> GetById(int id);
    public GoDefElement? Find(int key);
    public IQueryable<GoDefElement> GetAll();
    public List<SpecificAreaView_Result> GetEvidenceSpecificAreas(int goFormId, bool incompleteOnly, bool justMine);
    public string getRatingLabel(string ratingNum);
    public void Create(GoDefElement goDefElement);
    public void Update(GoDefElement goDefElement);
    public void Delete(GoDefElement goDefElement);

}
