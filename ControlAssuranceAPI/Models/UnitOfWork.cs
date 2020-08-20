using ControlAssuranceAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ControlAssuranceAPI.Models
{
    public class UnitOfWork : IDisposable
    {

        private IPrincipal user;
        private IControlAssuranceContext context;
        private DefFormRepository defFormRepository;
        private DefElementRepository defElementRepository;        
        private DefElementGroupRepository defElementGroupRepository;
        private FormRepository formRepository;
        private ElementRepository elementRepository;
        private TeamRepository teamRepository;
        private PeriodRepository periodRepository;

        private DirectorateRepository directorateRepository;
        private DirectorateGroupRepository directorateGroupRepository;
        private DirectorateGroupMemberRepository directorateGroupMemberRepository;
        private DirectorateMemberRepository directorateMemberRepository;
        private PermissionTypeRepository permissionTypeRepository;
        private TeamMemberRepository teamMemberRepository;
        private UserRepository userRepository;
        private UserPermissionRepository userPermissionRepository;
        private EntityStatusTypeRepository entityStatusTypeRepository;

        private UserHelpRepository userHelpRepository;
        private LogRepository logRepository;
        private AuditFeedbackRepository auditFeedbackRepository;

        private GoDefFormRepository goDefFormRepository;
        private GoMiscFilesRepository goMiscFilesRepository;
        private GoFormRepository goFormRepository;
        private GoDefElementRepository goDefElementRepository;
        private GoElementRepository goElementRepository;
        private GoElementFeedbackRepository goElementFeedbackRepository;
        private GoElementActionRepository goElementActionRepository;
        private GoAssignmentRepository goAssignmentRepository;
        private GoElementEvidenceRepository goElementEvidenceRepository;
        private EntityPriorityRepository entityPriorityRepository;

        private NAODefFormRepository naoDefFormRepository;
        private NAOPeriodRepository naoPeriodRepository;
        private NAOPublicationRepository naoPublicationRepository;
        private NAOPublicationDirectorateRepository nAOPublicationDirectorateRepository;
        private NAOTypeRepository naoTypeRepository;
        private NAORecStatusTypeRepository naoRecStatusTypeRepository;
        private NAOUpdateStatusTypeRepository naoUpdateStatusTypeRepository;
        private NAORecommendationRepository naoRecommendationRepository;
        private NAOUpdateRepository naoUpdateRepository;
        private NAOUpdateEvidenceRepository naoUpdateEvidenceRepository;
        private NAOUpdateFeedbackRepository naoUpdateFeedbackRepository;
        private NAOUpdateFeedbackTypeRepository naoUpdateFeedbackTypeRepository;
        private NAOAssignmentRepository nAOAssignmentRepository;
        private NAOOutputRepository nAOOutputRepository;
        

        private GIAAAssuranceRepository gIAAAssuranceRepository;
        private GIAAPeriodRepository gIAAPeriodRepository;
        private GIAADefFormRepository gIAADefFormRepository;
        private GIAAAuditReportRepository gIAAAuditReportRepository;
        private GIAAActionPriorityRepository gIAAActionPriorityRepository;
        private GIAAActionStatusTypeRepository gIAAActionStatusTypeRepository;
        private GIAARecommendationRepository gIAARecommendationRepository;
        private GIAAUpdateRepository gIAAUpdateRepository;
        private GIAAActionOwnerRepository gIAAActionOwnerRepository;
        private GIAAImportRepository gIAAImportRepository;

        private IAPDefFormRepository iAPDefFormRepository;
        private IAPTypeRepository iAPTypeRepository;
        private IAPStatusTypeRepository iAPStatusTypeRepository;
        private IAPPriorityRepository iAPPriorityRepository;
        private IAPUpdateRepository iAPUpdateRepository;
        private IAPAssignmentRepository iAPAssignmentRepository;

        private SPDGAreaStatRepository spDGAreaStatRepository;
        private SPDirectorateStatRepository spDirectorateStatRepository;
        private SPDivisionStatRepository spDivisionStatRepository;
        private ThemeStatRepository viewThemeStatRepository;

        private EmailRepository emailRepository;

        public UnitOfWork(IPrincipal user)
        {
            this.user = user;
            context = new ControlAssuranceEntities();
        }

        public UnitOfWork(IPrincipal user, IControlAssuranceContext context)
        {
            this.user = user;
            this.context = context;
        }

        public DefFormRepository DefFormRepository
        {
            get
            {
                if (defFormRepository == null)
                {
                    defFormRepository = new DefFormRepository(user, context);
                }
                return defFormRepository;
            }
        }

        public DefElementRepository DefElementRepository
        {
            get
            {
                if (defElementRepository == null)
                {
                    defElementRepository = new DefElementRepository(user, context);
                }
                return defElementRepository;
            }
        }


        public DefElementGroupRepository DefElementGroupRepository
        {
            get
            {
                if (defElementGroupRepository == null)
                {
                    defElementGroupRepository = new DefElementGroupRepository(user, context);
                }
                return defElementGroupRepository;
            }
        }


        public FormRepository FormRepository
        {
            get
            {
                if (formRepository == null)
                {
                    formRepository = new FormRepository(user, context);
                }
                return formRepository;
            }
        }


        public ElementRepository ElementRepository
        {
            get
            {
                if (elementRepository == null)
                {
                    elementRepository = new ElementRepository(user, context);
                }
                return elementRepository;
            }
        }


        public TeamRepository TeamRepository
        {
            get
            {
                if (teamRepository == null)
                {
                    teamRepository = new TeamRepository(user, context);
                }
                return teamRepository;
            }
        }


        public PeriodRepository PeriodRepository
        {
            get
            {
                if (periodRepository == null)
                {
                    periodRepository = new PeriodRepository(user, context);
                }
                return periodRepository;
            }
        }



        public DirectorateRepository DirectorateRepository
        {
            get
            {
                if (directorateRepository == null)
                {
                    directorateRepository = new DirectorateRepository(user, context);
                }
                return directorateRepository;
            }
        }

        public DirectorateGroupRepository DirectorateGroupRepository
        {
            get
            {
                if (directorateGroupRepository == null)
                {
                    directorateGroupRepository = new DirectorateGroupRepository(user, context);
                }
                return directorateGroupRepository;
            }
        }



        public DirectorateGroupMemberRepository DirectorateGroupMemberRepository
        {
            get
            {
                if (directorateGroupMemberRepository == null)
                {
                    directorateGroupMemberRepository = new DirectorateGroupMemberRepository(user, context);
                }
                return directorateGroupMemberRepository;
            }
        }


        public DirectorateMemberRepository DirectorateMemberRepository
        {
            get
            {
                if (directorateMemberRepository == null)
                {
                    directorateMemberRepository = new DirectorateMemberRepository(user, context);
                }
                return directorateMemberRepository;
            }
        }


        public PermissionTypeRepository PermissionTypeRepository
        {
            get
            {
                if (permissionTypeRepository == null)
                {
                    permissionTypeRepository = new PermissionTypeRepository(user, context);
                }
                return permissionTypeRepository;
            }
        }


        public TeamMemberRepository TeamMemberRepository
        {
            get
            {
                if (teamMemberRepository == null)
                {
                    teamMemberRepository = new TeamMemberRepository(user, context);
                }
                return teamMemberRepository;
            }
        }


        public UserRepository UserRepository
        {
            get
            {
                if (userRepository == null)
                {
                    userRepository = new UserRepository(user, context);
                }
                return userRepository;
            }
        }

        public UserPermissionRepository UserPermissionRepository
        {
            get
            {
                if (userPermissionRepository == null)
                {
                    userPermissionRepository = new UserPermissionRepository(user, context);
                }
                return userPermissionRepository;
            }
        }

        public EntityStatusTypeRepository EntityStatusTypeRepository
        {
            get
            {
                if (entityStatusTypeRepository == null)
                {
                    entityStatusTypeRepository = new EntityStatusTypeRepository(user, context);
                }
                return entityStatusTypeRepository;
            }
        }

        public UserHelpRepository UserHelpRepository
        {
            get
            {
                if (userHelpRepository == null)
                {
                    userHelpRepository = new UserHelpRepository(user, context);
                }
                return userHelpRepository;
            }
        }

        public LogRepository LogRepository
        {
            get
            {
                if (logRepository == null)
                {
                    logRepository = new LogRepository(user, context);
                }
                return logRepository;
            }
        }

        public AuditFeedbackRepository AuditFeedbackRepository
        {
            get
            {
                if (auditFeedbackRepository == null)
                {
                    auditFeedbackRepository = new AuditFeedbackRepository(user, context);
                }
                return auditFeedbackRepository;
            }
        }

        public GoDefFormRepository GoDefFormRepository
        {
            get
            {
                if (goDefFormRepository == null)
                {
                    goDefFormRepository = new GoDefFormRepository(user, context);
                }
                return goDefFormRepository;
            }
        }

        public GoMiscFilesRepository GoMiscFilesRepository
        {
            get
            {
                if (goMiscFilesRepository == null)
                {
                    goMiscFilesRepository = new GoMiscFilesRepository(user, context);
                }
                return goMiscFilesRepository;
            }
        }

        public GoFormRepository GoFormRepository
        {
            get
            {
                if (goFormRepository == null)
                {
                    goFormRepository = new GoFormRepository(user, context);
                }
                return goFormRepository;
            }
        }

        public GoDefElementRepository GoDefElementRepository
        {
            get
            {
                if (goDefElementRepository == null)
                {
                    goDefElementRepository = new GoDefElementRepository(user, context);
                }
                return goDefElementRepository;
            }
        }

        public GoElementRepository GoElementRepository
        {
            get
            {
                if(goElementRepository == null)
                {
                    goElementRepository = new GoElementRepository(user, context);
                }
                return goElementRepository;
            }
        }

        public GoElementFeedbackRepository GoElementFeedbackRepository
        {
            get
            {
                return goElementFeedbackRepository = goElementFeedbackRepository ?? new GoElementFeedbackRepository(user, context);
            }
        }

        public GoElementActionRepository GoElementActionRepository
        {
            get
            {
                return goElementActionRepository = goElementActionRepository ?? new GoElementActionRepository(user, context);
            }
        }

        public GoAssignmentRepository GoAssignmentRepository
        {
            get
            {
                return goAssignmentRepository = goAssignmentRepository ?? new GoAssignmentRepository(user, context);
            }
        }

        public GoElementEvidenceRepository GoElementEvidenceRepository
        {
            get
            {
                return goElementEvidenceRepository = goElementEvidenceRepository ?? new GoElementEvidenceRepository(user, context);
            }
        }

        public EntityPriorityRepository EntityPriorityRepository
        {
            get
            {
                return entityPriorityRepository = entityPriorityRepository ?? new EntityPriorityRepository(user, context);
            }
        }

        public NAODefFormRepository NAODefFormRepository
        {
            get
            {
                return naoDefFormRepository = naoDefFormRepository ?? new NAODefFormRepository(user, context);
            }
        }

        public NAOPeriodRepository NAOPeriodRepository
        {
            get
            {
                return naoPeriodRepository = naoPeriodRepository ?? new NAOPeriodRepository(user, context);
            }
        }

        public NAOPublicationRepository NAOPublicationRepository
        {
            get
            {
                return naoPublicationRepository = naoPublicationRepository ?? new NAOPublicationRepository(user, context);
            }
        }

        public NAOPublicationDirectorateRepository NAOPublicationDirectorateRepository
        {
            get
            {
                return nAOPublicationDirectorateRepository = nAOPublicationDirectorateRepository ?? new NAOPublicationDirectorateRepository(user, context);
            }
        }

        public NAOTypeRepository NAOTypeRepository
        {
            get
            {
                return naoTypeRepository = naoTypeRepository ?? new NAOTypeRepository(user, context);
            }
        }
        public NAORecStatusTypeRepository NAORecStatusTypeRepository
        {
            get
            {
                return naoRecStatusTypeRepository = naoRecStatusTypeRepository ?? new NAORecStatusTypeRepository(user, context);
            }
        }
        public NAOUpdateStatusTypeRepository NAOUpdateStatusTypeRepository 
        {
            get
            {
                return naoUpdateStatusTypeRepository = naoUpdateStatusTypeRepository ?? new NAOUpdateStatusTypeRepository(user, context);
            }
        }
        public NAORecommendationRepository NAORecommendationRepository
        {
            get
            {
                return naoRecommendationRepository = naoRecommendationRepository ?? new NAORecommendationRepository(user, context);
            }
        }

        public NAOUpdateRepository NAOUpdateRepository
        {
            get
            {
                return naoUpdateRepository = naoUpdateRepository ?? new NAOUpdateRepository(user, context);
            }
        }

        public NAOUpdateEvidenceRepository NAOUpdateEvidenceRepository
        {
            get
            {
                return naoUpdateEvidenceRepository = naoUpdateEvidenceRepository ?? new NAOUpdateEvidenceRepository(user, context);
            }
        }

        public NAOUpdateFeedbackRepository NAOUpdateFeedbackRepository
        {
            get
            {
                return naoUpdateFeedbackRepository = naoUpdateFeedbackRepository ?? new NAOUpdateFeedbackRepository(user, context);
            }
        }

        public NAOUpdateFeedbackTypeRepository NAOUpdateFeedbackTypeRepository
        {
            get
            {
                return naoUpdateFeedbackTypeRepository = naoUpdateFeedbackTypeRepository ?? new NAOUpdateFeedbackTypeRepository(user, context);
            }
        }

        public NAOAssignmentRepository NAOAssignmentRepository
        {
            get
            {
                return nAOAssignmentRepository = nAOAssignmentRepository ?? new NAOAssignmentRepository(user, context);
            }
        }

        public NAOOutputRepository NAOOutputRepository
        {
            get
            {
                return nAOOutputRepository = nAOOutputRepository ?? new NAOOutputRepository(user, context);
            }
        }

        public GIAAPeriodRepository GIAAPeriodRepository
        {
            get
            {
                return gIAAPeriodRepository = gIAAPeriodRepository ?? new GIAAPeriodRepository(user, context);
            }
        }

        public GIAAAssuranceRepository GIAAAssuranceRepository
        {
            get
            {
                return gIAAAssuranceRepository = gIAAAssuranceRepository ?? new GIAAAssuranceRepository(user, context);
            }
        }

        public GIAADefFormRepository GIAADefFormRepository
        {
            get
            {
                return gIAADefFormRepository = gIAADefFormRepository ?? new GIAADefFormRepository(user, context);
            }
        }

        public GIAAAuditReportRepository GIAAAuditReportRepository
        {
            get
            {
                return gIAAAuditReportRepository = gIAAAuditReportRepository ?? new GIAAAuditReportRepository(user, context);
            }
        }

        public GIAAActionPriorityRepository GIAAActionPriorityRepository
        {
            get
            {
                return gIAAActionPriorityRepository = gIAAActionPriorityRepository ?? new GIAAActionPriorityRepository(user, context);
            }
        }

        public GIAAActionStatusTypeRepository GIAAActionStatusTypeRepository
        {
            get
            {
                return gIAAActionStatusTypeRepository = gIAAActionStatusTypeRepository ?? new GIAAActionStatusTypeRepository(user, context);
            }
        }

        public GIAARecommendationRepository GIAARecommendationRepository
        {
            get
            {
                return gIAARecommendationRepository = gIAARecommendationRepository ?? new GIAARecommendationRepository(user, context);
            }
        }

        public GIAAUpdateRepository GIAAUpdateRepository
        {
            get
            {
                return gIAAUpdateRepository = gIAAUpdateRepository ?? new GIAAUpdateRepository(user, context);
            }
        }



        public GIAAActionOwnerRepository GIAAActionOwnerRepository
        {
            get
            {
                return gIAAActionOwnerRepository = gIAAActionOwnerRepository ?? new GIAAActionOwnerRepository(user, context);
            }
        }

        public GIAAImportRepository GIAAImportRepository
        {
            get
            {
                return gIAAImportRepository = gIAAImportRepository ?? new GIAAImportRepository(user, context);
            }
        }

        public IAPDefFormRepository IAPDefFormRepository
        {
            get
            {
                return iAPDefFormRepository = iAPDefFormRepository ?? new IAPDefFormRepository(user, context);
            }
        }

        public IAPTypeRepository IAPTypeRepository
        {
            get
            {
                return iAPTypeRepository = iAPTypeRepository ?? new IAPTypeRepository(user, context);
            }
        }

        public IAPStatusTypeRepository IAPStatusTypeRepository
        {
            get
            {
                return iAPStatusTypeRepository = iAPStatusTypeRepository ?? new IAPStatusTypeRepository(user, context);
            }
        }

        public IAPPriorityRepository IAPPriorityRepository
        {
            get
            {
                return iAPPriorityRepository = iAPPriorityRepository ?? new IAPPriorityRepository(user, context);
            }
        }

        public IAPUpdateRepository IAPUpdateRepository
        {
            get
            {
                return iAPUpdateRepository = iAPUpdateRepository ?? new IAPUpdateRepository(user, context);
            }
        }

        public IAPAssignmentRepository IAPAssignmentRepository
        {
            get
            {
                return iAPAssignmentRepository = iAPAssignmentRepository ?? new IAPAssignmentRepository(user, context);
            }
        }



        public SPDGAreaStatRepository SPDGAreaStatRepository
        {
            get
            {
                if (spDGAreaStatRepository == null)
                {
                    spDGAreaStatRepository = new SPDGAreaStatRepository(user, context);
                }
                return spDGAreaStatRepository;
            }
        }

        public SPDirectorateStatRepository SPDirectorateStatRepository
        {
            get
            {
                if (spDirectorateStatRepository == null)
                {
                    spDirectorateStatRepository = new SPDirectorateStatRepository(user, context);
                }
                return spDirectorateStatRepository;
            }
        }

        public SPDivisionStatRepository SPDivisionStatRepository
        {
            get
            {
                if(spDivisionStatRepository == null)
                {
                    spDivisionStatRepository = new SPDivisionStatRepository(user, context);
                }
                return spDivisionStatRepository;
            }
        }

        public ThemeStatRepository ViewThemeStatRepository
        {
            get
            {
                if (viewThemeStatRepository == null)
                {
                    viewThemeStatRepository = new ThemeStatRepository(user, context);
                }
                return viewThemeStatRepository;
            }
        }

        public EmailRepository EmailRepository
        {
            get
            {
                if(emailRepository == null)
                {
                    emailRepository = new EmailRepository(user, context);
                }
                return emailRepository;
            }
        }


        public int SaveChanges()
        {
            return context.SaveChanges();
        }



        #region Dispose

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion Dispose
    }

}
