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
