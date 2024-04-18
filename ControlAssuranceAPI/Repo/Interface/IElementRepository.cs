using CAT.Models;

namespace CAT.Repo.Interface;

public interface IElementRepository
{
    public IQueryable<Element> GetById(int id);
    public Element? Find(int key);
    public IQueryable<Element> GetAll();
    public Element Create(Element element);
}
