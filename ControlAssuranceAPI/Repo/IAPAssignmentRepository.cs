using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class IAPAssignmentRepository : IIAPAssignmentRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPAssignmentRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPAssignment> GetById(int id)
    {
        return _context.IAPAssignments
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public IAPAssignment? Find(int key)
    {
        return _context.IAPAssignments.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPAssignment> GetAll()
    {
        return _context.IAPAssignments.AsQueryable();
    }

    public List<IAPAssignment> GetAllAssignmentsForParentAction(int parentIAPActionId)
    {
        //get all child actions for the input parent and use child actions ids as "in" statement

        var childActions = _context.IAPActions.Where(x => x.ParentId == parentIAPActionId).ToList();

        System.Text.StringBuilder sbChildActionIds = new System.Text.StringBuilder();
        foreach (var ite in childActions)
        {
            sbChildActionIds.Append($"{ite.ID},");
        }
        string childActionIds = sbChildActionIds.ToString();
        List<int> lstChildActionIds = new List<int>();
        if (childActionIds.Length > 0)
        {
            childActionIds = childActionIds.Substring(0, childActionIds.Length - 1);
            lstChildActionIds = childActionIds.Split(',').Select(int.Parse).ToList();
        }

        var qry = from a in _context.IAPAssignments
                  where a.IAPActionId != null && lstChildActionIds.Contains(a.IAPActionId.Value)
                  orderby a.GroupNum, a.IAPActionId
                  select a;

        var retList = qry.ToList();

        return retList;

    }

    public void Create(IAPAssignment iAPAssignment)
    {
        iAPAssignment.DateAssigned = DateTime.Now;
        _context.IAPAssignments.Add(iAPAssignment);
        _context.SaveChanges();
    }

    public void Update(IAPAssignment iAPAssignment)
    {
        _context.IAPAssignments.Update(iAPAssignment);
        _context.SaveChanges();
    }

    public void Delete(IAPAssignment iAPAssignment)
    {
        _context.IAPAssignments.Remove(iAPAssignment);
        _context.SaveChanges();
    }
}
