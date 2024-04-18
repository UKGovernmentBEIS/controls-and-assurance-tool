using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;


public class IAPActionUpdateRepository : BaseRepository, IIAPActionUpdateRepository
{
    private readonly ControlAssuranceContext _context;
    public IAPActionUpdateRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<IAPActionUpdate> GetById(int id)
    {
        return _context.IAPActionUpdates.AsQueryable().Where(c => c.ID == id);
    }

    public IAPActionUpdate? Find(int key)
    {
        return _context.IAPActionUpdates.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<IAPActionUpdate> GetAll()
    {
        return _context.IAPActionUpdates.AsQueryable();
    }

    public List<IAPActionUpdateView_Result> GetActionUpdates(int iapUpdateId)
    {
        List<IAPActionUpdateView_Result> retList = new List<IAPActionUpdateView_Result>();

        var qry = from u in _context.IAPActionUpdates
                  where u.IAPActionId == iapUpdateId
                  select new
                  {
                      u.ID,
                      u.Title,
                      u.UpdateType,
                      UpdateBy = u.UpdatedBy.Title,
                      u.UpdateDate,
                      u.UpdateDetails,
                      Status = (u.IAPAction.IAPTypeId == 6) ? u.IAPStatusType.Title2 : u.IAPStatusType.Title,
                      u.RevisedDate,
                      u.EvFileName,
                      u.EvIsLink
                  };

        var list = qry.ToList();

        foreach (var ite in list)
        {

            IAPActionUpdateView_Result item = new IAPActionUpdateView_Result
            {

                ID = ite.ID,
                Title = ite.Title,
                UpdateType = ite.UpdateType,
                UpdateBy = ite.UpdateBy,
                UpdateDate = ite.UpdateDate != null ? ite.UpdateDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                UpdateDetails = ite.UpdateDetails != null ? ite.UpdateDetails : "",
                Status = ite.Status != null ? ite.Status : "",
                RevisedDate = ite.RevisedDate != null ? ite.RevisedDate.Value.ToString("dd/MM/yyyy") : "",
                Evidence = ite.EvFileName != null ? ite.EvFileName : "",
                EvIsLink = ite.EvIsLink ?? false
            };

            retList.Add(item);
        }

        return retList;
    }

    public IAPActionUpdate Create(IAPActionUpdate iapActionUpdate)
    {
        IAPActionUpdate ret = new IAPActionUpdate();
        iapActionUpdate.UpdateDate = DateTime.Now;
        iapActionUpdate.UpdatedById = ApiUser.ID;

        ret = _context.IAPActionUpdates.Add(iapActionUpdate).Entity;
        _context.SaveChanges();


        if (iapActionUpdate.UpdateType == IAPActionUpdateTypes.ActionUpdate)
        {
            //copy value back to action
            _context.Entry(ret).Reference(u => u.IAPAction).Load();
            if (ret.IAPAction != null)
            {
                ret.IAPAction.IAPStatusTypeId = iapActionUpdate.IAPStatusTypeId;
                _context.SaveChanges();

                if (ret.IAPAction.IAPTypeId == 3 && ret.IAPAction.IAPStatusTypeId > 1)
                {
                    //Group Action, so update parent 
                    int totalChildActions = _context.IAPActions.Count(x => x.ParentId == ret.IAPAction.ParentId);
                    int totalChildActions_Completed = _context.IAPActions.Count(x => x.ParentId == ret.IAPAction.ParentId && x.IAPStatusTypeId == 3);

                    var parentAction = _context.IAPActions.FirstOrDefault(x => x.ID == ret.IAPAction.ParentId);
                    if (parentAction != null)
                    {

                        if (totalChildActions == totalChildActions_Completed)
                        {
                            //make parent action to completed
                            parentAction.IAPStatusTypeId = 3;
                        }
                        else
                        {
                            //make parent action to inprogress
                            parentAction.IAPStatusTypeId = 2;
                        }
                        _context.SaveChanges();
                    } 
                }
            }

        }
        else if (iapActionUpdate.UpdateType == IAPActionUpdateTypes.RevisedDate)
        {
            //copy value back to rec
            _context.Entry(ret).Reference(u => u.IAPAction).Load();
            if (ret.IAPAction != null)
            {
                ret.IAPAction.CompletionDate = iapActionUpdate.RevisedDate;
                _context.SaveChanges();

                if (ret.IAPAction.IAPTypeId == 3)
                {
                    //check revised date for all the childs and get which one has max date, use max date to update parent task
                    var childWithMaxDate = _context.IAPActions.Where(x => x.ParentId == ret.IAPAction.ParentId).OrderByDescending(x => x.CompletionDate).FirstOrDefault();
                    if (childWithMaxDate != null)
                    {
                        var parentAction = _context.IAPActions.FirstOrDefault(x => x.ID == ret.IAPAction.ParentId);
                        if (parentAction != null)
                        {
                            parentAction.CompletionDate = childWithMaxDate.CompletionDate;
                            _context.SaveChanges();
                        }
                    }

                }
            }
        }

        return ret;
    }

    public void Update(IAPActionUpdate iAPActionUpdate)
    {
        iAPActionUpdate.UpdateDate = DateTime.Now;
        _context.IAPActionUpdates.Update(iAPActionUpdate);
        _context.SaveChanges();
    }

    public void Delete(IAPActionUpdate iAPActionUpdate)
    {
        _context.IAPActionUpdates.Remove(iAPActionUpdate);
        _context.SaveChanges();
    }
}
