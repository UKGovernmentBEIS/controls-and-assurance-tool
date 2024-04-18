using CAT.Models;

namespace CAT.Repo.Interface;

public interface IDefElementRepository
{
    public IQueryable<DefElement> GetById(int id);
    public IQueryable<DefElement> GetAll();
    public void Create(DefElement defElement);
    public void Update(DefElement defElement);
    public void Delete(DefElement defElement);
    public List<DefElementVew_Result> GetDefElements(int periodId, int formId);
    public IQueryable<Element> GetElements(int defElementId);
    public string GetFormStatus(int periodId, int formId);
    public int CountTotalQuestionsSectionA(DefElement defElement);

}
