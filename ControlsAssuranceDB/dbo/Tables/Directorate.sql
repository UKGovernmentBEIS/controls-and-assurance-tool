CREATE TABLE [dbo].[Directorate] (
    [ID]                   INT            IDENTITY (1, 1) NOT NULL,
    [Title]                NVARCHAR (255) NOT NULL,
    [DirectorateGroupID]   INT            NOT NULL,
    [DirectorUserID]       INT            NULL,
    [Objectives]           NVARCHAR (MAX) NULL,
    [EntityStatusID]       INT            NULL,
    [EntityStatusDate]     DATETIME2 (7)  NULL,
    [SysStartTime]         DATETIME2 (0)  CONSTRAINT [DF_Directorates_SysStart] DEFAULT (sysutcdatetime()) NULL,
    [SysEndTime]           DATETIME2 (0)  CONSTRAINT [DF_Directorates_SysEnd] DEFAULT (CONVERT([datetime2](0),'9999-12-31 23:59:59',(0))) NULL,
    [ModifiedByUserID]     INT            NULL,
    [ReportApproverUserID] INT            NULL,
    CONSTRAINT [PK_Directorate] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_Directorate_DirectorateGroup] FOREIGN KEY ([DirectorateGroupID]) REFERENCES [dbo].[DirectorateGroup] ([ID]),
    CONSTRAINT [FK_Directorate_EntityStatusType] FOREIGN KEY ([EntityStatusID]) REFERENCES [dbo].[EntityStatusType] ([ID]),
    CONSTRAINT [FK_Directorate_User] FOREIGN KEY ([DirectorUserID]) REFERENCES [dbo].[User] ([ID])
);

