using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;

public class GIAAUpdateRepository : BaseRepository, IGIAAUpdateRepository
{
    private readonly ControlAssuranceContext _context;
    public GIAAUpdateRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
        : base(context, httpContextAccessor)
    {
        _context = context;
    }

    public IQueryable<GIAAUpdate> GetById(int id)
    {
        return _context.GIAAUpdates
            .AsQueryable()
            .Where(c => c.ID == id);
    }

    public GIAAUpdate? Find(int key)
    {
        return _context.GIAAUpdates.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<GIAAUpdate> GetAll()
    {
        return _context.GIAAUpdates.AsQueryable();
    }

    public List<GIAAUpdateView_Result> GetUpdates(int giaaRecommendationId)
    {
        List<GIAAUpdateView_Result> retList = new List<GIAAUpdateView_Result>();

        var qry = from u in _context.GIAAUpdates
                  where u.GIAARecommendationId == giaaRecommendationId
                  select new
                  {
                      u.ID,
                      u.Title,
                      u.UpdateType,
                      UpdateBy = u.UpdatedBy.Title,
                      u.UpdateDate,
                      u.UpdateDetails,
                      Status = u.GIAAActionStatusType.Title,
                      u.RevisedDate,
                      u.EvFileName,
                      u.EvIsLink,
                      u.RequestClose,
                      u.RequestDateChange,
                      u.RequestDateChangeTo,
                      u.RequestStatusOpen,

                  };

        var list = qry.ToList();

        foreach (var ite in list)
        {
            string requests = "";
            if (ite.RequestClose == true)
            {
                string s1 = "";
                if (ite.RequestStatusOpen == false)
                {
                    s1 = " - Done";
                }
                requests = $"Close Req{s1}";
            }
            else if (ite.RequestDateChange == true)
            {
                string s1 = "";
                if (ite.RequestStatusOpen == false)
                {
                    s1 = " - Done";
                }
                requests = $"Revise Date ( {ite.RequestDateChangeTo?.ToString("dd/MM/yyyy") ?? ""} ){s1}";
            }
            GIAAUpdateView_Result item = new GIAAUpdateView_Result
            {
                ID = ite.ID,
                Title = ite.Title,
                UpdateType = ite.UpdateType,
                UpdateBy = ite.UpdateBy,
                UpdateDate = ite.UpdateDate != null ? ite.UpdateDate.Value.ToString("dd/MM/yyyy HH:mm") : "",
                UpdateDetails = ite.UpdateDetails != null ? ite.UpdateDetails : "",
                Requests = requests,
                Status = ite.Status != null ? ite.Status : "",
                RevisedDate = ite.RevisedDate != null ? ite.RevisedDate.Value.ToString("dd/MM/yyyy") : "",
                Evidence = ite.EvFileName != null ? ite.EvFileName : "",
                EvIsLink = ite.EvIsLink ?? false,
                EvType = ite.EvFileName == null ? "" : ite.EvIsLink == true ? "Link" : (ite.EvFileName.ToLower().EndsWith(".pdf")) ? "PDF" : "",

            };

            retList.Add(item);

        }


        return retList;
    }

    public void Create(GIAAUpdate gIAAUpdate)
    {
        gIAAUpdate.UpdateDate = DateTime.Now;
        gIAAUpdate.UpdatedById = ApiUser.ID;


        _context.GIAAUpdates.Add(gIAAUpdate);
        _context.SaveChanges();

        if (gIAAUpdate.UpdateType == GIAAUpdateTypes.ActionUpdate)
        {
            if (gIAAUpdate.RequestClose == true)
            {
                gIAAUpdate.RequestDateChangeTo = null;
                gIAAUpdate.RequestStatusOpen = true;
            }
            else if (gIAAUpdate.RequestDateChange == true)
            {
                gIAAUpdate.RequestStatusOpen = true;
            }
            //set updateStatus to blank - means update is provided
            _context.Entry(gIAAUpdate).Reference(u => u.GIAARecommendation).Load();
            if (gIAAUpdate != null && gIAAUpdate.GIAARecommendation != null)
            {
                gIAAUpdate.GIAARecommendation.UpdateStatus = "Blank";
            }

            _context.SaveChanges();
        }
        else if (gIAAUpdate.UpdateType == GIAAUpdateTypes.Status_DateUpdate)
        {
            //copy values back to rec
            _context.Entry(gIAAUpdate).Reference(u => u.GIAARecommendation).Load();
            if (gIAAUpdate != null && gIAAUpdate.GIAARecommendation != null)
            {
                gIAAUpdate.GIAARecommendation.GIAAActionStatusTypeId = gIAAUpdate.GIAAActionStatusTypeId;
                gIAAUpdate.GIAARecommendation.RevisedDate = gIAAUpdate.RevisedDate;
            }                
            
            _context.SaveChanges();

            if (gIAAUpdate?.MarkAllReqClosed == true)
            {
                var reqStatusOpenUpdates = _context.GIAAUpdates.Where(x => x.GIAARecommendationId == gIAAUpdate.GIAARecommendationId && x.RequestStatusOpen == true);
                foreach (var ite in reqStatusOpenUpdates)
                {
                    ite.RequestStatusOpen = false;
                }
            }
            _context.SaveChanges();

        }
        RecStatusUpdate(gIAAUpdate?.GIAARecommendationId);

    }

    private void RecStatusUpdate(int? recommendationId)
    {
        var rec = _context.GIAARecommendations.FirstOrDefault(r => r.ID == recommendationId);
        if (rec != null)
        {
            int totalUpdatesThisMonth = 0;
            int totalRequestStatusOpen = 0;
            DateTime todaysDate = DateTime.Now;
            try
            {
                totalUpdatesThisMonth = rec.GIAAUpdates.Count(x => (x.UpdateType == "Action Update") && x.UpdateDate != null && x.UpdateDate.Value.Month == todaysDate.Month && x.UpdateDate.Value.Year == todaysDate.Year);
            }
            catch { }

            try
            {
                totalRequestStatusOpen = rec.GIAAUpdates.Count(x => x.RequestStatusOpen == true);
            }
            catch { }

            if (rec.GIAAActionStatusTypeId == 2)
            {
                //if rec is Closed
                rec.UpdateStatus = "Blank";
            }
            else if (totalRequestStatusOpen > 0)
            {
                //if totalRequestStatusOpen > 1 then set ReqUpdateFrom to 'GIAA Staff'.
                rec.UpdateStatus = "GIAA Staff";
            }
            else if (rec.GIAAActionStatusTypeId == 3 && totalUpdatesThisMonth == 0)
            {
                //If status is overdue and no 'Action Updates' found for this month then set ReqUpdateFrom to 'Action Owner'.
                rec.UpdateStatus = "Action Owner";
            }
            else
            {
                rec.UpdateStatus = "Blank";
            }
            _context.SaveChanges();
        }
    }

    public void Update(GIAAUpdate gIAAUpdate)
    {
        var update = _context.GIAAUpdates.FirstOrDefault(x => x.ID == gIAAUpdate.ID);
        if(update != null)
        {
            update.EvFileName = gIAAUpdate.EvFileName; //update only called to update this
            _context.SaveChanges();
        }
    }

    public void Delete(GIAAUpdate gIAAUpdate)
    {
        _context.GIAAUpdates.Remove(gIAAUpdate);
        _context.SaveChanges();
    }
}
