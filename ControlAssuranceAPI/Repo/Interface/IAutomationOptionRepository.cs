using CAT.Models;

namespace CAT.Repo.Interface
{
    public interface IAutomationOptionRepository
    {
        public IQueryable<AutomationOption> GetById(int id);
        public AutomationOption? Find(int key);
        public IQueryable<AutomationOption> GetAll();
        public string ProcessAsAutoFunction_SendFromOutbox();
        public string ProcessAsAutoFunction();
        public void Update(AutomationOption automationOption);

    }
}
