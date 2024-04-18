using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class DefElementRepository : IDefElementRepository
{
    private readonly ControlAssuranceContext _context;
    public DefElementRepository(ControlAssuranceContext context)
    {
        _context = context;
    }

    public IQueryable<DefElement> GetById(int id)
    {
        return _context.DefElements
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IQueryable<DefElement> GetAll()
    {
        return _context.DefElements.AsQueryable();
    }

    public IQueryable<Element> GetElements(int defElementId)
    {
        return _context.DefElements.Where(de => de.ID == defElementId).SelectMany(de => de.Elements);
    }

    public void Create(DefElement defElement)
    {
        _context.DefElements.Add(defElement);
        _context.SaveChanges();
    }

    public void Update(DefElement defElement)
    {
        defElement.SectionANumQuestions = CountTotalQuestionsSectionA(defElement);
        _context.DefElements.Update(defElement);
        _context.SaveChanges();
    }

    public void Delete(DefElement defElement)
    {
        _context.DefElements.Remove(defElement);
        _context.SaveChanges();
    }

    public List<DefElementVew_Result> GetDefElements(int periodId, int formId)
    {

        List<DefElementVew_Result> retList = new List<DefElementVew_Result>();

        var qry = from d in _context.DefElements
                  where d.PeriodId == periodId
                  select new
                  {
                      d.ID,
                      d.Title,
                      DefElementGroup = d.DefElementGroup != null ? d.DefElementGroup.Title : "",
                      Element = d.Elements.FirstOrDefault(e => e.FormId == formId)

                  };


        var list = qry.ToList();

        foreach (var ite in list)
        {
            string status = ite.Element?.Status ?? "";

            DefElementVew_Result item = new DefElementVew_Result
            {
                ID = ite.ID,
                Title = ite.Title,
                DefElementGroup = ite.DefElementGroup,
                Status = status
            };
            retList.Add(item);
        }
        return retList;
    }


    public string GetFormStatus(int periodId, int formId)
    {

        List<string> lstCompletionStatus = new List<string>();
        string overAllStatus = "To Be Completed"; //default value


        var qry = from d in _context.DefElements
                  where d.PeriodId == periodId
                  select new
                  {
                      d.ID,
                      d.Title,
                      Element = d.Elements.FirstOrDefault(e => e.FormId == formId)                    
                  };

        var list = qry.ToList();

        foreach (var ite in list.Select(ite => ite.Element))
        {
            var status = ite?.Status ?? "";
            if(!string.IsNullOrEmpty(status))
                lstCompletionStatus.Add(status);
        }

        if (lstCompletionStatus.Count > 0)
        {
            int totalCount = lstCompletionStatus.Count;
            int totalCompleted = lstCompletionStatus.Count(x => x == "Completed" || x == "NotApplicable");
            int totalInProgress = lstCompletionStatus.Count(x => x == "InProgress");

            if (totalCount == totalCompleted)
            {
                overAllStatus = "Completed";
            }
            else if (totalInProgress > 0 || totalCompleted > 0)
            {
                overAllStatus = "In Progress";
            }
        }


        return overAllStatus;
    }

    public int CountTotalQuestionsSectionA(DefElement defElement)
    {
        int totalCount = 0;

        if (!string.IsNullOrEmpty(defElement.SectionAQuestion1)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion2)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion3)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion4)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion5)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion6)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion7)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion8)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion9)) totalCount++;
        if (!string.IsNullOrEmpty(defElement.SectionAQuestion10)) totalCount++;

        return totalCount;
    }
}
