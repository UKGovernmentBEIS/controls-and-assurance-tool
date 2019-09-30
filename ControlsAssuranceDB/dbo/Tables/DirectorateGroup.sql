CREATE TABLE [dbo].[DirectorateGroup] (
    [ID]                               INT           IDENTITY (1, 1) NOT NULL,
    [Title]                            NVARCHAR (50) NULL,
    [DirectorGeneralUserID]            INT           NULL,
    [RiskChampionDeputyDirectorUserID] INT           NULL,
    [BusinessPartnerUserID]            INT           NULL,
    [SysStartTime]                     DATETIME2 (0) CONSTRAINT [DF_Groups_SysStart] DEFAULT (sysutcdatetime()) NULL,
    [SysEndTime]                       DATETIME2 (0) CONSTRAINT [DF_Groups_SysEnd] DEFAULT (CONVERT([datetime2](0),'9999-12-31 23:59:59',(0))) NULL,
    [ModifiedByUserID]                 INT           NULL,
    [EntityStatusID]                   INT           NULL,
    [EntityStatusDate]                 DATETIME2 (7) NULL,
    CONSTRAINT [PK_DirectorateGroup] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_DirectorateGroup_EntityStatusType] FOREIGN KEY ([EntityStatusID]) REFERENCES [dbo].[EntityStatusType] ([ID]),
    CONSTRAINT [FK_DirectorateGroup_User] FOREIGN KEY ([DirectorGeneralUserID]) REFERENCES [dbo].[User] ([ID])
);

