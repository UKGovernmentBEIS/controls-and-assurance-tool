using CAT.Models;
using CAT.Repo.Interface;

namespace CAT.Repo;
public class FormRepository : BaseRepository, IFormRepository
{
    private readonly ControlAssuranceContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public FormRepository(ControlAssuranceContext context, IHttpContextAccessor httpContextAccessor)
        : base(context, httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public IQueryable<Form> GetById(int id)
    {
        return _context.Forms.AsQueryable().Where(c => c.ID == id);
    }

    public Form? Find(int key)
    {
        return _context.Forms.FirstOrDefault(x => x.ID == key);
    }

    public IQueryable<Form> GetAll()
    {
        return _context.Forms.AsQueryable();
    }

    public Form Create(Form form)
    {
        var formDb = _context.Forms.FirstOrDefault(f => f.TeamId == form.TeamId && f.PeriodId == form.PeriodId);
        if (formDb != null)
            return formDb;
        else
        {
            Form f = _context.Forms.Add(form).Entity;
            _context.SaveChanges();
            return f;
        }
    }

    public void Update(int key)
    {
        var formDb = _context.Forms.FirstOrDefault(f => f.ID == key);
        if(formDb != null)
        {
            int userId = ApiUser.ID;
            var signoffFor = formDb.LastSignOffFor;
            var logRepository = new LogRepository(_context, _httpContextAccessor);
            if (signoffFor == "DD")
            {
                formDb.FirstSignedOff = true;
                formDb.DDSignOffUserId = userId;
                formDb.DDSignOffStatus = true;
                formDb.DDSignOffDate = DateTime.Now;

                logRepository.Write(title: "Deputy Director Signed-Off", category: LogCategory.DDSignOff, periodId: formDb.PeriodId, teamId: formDb.TeamId);
            }
            else if (signoffFor == "Dir")
            {
                formDb.DirSignOffUserId = userId;
                formDb.DirSignOffStatus = true;
                formDb.DirSignOffDate = DateTime.Now;

                logRepository.Write(title: "Director Signed-Off", category: LogCategory.DirSignOff, periodId: formDb.PeriodId, teamId: formDb.TeamId);
            }
            else if (signoffFor == "CLEAR_SIGN-OFFS")
            {
                //special case when super user wants to clear all the sign-offs

                //in this case we need to first send emails before saving data, because emails need data before saving.

                // Let everyone know that a super user has cancelled a form

                //update data now
                formDb.DDSignOffUserId = null;
                formDb.DDSignOffStatus = null;
                formDb.DDSignOffDate = null;
                formDb.DirSignOffUserId = null;
                formDb.DirSignOffStatus = null;
                formDb.DirSignOffDate = null;
                formDb.LastSignOffFor = null;

                logRepository.Write(title: "Cancelled Sign-Offs", category: LogCategory.CancelSignOffs, periodId: formDb.PeriodId, teamId: formDb.TeamId);
            }
            _context.SaveChanges();
        }
        
    }

}
